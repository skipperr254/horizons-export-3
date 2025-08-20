import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';
import StoriesGrid from '@/components/dashboard/StoriesGrid';
import StoriesGridSkeleton from '@/components/dashboard/skeletons/StoriesGridSkeleton';
import EmptyState from '@/components/dashboard/EmptyState';
import Seo from '@/components/Seo';
import LibraryHeader from '@/components/library/LibraryHeader';
import useLocalStorage from '@/hooks/useLocalStorage';
import { getDailyA1Stories } from '@/utils/dailyStorySelector';

const DashboardPage = () => {
  const { user, canAccessPremiumFeatures } = useAuth();
  const navigate = useNavigate();
  const { stories, loading } = useDashboardData(user, navigate);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusLevel] = useLocalStorage('focusLevel', 'all');
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    readTime: 'all',
    rating: 'all',
  });

  useEffect(() => {
    if (focusLevel && focusLevel !== 'all') {
      setFilters(prev => ({ ...prev, level: focusLevel }));
    }
  }, [focusLevel]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({ level: 'all', category: 'all', readTime: 'all', rating: 'all' });
  };

  const processedStories = useMemo(() => {
    if (!stories) return [];
    if (canAccessPremiumFeatures) {
      return stories.map(s => ({ ...s, is_locked: false }));
    }
    const { unlocked, lockedForPreview } = getDailyA1Stories(stories);
    
    const unlockedStories = stories
      .filter(story => unlocked.includes(story.id))
      .map(story => ({ ...story, is_locked: false }));

    const lockedStories = stories
      .filter(story => lockedForPreview.includes(story.id))
      .map(story => ({ ...story, is_locked: true }));

    const otherLockedStories = stories
      .filter(story => story.level !== 'a1' && !unlocked.includes(story.id) && !lockedForPreview.includes(story.id))
      .map(story => ({ ...story, is_locked: true }));

    return [...unlockedStories, ...lockedStories, ...otherLockedStories];
  }, [stories, canAccessPremiumFeatures]);
  

  const filteredStories = useMemo(() => {
    if (!processedStories) return [];
    return processedStories.filter(story => {
      const searchMatch = story.title.toLowerCase().includes(searchTerm.toLowerCase());
      const levelMatch = filters.level === 'all' || story.level === filters.level;
      const categoryMatch = filters.category === 'all' || story.category === filters.category;
      
      const readTimeValue = story.read_time ? parseInt(story.read_time.split(' ')[0]) : 0;
      const readTimeMatch = filters.readTime === 'all' || (
        (filters.readTime === '1-3 dk' && readTimeValue >= 1 && readTimeValue <= 3) ||
        (filters.readTime === '4-7 dk' && readTimeValue >= 4 && readTimeValue <= 7) ||
        (filters.readTime === '8+ dk' && readTimeValue >= 8)
      );

      const ratingValue = story.rating || 0;
      const ratingMatch = filters.rating === 'all' || (
        (filters.rating === '4+' && ratingValue >= 4) ||
        (filters.rating === '3+' && ratingValue >= 3) ||
        (filters.rating === '2+' && ratingValue >= 2) ||
        (filters.rating === '1+' && ratingValue >= 1)
      );
      
      return searchMatch && levelMatch && categoryMatch && readTimeMatch && ratingMatch;
    });
  }, [processedStories, searchTerm, filters]);

  return (
    <>
      <Seo
        title="Kütüphane"
        description="İngilizce hikaye kütüphanemizi keşfedin. Seviyenize ve ilgi alanlarınıza göre hikayeler bulun."
        url="/dashboard"
      />
      <div className="w-full">
        <LibraryHeader 
          onSearchChange={setSearchTerm}
          onFilterChange={handleFilterChange}
          filters={filters}
          onResetFilters={handleResetFilters}
          currentSearchTerm={searchTerm}
        />
        
        {loading ? (
          <StoriesGridSkeleton count={8} />
        ) : filteredStories.length > 0 ? (
          <StoriesGrid stories={filteredStories} loading={loading} />
        ) : (
          <EmptyState onResetFilters={handleResetFilters} />
        )}
      </div>
    </>
  );
};

export default DashboardPage;