import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useDashboardData = (user, navigate) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_stories_with_user_data', { p_user_id: user.id });

      if (error) throw error;
      
      const storiesWithDefaults = data.map(story => ({
        ...story
      }));

      setStories(storiesWithDefaults.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || []);

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      if (navigate) navigate('/login');
      return;
    }

    const channel = supabase.channel('stories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stories' }, (payload) => {
        console.log('Story change received!', payload);
        fetchDashboardData(); 
      })
      .subscribe();

    fetchDashboardData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate, fetchDashboardData]);

  const readStoryDetails = stories.filter(s => s.is_read);

  return {
    stories,
    loading,
    readStoryDetails,
    savedStories: stories.filter(s => s.is_saved),
  };
};