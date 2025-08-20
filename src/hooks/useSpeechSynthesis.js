import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [playbackState, setPlaybackState] = useState('stopped');
  const [speechRate, setSpeechRate] = useState(1.0);

  const utteranceRef = useRef(null);
  const isMountedRef = useRef(true);

  const cleanup = useCallback((callback) => {
    if (typeof window.speechSynthesis === 'undefined') {
      if (callback) callback();
      return;
    }

    if (utteranceRef.current) {
      utteranceRef.current.onstart = null;
      utteranceRef.current.onpause = null;
      utteranceRef.current.onresume = null;
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      utteranceRef.current.onboundary = null;
      utteranceRef.current = null;
    }

    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    
    const checkCancel = setInterval(() => {
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
        clearInterval(checkCancel);
        if (isMountedRef.current) {
          setPlaybackState('stopped');
        }
        if (callback) callback();
      }
    }, 50);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    const loadVoices = () => {
      if (typeof window.speechSynthesis === 'undefined') return;
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0 && isMountedRef.current) {
        const englishVoices = availableVoices.filter(v => v.lang.startsWith('en-'));
        setVoices(englishVoices);
      }
    };

    if (typeof window.speechSynthesis !== 'undefined') {
      loadVoices();

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
        
        const voiceInterval = setInterval(() => {
          const v = window.speechSynthesis.getVoices();
          if (v.length > 0) {
            loadVoices();
            clearInterval(voiceInterval);
            window.speechSynthesis.onvoiceschanged = null;
          }
        }, 200);

        if (!window.speechSynthesis.speaking) {
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
        }
      }
    }

    return () => {
      isMountedRef.current = false;
      if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = null;
      }
      cleanup();
    };
  }, [cleanup]);

  const getBestVoice = useCallback(() => {
    const currentVoices = voices.length > 0 ? voices : (typeof window.speechSynthesis !== 'undefined' ? window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en-')) : []);
    if (currentVoices.length === 0) return null;
    
    const voicePreferences = [
      v => /Google US English/i.test(v.name),
      v => /Samantha/i.test(v.name),
      v => /Microsoft Zira Desktop - English (United States)/i.test(v.name),
      v => v.lang === 'en-US' && /neural/i.test(v.name),
      v => v.lang === 'en-US' && /female/i.test(v.name),
      v => v.lang === 'en-US',
      v => v.lang.startsWith('en-'),
    ];

    for (const preference of voicePreferences) {
      const voice = currentVoices.find(preference);
      if (voice) return voice;
    }
    return currentVoices[0] || null;
  }, [voices]);

  const speak = useCallback((text, element, rate, onBoundary) => {
    if (!text || typeof window.speechSynthesis === 'undefined' || !isMountedRef.current) return;

    const voice = getBestVoice();
    if (!voice) {
        console.warn('No suitable English voice found. Using browser default.');
    }

    const newUtterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      newUtterance.voice = voice;
      newUtterance.lang = voice.lang;
    }
    newUtterance.rate = rate;
    newUtterance.pitch = 1.0;
    newUtterance.volume = 1.0;
    utteranceRef.current = newUtterance;
    
    newUtterance.onstart = () => { if (isMountedRef.current) setPlaybackState('playing'); };
    newUtterance.onpause = () => { if (isMountedRef.current) setPlaybackState('paused'); };
    newUtterance.onresume = () => { if (isMountedRef.current) setPlaybackState('playing'); };
    newUtterance.onend = () => { if (isMountedRef.current) { cleanup(); } };
    newUtterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      if (isMountedRef.current) { cleanup(); }
    };
    newUtterance.onboundary = onBoundary;
    
    window.speechSynthesis.speak(newUtterance);
  }, [getBestVoice, cleanup]);
  
  const handleListen = useCallback((story, storyContentElement) => {
    if (playbackState === 'playing') {
      window.speechSynthesis.pause();
      return;
    }
    if (playbackState === 'paused') {
      window.speechSynthesis.resume();
      return;
    }

    let lastHighlightedWordIndex = -1;
    
    const onBoundary = (event) => {
        if (event.name !== 'word' || !storyContentElement) return;

        const words = Array.from(storyContentElement.querySelectorAll('.word-token'));
        const textUpToBoundary = story.content.substring(0, event.charIndex + event.charLength);
        const spokenWordsCount = textUpToBoundary.split(/\s+/).filter(Boolean).length;
        
        const wordIndex = spokenWordsCount -1;
       
        if(wordIndex > lastHighlightedWordIndex && wordIndex < words.length){
            if (lastHighlightedWordIndex !== -1 && words[lastHighlightedWordIndex]) {
              words[lastHighlightedWordIndex].classList.remove('reading-highlight');
            }
            
            const currentWordEl = words[wordIndex];
            if(currentWordEl){
              currentWordEl.classList.add('reading-highlight');
              currentWordEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
              lastHighlightedWordIndex = wordIndex;
            }
        }
    };
    
    cleanup(() => speak(story.content, storyContentElement, speechRate, onBoundary));
  }, [playbackState, speechRate, speak, cleanup]);
  
  const handlePronounce = useCallback((wordToPronounce) => {
    if (!wordToPronounce || typeof window.speechSynthesis === 'undefined') return;
    cleanup(() => {
        const voice = getBestVoice();
        const utterance = new SpeechSynthesisUtterance(wordToPronounce);
        if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang || 'en-US';
        }
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    });
  }, [getBestVoice, cleanup]);

  const updateSpeechRate = useCallback((newRate) => {
    setSpeechRate(newRate);
  }, []);

  return {
    voices,
    isPlaying: playbackState === 'playing',
    isPaused: playbackState === 'paused',
    playbackState,
    speechRate,
    setSpeechRate: updateSpeechRate,
    handlePronounce,
    handleListen,
    cleanupSpeech: cleanup,
  };
};