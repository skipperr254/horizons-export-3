import React from 'react';
import StoryCardSkeleton from './StoryCardSkeleton';

const StoriesGridSkeleton = ({ count = 6 }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, index) => (
      <StoryCardSkeleton key={index} />
    ))}
  </div>
);

export default StoriesGridSkeleton;