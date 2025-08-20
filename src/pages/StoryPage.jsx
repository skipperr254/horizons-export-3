import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import StoryContent from '@/components/story/StoryContent';
import PremiumModal from '@/components/story/PremiumModal';
import ImmersiveReaderHeader from '@/components/story/reader/ImmersiveReaderHeader';
import ReaderControls from '@/components/story/reader/ReaderControls';
import AssistantPanel from '@/components/story/reader/AssistantPanel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getTranslation, preloadTranslations } from '@/lib/dictionary';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useStoryData } from '@/hooks/useStoryData';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { getDailyA1Stories } from '@/utils/dailyStorySelector';
import { cn } from '@/lib/utils';
import { useStoryPagination } from '@/hooks/useStoryPagination';
import { useStoryInteraction } from '@/hooks/useStoryInteraction';
import Seo from '@/components/Seo';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

const pageVariants = {
  enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

const StoryPage = () => {
  const { slug } = useParams();
  const { user, canAccessPremiumFeatures } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalContent, setPremiumModalContent] = useState({ title: '', description: '' });
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isEyeComfortMode, setIsEyeComfortMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isHighlightActive, setIsHighlightActive] = useState(false);
  
  const [selectedWord, setSelectedWord] = useState(null);
  const [translationInfo, setTranslationInfo] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const storyContentRef = useRef(null);
  const progressAppliedRef = useRef(false);
  const highlightTimeoutRef = useRef(null);

  const { story, isSaved, isRead, loading, toggleSaveStory, toggleReadStatus, progress } = useStoryData(slug, user, navigate);

  const { pages, currentPage, direction, paginate, setCurrentPage, fontSize, setFontSize } = useStoryPagination(story?.content);
  
  const { voices, isPlaying, isPaused, handlePronounce, handleListen, cleanupSpeech, speechRate, setSpeechRate } = useSpeechSynthesis();

  const triggerPremiumModal = useCallback((title, description) => {
    setPremiumModalContent({ title, description });
    setShowPremiumModal(true);
  }, []);

  const {
    isCurrentWordSaved,
    isCheckingSaveStatus,
    isSavingWord,
    handleSaveWord,
    saveProgress,
    handleMarkPosition
  } = useStoryInteraction(user, story, selectedWord, toast, triggerPremiumModal, currentPage, storyContentRef);

  const handleWordClick = useCallback(async (e) => {
    const clickedElement = e.target;
    if (!clickedElement.classList.contains('word-token')) {
      return;
    }
    
    if(storyContentRef.current) {
        const previouslySelected = storyContentRef.current.querySelectorAll('.selected-word');
        previouslySelected.forEach(el => el.classList.remove('selected-word'));
    }
    
    clickedElement.classList.add('selected-word');
    
    const wordToFetch = clickedElement.getAttribute('data-word');
    setSelectedWord(wordToFetch);
    setTranslationInfo(null);
    setIsTranslating(true);
    if (!isAssistantOpen) setIsAssistantOpen(true);

    try {
      const translationData = await getTranslation(wordToFetch);
      setTranslationInfo(translationData);
    } catch (error) {
      console.error('Word data fetching error:', error);
      setTranslationInfo({ translation: 'Çeviri alınamadı.', error: true });
    } finally {
      setIsTranslating(false);
    }
  }, [isAssistantOpen]);

  useEffect(() => {
    if (!loading && story?.content) {
      const allWords = story.content.match(/\b(\w+)\b/g);
      if(allWords) {
        const uniqueWords = [...new Set(allWords)];
        preloadTranslations(uniqueWords);
      }
    }
  }, [loading, story?.content]);


  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
      saveProgress();
      cleanupSpeech();
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, [cleanupSpeech, saveProgress]);

  const clearHighlight = useCallback(() => {
    if (storyContentRef.current) {
      const highlightedEl = storyContentRef.current.querySelector('.marked-word-highlight');
      if (highlightedEl) {
        highlightedEl.classList.remove('marked-word-highlight');
      }
    }
    setIsHighlightActive(false);
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (!loading && story && pages.length > 0 && progress && !progressAppliedRef.current) {
      const { page_number, word_index, show_highlight } = progress;
      if (show_highlight && page_number >= 0 && page_number < pages.length) {
        setCurrentPage([page_number, 0]);
        setTimeout(() => {
          if (storyContentRef.current && word_index !== null) {
            const wordElement = storyContentRef.current.querySelector(`[data-word-index="${word_index}"]`);
            if (wordElement) {
              wordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              wordElement.classList.add('marked-word-highlight');
              setIsHighlightActive(true);
              toast({ title: "Kaldığınız yerden devam ediyorsunuz!", description: "Hikayede en son işaretlediğiniz konuma geldiniz." });
              
              highlightTimeoutRef.current = setTimeout(clearHighlight, 15000);
            }
          }
          try {
            const newProgress = { ...progress, show_highlight: false };
            localStorage.setItem(`story_progress_${user.id}_${story.id}`, JSON.stringify(newProgress));
          } catch (e) {
            console.error("Failed to update progress in localStorage", e);
          }
        }, 200);
      }
      progressAppliedRef.current = true;
    }
  }, [loading, story, pages, progress, toast, setCurrentPage, user, clearHighlight]);

  useEffect(() => {
    const contentElement = storyContentRef.current;
    if (!contentElement || !isHighlightActive) return;

    const handleInteraction = () => {
      clearHighlight();
    };

    contentElement.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('scroll', handleInteraction, { once: true, capture: true });

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('click', handleInteraction);
      }
      window.removeEventListener('scroll', handleInteraction, { capture: true });
    };
  }, [isHighlightActive, clearHighlight]);

  const paginateWithCleanup = useCallback((newDirection) => {
    cleanupSpeech();
    paginate(newDirection);
  }, [cleanupSpeech, paginate]);

  useEffect(() => {
    const checkAccess = async () => {
      if (loading || !story || !user) return;
      if (!canAccessPremiumFeatures) {
        if (story.level !== 'a1') {
          navigate('/dashboard');
          toast({ title: 'Premium Gerekli', description: 'Bu hikayeye erişmek için Premium üye olmalısınız.', variant: 'destructive' });
          return;
        }
        try {
          const { data: allStories, error } = await supabase.from('stories').select('id, level').order('created_at', { ascending: false });
          if (error) throw error;
          const { unlocked } = getDailyA1Stories(allStories);
          if (!unlocked.includes(story.id)) {
            navigate('/dashboard');
            toast({ title: 'Erişim Süresi Doldu', description: 'Bu hikayenin günlük erişim süresi dolmuştur. Yarın yeni hikayeleri keşfedin!', variant: 'destructive' });
          }
        } catch (error) {
          console.error("Error checking story access:", error);
          navigate('/dashboard');
        }
      }
    };
    checkAccess();
  }, [story, user, loading, navigate, toast, canAccessPremiumFeatures]);
  
  const handleToggleSave = async () => {
    const result = await toggleSaveStory();
    if (result?.requiresPremium) {
      triggerPremiumModal('Hikayeleri Kaydet', "Premium'a geçerek hikayeleri kaydedebilir ve dilediğin zaman kaldığın yerden devam edebilirsin.");
    }
  };

  const onListen = () => {
    if (!canAccessPremiumFeatures) {
      triggerPremiumModal('Sesli Okuma', 'Hikayeleri sesli dinlemek bir Premium özelliktir.');
      return;
    }
    if (typeof window.speechSynthesis === 'undefined') {
        toast({ title: 'Cihazınızda sesli okuma desteklenmiyor.', variant: 'destructive' });
        return;
    }
    
    const currentPageContent = pages[currentPage] || '';
    if (!currentPageContent) return;
    const storyObjectForListen = { ...story, content: currentPageContent };
    handleListen(storyObjectForListen, storyContentRef.current);
  };
  
  const handleToggleAssistant = () => setIsAssistantOpen(prev => !prev);
  const toggleEyeComfortMode = () => setIsEyeComfortMode(prev => !prev);
  const handleBack = () => setShowExitConfirm(true);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Hikaye yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center"><p className="text-muted-foreground">Hikaye bulunamadı.</p></div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={story.title}
        description={story.description}
        image={story.image_url}
        url={`/story/${story.slug}`}
        type="article"
        keywords={`${story.level} İngilizce hikaye, ${story.title}, İngilizce okuma parçası`}
        schema={{
          "@type": "Book",
          "name": story.title,
          "author": {
            "@type": "Organization",
            "name": "HikayeGO"
          },
          "inLanguage": "en",
          "description": story.description,
          "image": story.image_url,
          "bookFormat": "https://schema.org/EBook",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": story.rating || "4.5",
            "bestRating": "5",
            "ratingCount": story.rating_count || "100"
          }
        }}
      />

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} onUpgrade={() => navigate('/subscription')} title={premiumModalContent.title} description={premiumModalContent.description} />
      
      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ayrılmak istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Okuma ekranından ayrılırsanız ilerlemeniz kaydedilmeyebilir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/dashboard')}>Ayrıl</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className={cn("fixed inset-0 text-foreground overflow-hidden transition-colors duration-500", isEyeComfortMode && "sepia-mode")}>
        <ImmersiveReaderHeader
          story={story} isSaved={isSaved} isRead={isRead} isPlaying={isPlaying} isPaused={isPaused}
          onBack={handleBack} onListen={onListen} onToggleSave={handleToggleSave} onToggleRead={toggleReadStatus}
          isEyeComfortMode={isEyeComfortMode} onToggleEyeComfortMode={toggleEyeComfortMode}
        />

        <main className="relative h-full w-full">
          <div className="absolute inset-x-0 top-16 md:top-20 bottom-16 md:bottom-20 overflow-y-auto">
             <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentPage}
                className={cn(
                  "absolute inset-0 flex items-start justify-center px-4",
                  isMobile ? "overscroll-y-contain" : ""
                )}
                custom={direction} variants={pageVariants} initial="enter" animate="center" exit="exit"
                transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                drag={isMobile ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }} dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  if (isMobile) return;
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) paginateWithCleanup(1);
                  else if (swipe > swipeConfidenceThreshold) paginateWithCleanup(-1);
                }}
              >
                <StoryContent 
                  ref={storyContentRef} 
                  content={pages[currentPage] || ''} 
                  onWordClick={handleWordClick}
                  fontSize={fontSize}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <ReaderControls
            currentPage={currentPage} totalPages={pages.length} onPageChange={paginateWithCleanup}
            fontSize={fontSize} onFontSizeChange={setFontSize} onToggleAssistant={handleToggleAssistant}
            speechRate={speechRate}
            onSpeechRateChange={setSpeechRate}
        />
        
        <AssistantPanel
          isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)}
          selectedWord={selectedWord} translationInfo={translationInfo} isTranslating={isTranslating}
          onPronounce={handlePronounce} 
          onSaveWord={handleSaveWord}
          onMarkPosition={handleMarkPosition}
          isWordSaved={isCurrentWordSaved}
          isCheckingSaveStatus={isCheckingSaveStatus}
          isSavingWord={isSavingWord}
        />
      </div>
    </>
  );
};

export default StoryPage;