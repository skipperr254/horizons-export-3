import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Loader2, Volume2, Bookmark, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const AssistantPanel = ({
  isOpen,
  onClose,
  selectedWord,
  translationInfo,
  isTranslating,
  onPronounce,
  onSaveWord,
  onMarkPosition,
  isWordSaved,
  isCheckingSaveStatus,
  isSavingWord,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [panelHeight, setPanelHeight] = useState(60); // vh

  const handleDrag = (event, info) => {
    const delta = -info.delta.y;
    const deltaVh = (delta / window.innerHeight) * 100;
    let newHeight = panelHeight + deltaVh;
    newHeight = Math.max(30, Math.min(90, newHeight));
    setPanelHeight(newHeight);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 150 && info.velocity.y > 20) {
      onClose();
    }
  };

  const mobileVariants = {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  };

  const desktopVariants = {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  };

  const variants = isMobile ? mobileVariants : desktopVariants;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={isMobile ? 'mobile-assistant' : 'desktop-assistant'}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={isMobile ? { height: `${panelHeight}vh` } : {}}
          className={isMobile 
            ? "fixed bottom-0 left-0 right-0 w-full z-[60] touch-none" 
            : "fixed top-0 right-0 h-full w-full max-w-sm z-[60]"}
        >
          <Card className={isMobile 
            ? "h-full w-full rounded-t-2xl rounded-b-none shadow-2xl flex flex-col bg-background/90 backdrop-blur-lg relative overflow-hidden"
            : "h-full w-full rounded-l-2xl rounded-r-none shadow-2xl flex flex-col bg-background/90 backdrop-blur-lg"
          }>
            {isMobile && (
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0}
                dragMomentum={false}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                className="absolute top-0 left-0 right-0 h-6 flex justify-center items-start pt-3 cursor-row-resize z-20"
              >
                <div className="w-10 h-1.5 bg-muted-foreground/50 rounded-full" />
              </motion.div>
            )}
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
              <CardTitle className="text-lg">Yardımcı Asistan</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 flex-1 overflow-y-auto flex flex-col">
              <div className="flex-grow">
                {selectedWord ? (
                  <div>
                    <h3 className="text-2xl font-bold capitalize text-primary mb-4">{selectedWord}</h3>
                    {isTranslating ? (
                      <div className="flex items-center justify-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : translationInfo ? (
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-lg">{translationInfo.translation}</p>
                          <p className="text-sm text-muted-foreground">{translationInfo.partOfSpeech}</p>
                        </div>
                        {translationInfo.example && (
                          <div className="p-3 bg-secondary rounded-lg">
                            <p className="font-semibold text-sm mb-1">Örnek Cümle:</p>
                            <p className="italic">"{translationInfo.example}"</p>
                          </div>
                        )}
                        <div className="flex gap-2 pt-4">
                          <Button onClick={() => onPronounce(selectedWord)} className="flex-1">
                            <Volume2 className="mr-2 h-4 w-4" /> Telaffuz
                          </Button>
                          <Button 
                            onClick={() => onSaveWord(selectedWord, translationInfo.translation)} 
                            variant={isWordSaved ? "secondary" : "outline"} 
                            className="flex-1"
                            disabled={isCheckingSaveStatus || isSavingWord || isWordSaved}
                          >
                            {isSavingWord || isCheckingSaveStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isWordSaved ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
                            {isWordSaved ? 'Kaydedildi' : 'Kaydet'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p>Çeviri bulunamadı.</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground pt-10">
                    <p>Bir kelime seçerek çevirisini ve telaffuzunu öğrenebilirsiniz.</p>
                  </div>
                )}
              </div>
               {!isMobile && (
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full" onClick={onMarkPosition}>
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Kaldığım yeri işaretle
                  </Button>
                </div>
              )}
            </CardContent>
            {isMobile && (
              <div className="p-4 border-t flex-shrink-0">
                <Button variant="outline" className="w-full" onClick={onMarkPosition}>
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  Kaldığım yeri işaretle
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssistantPanel;