import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useStoryData = (slug, user, navigate) => {
  const { canAccessPremiumFeatures } = useAuth();
  const [story, setStory] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const fetchedRef = useRef(false);
  const storySlugRef = useRef(null);
  const userIdRef = useRef(null);
  const storyIdRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (slug !== storySlugRef.current || user.id !== userIdRef.current || !fetchedRef.current) {
      storySlugRef.current = slug;
      userIdRef.current = user.id;
      fetchedRef.current = true;
      fetchStoryData();
    }
  }, [slug, user, navigate]);

  const fetchStoryData = async () => {
    if (!slug || !user) return;
    
    setLoading(true);
    try {
      // First, get the story by slug
      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (storyError || !storyData) {
        console.error('Story fetch failed:', storyError);
        toast({ title: "Hikaye bulunamadı", description: "Aradığınız hikaye mevcut değil veya URL yanlış.", variant: "destructive" });
        navigate('/dashboard');
        return;
      }
      
      setStory(storyData);
      storyIdRef.current = storyData.id;

      // Now fetch user-specific data
      const [savedResult, readResult] = await Promise.allSettled([
        supabase
          .from('user_saved_stories')
          .select('story_id')
          .eq('user_id', user.id)
          .eq('story_id', storyData.id)
          .maybeSingle(),
        supabase
          .from('user_read_stories')
          .select('story_id')
          .eq('user_id', user.id)
          .eq('story_id', storyData.id)
          .maybeSingle(),
      ]);

      if (savedResult.status === 'fulfilled' && !savedResult.value.error) {
        setIsSaved(!!savedResult.value.data);
      } else {
        setIsSaved(false);
      }

      if (readResult.status === 'fulfilled' && !readResult.value.error) {
        setIsRead(!!readResult.value.data);
      } else {
        setIsRead(false);
      }

      try {
        const progressData = localStorage.getItem(`story_progress_${user.id}_${storyData.id}`);
        if (progressData) {
          setProgress(JSON.parse(progressData));
        } else {
          setProgress(null);
        }
      } catch (e) {
        console.error("Failed to read progress from localStorage", e);
        setProgress(null);
      }

    } catch (error) {
      console.error('Story data fetch error:', error);
      setStory(null);
      setIsSaved(false);
      setIsRead(false);
      setProgress(null);
      toast({ title: "Hata", description: "Hikaye verileri yüklenirken bir sorun oluştu.", variant: "destructive" });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveStory = async () => {
    const storyId = storyIdRef.current;
    if (!storyId) return;

    if (!canAccessPremiumFeatures) {
      return { requiresPremium: true };
    }
    try {
      if (isSaved) {
        const { error } = await supabase
          .from('user_saved_stories')
          .delete()
          .eq('user_id', user.id)
          .eq('story_id', storyId);

        if (error) throw error;
        setIsSaved(false);
        toast({ title: "Hikaye kaldırıldı", description: "Hikaye kayıtlı listesinden çıkarıldı." });
      } else {
        const { error } = await supabase
          .from('user_saved_stories')
          .insert({ user_id: user.id, story_id: storyId, saved_at: new Date().toISOString() });
        if (error) throw error;
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save story:', error);
      toast({ title: "Hata", description: "İşlem sırasında bir hata oluştu.", variant: "destructive" });
    }
  };

  const toggleReadStatus = async () => {
    const storyId = storyIdRef.current;
    if (!storyId) return;
    try {
      if (isRead) {
        const { error } = await supabase
          .from('user_read_stories')
          .delete()
          .eq('user_id', user.id)
          .eq('story_id', storyId);
        if (error) throw error;
        setIsRead(false);
        toast({ title: "Okundu işareti kaldırıldı", description: "Hikaye okunmadı olarak işaretlendi." });
      } else {
        const { error } = await supabase
          .from('user_read_stories')
          .insert({ user_id: user.id, story_id: storyId, read_at: new Date().toISOString() });
        if (error) throw error;
        setIsRead(true);
        toast({ title: "Hikaye okundu! 🎉", description: "Tebrikler! Bir hikayeyi daha tamamladın." });
      }
    } catch (error) {
      console.error('Error toggling read status:', error);
    }
  };

  return { story, isSaved, isRead, progress, loading, toggleSaveStory, toggleReadStatus };
};