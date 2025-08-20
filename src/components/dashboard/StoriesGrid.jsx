import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookmarkCheck, Lock, Crown } from "lucide-react";
import StarRating from "./StarRating";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import CountdownTimer from "./CountdownTimer";
import { Button } from "@/components/ui/button";

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const StoryCard = React.memo(({ story }) => {
  const { user, canAccessPremiumFeatures } = useAuth();
  const navigate = useNavigate();

  const isLocked = !canAccessPremiumFeatures && story.is_locked;

  const isNew = React.useMemo(() => {
    if (!story.created_at) return false;
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(story.created_at) > threeDaysAgo;
  }, [story.created_at]);

  const cardContent = (
    <Card className='h-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group bg-card border relative'>
      <CardHeader className='p-0'>
        <div className='relative overflow-hidden cursor-pointer aspect-[16/10] group'>
          <motion.img
            alt={story.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-500 ease-in-out",
              (story.is_read || isLocked) && "grayscale"
            )}
            src={
              story.image_url ||
              "https://images.unsplash.com/photo-1650371212637-f245fd18b1d9"
            }
            loading='lazy'
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>

          {!isLocked && (
            <motion.div
              className='absolute inset-0 p-4 flex items-end bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <p className='text-white text-sm line-clamp-4'>
                {story.description}
              </p>
            </motion.div>
          )}

          <div className='absolute top-3 right-3 flex flex-col items-end gap-2 z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300'>
            <Badge
              className={cn(
                `level-badge level-${story.level} shadow-lg`,
                "border-transparent"
              )}
            >
              {story.level.toUpperCase()}
            </Badge>
            {isNew && !isLocked && (
              <Badge variant='new' className='shadow-lg border-transparent'>
                Yeni
              </Badge>
            )}
          </div>
          {story.is_saved && !isLocked && (
            <div className='absolute top-3 left-3 z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300'>
              <Badge
                variant='secondary'
                className='bg-blue-500 text-white shadow-lg border-transparent'
              >
                <BookmarkCheck className='h-3 w-3 mr-1' />
                Kayıtlı
              </Badge>
            </div>
          )}

          {isLocked ? (
            <div className='absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-2 sm:p-4 text-center'>
              {story.level === "a1" ? (
                <>
                  <Lock className='h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2' />
                  <h3 className='font-bold text-base sm:text-lg mb-1'>
                    Yeni Hikaye Yolda!
                  </h3>
                  <p className='text-xs sm:text-sm mb-2 sm:mb-3'>
                    Bu hikaye yakında açılacak.
                  </p>
                  <CountdownTimer />
                  <Button
                    size='sm'
                    className='mt-2 sm:mt-4 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm'
                    onClick={() => navigate("/subscription")}
                  >
                    <Crown className='mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4' />{" "}
                    Anında Eriş
                  </Button>
                </>
              ) : (
                <>
                  <Crown className='h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2 text-amber-400' />
                  <h3 className='font-bold text-base sm:text-lg mb-1'>
                    Premium İçerik
                  </h3>
                  <p className='text-xs sm:text-sm'>
                    Bu hikayeye erişmek için Premium'a geç.
                  </p>
                </>
              )}
            </div>
          ) : (
            story.is_read && (
              <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                <div className='bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg'>
                  ✓ Okundu
                </div>
              </div>
            )
          )}
        </div>
      </CardHeader>

      <CardContent className='p-4 flex flex-col flex-grow'>
        <CardTitle
          className={cn(
            "mb-1 text-base font-bold transition-colors cursor-pointer line-clamp-1",
            !isLocked && "group-hover:text-primary"
          )}
        >
          {story.title}
        </CardTitle>
        <div className='flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2 border-t'>
          <div className='flex items-center space-x-1'>
            <Clock className='h-3 w-3' />
            <span>{story.read_time}</span>
          </div>
          <StarRating storyId={story.id} initialAvgRating={story.rating} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div variants={cardVariants} className='h-full'>
      {isLocked ? (
        story.level !== "a1" ? (
          <div
            onClick={() => navigate("/subscription")}
            className='h-full cursor-pointer'
          >
            {cardContent}
          </div>
        ) : (
          <div className='h-full cursor-default'>{cardContent}</div>
        )
      ) : (
        <Link to={`/story/${story.slug}`} className='h-full block'>
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
});

const StoriesGrid = ({ stories, loading }) => {
  if (loading) {
    return null;
  }

  return (
    <motion.div
      className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6'
      variants={gridVariants}
      initial='hidden'
      animate='visible'
    >
      {(stories || []).map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </motion.div>
  );
};

export default StoriesGrid;
