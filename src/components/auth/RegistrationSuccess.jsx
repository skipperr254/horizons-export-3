import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MailCheck, ArrowLeft } from 'lucide-react';

const RegistrationSuccess = ({ email, onBackToLogin }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center p-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4"
      >
        <MailCheck className="w-8 h-8 text-green-500" />
      </motion.div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Kayıt Başarılı!</h2>
      <p className="text-muted-foreground mb-4">
        Hesabınızı doğrulamak için <strong className="text-primary">{email}</strong> adresine bir e-posta gönderdik.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Lütfen gelen kutunuzu kontrol edin ve doğrulama bağlantısına tıklayın. Spam klasörünü de kontrol etmeyi unutmayın!
      </p>
      <Button onClick={onBackToLogin} variant="outline" className="w-full group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Giriş Ekranına Dön
      </Button>
    </motion.div>
  );
};

export default RegistrationSuccess;