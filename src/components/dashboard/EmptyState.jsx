import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyState = React.memo(({ onResetFilters }) => {

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
      <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">Hikaye bulunamadı</h3>
      <p className="text-muted-foreground">Arama kriterlerinizi değiştirmeyi deneyin.</p>
       <Button variant="outline" onClick={onResetFilters} className="mt-4">
        Filtreleri Sıfırla
      </Button>
    </motion.div>
  );
});

export default EmptyState;