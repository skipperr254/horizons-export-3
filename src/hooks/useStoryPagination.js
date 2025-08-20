import { useState, useEffect, useCallback } from 'react';

export const useStoryPagination = (storyContent, initialFontSize = 20) => {
  const [pages, setPages] = useState([]);
  const [[currentPage, direction], setCurrentPage] = useState([0, 0]);
  const [fontSize, setFontSize] = useState(initialFontSize);

  useEffect(() => {
    if (storyContent) {
      const wordsPerPage = Math.round(300 - ((fontSize - 1) / 99) * 180);
      const paragraphs = storyContent.split(/\n+/).filter(p => p.trim().length > 0);
      const newPages = [];
      let currentPageText = '';

      paragraphs.forEach(p => {
        const currentWords = currentPageText.split(/\s+/).filter(Boolean).length;
        const paragraphWords = p.split(/\s+/).filter(Boolean).length;
        if (currentWords + paragraphWords > wordsPerPage && currentPageText.length > 0) {
          newPages.push(currentPageText.trim());
          currentPageText = p;
        } else {
          currentPageText += (currentPageText.length > 0 ? '\n\n' : '') + p;
        }
      });

      if (currentPageText.length > 0) newPages.push(currentPageText.trim());
      setPages(newPages);
      if (currentPage >= newPages.length) {
        setCurrentPage([newPages.length > 0 ? newPages.length - 1 : 0, 0]);
      }
    }
  }, [storyContent, fontSize, currentPage]);

  const paginate = useCallback((newDirection) => {
    const newPage = currentPage + newDirection;
    if (newPage >= 0 && newPage < pages.length) {
      setCurrentPage([newPage, newDirection]);
    }
  }, [currentPage, pages.length]);

  return { pages, currentPage, direction, paginate, setCurrentPage, fontSize, setFontSize };
};