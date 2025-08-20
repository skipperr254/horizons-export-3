import { supabase } from '@/lib/customSupabaseClient';

const createSeededRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
};

export const getDailyA1Stories = (allStories) => {
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const seededRandom = createSeededRandom(dateSeed);

  const a1Stories = allStories.filter(story => story.level === 'a1');

  for (let i = a1Stories.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [a1Stories[i], a1Stories[j]] = [a1Stories[j], a1Stories[i]];
  }

  const unlocked = a1Stories.slice(0, 4);
  const lockedForPreview = a1Stories.slice(4, 8);

  return {
    unlocked: unlocked.map(s => s.id),
    lockedForPreview: lockedForPreview.map(s => s.id),
    allDailyIds: [...unlocked.map(s => s.id), ...lockedForPreview.map(s => s.id)],
  };
};