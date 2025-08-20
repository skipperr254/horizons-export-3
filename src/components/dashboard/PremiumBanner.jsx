import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PremiumBanner = React.memo(({ onUpgrade }) => {
  const { canAccessPremiumFeatures } = useAuth();

  if (canAccessPremiumFeatures) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <Card className="mb-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
        <CardHeader className="relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center">
                <Crown className="mr-2 h-6 w-6 text-primary" />
                Potansiyelini Ortaya Çıkar! ✨
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Tüm hikayelerin ve özelliklerin kilidini açmak için Premium'a geç. 
                <span className="font-semibold text-primary"> Sınırsız hikaye, sesli dinleme ve daha fazlası!</span>
              </p>
            </div>
            <Button onClick={onUpgrade} className="btn-glow shrink-0">
              <Crown className="mr-2 h-4 w-4" /> Premium'a Geç
            </Button>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
});

export default PremiumBanner;