import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { refreshUserProfile } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Doğrulama işlemi yapılıyor, lütfen bekleyin...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      const hash = location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const errorDescription = params.get('error_description');

      if (errorDescription) {
        console.error('Auth callback error:', errorDescription);
        if (errorDescription.includes('User has already been confirmed')) {
          toast({
            title: 'Hesap Zaten Doğrulanmış',
            description: 'E-posta adresiniz zaten doğrulanmış. Giriş yapabilirsiniz.',
          });
          navigate('/login', { replace: true });
          return;
        }
        
        if (errorDescription.includes('Email link is invalid or has expired')) {
          setMessage('Doğrulama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir doğrulama e-postası isteyin.');
        } else {
          setMessage(`Bir hata oluştu: ${errorDescription}`);
        }
        setStatus('error');
        toast({
          title: 'Doğrulama Hatası',
          description: message,
          variant: 'destructive',
        });
        return;
      }

      try {
        await refreshUserProfile();
        setStatus('success');
        setMessage('E-posta adresiniz başarıyla doğrulandı! Giriş sayfasına yönlendiriliyorsunuz...');
        toast({
          title: 'Başarılı!',
          description: 'Hesabınız doğrulandı. Artık giriş yapabilirsiniz.',
        });
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } catch (e) {
        setStatus('error');
        setMessage('Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
        toast({
          title: 'Hata',
          description: 'Profiliniz güncellenirken bir sorun oluştu.',
          variant: 'destructive',
        });
      }
    };

    handleAuthCallback();
  }, [location, navigate, toast, refreshUserProfile]);

  const renderStatus = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <CardTitle>Doğrulanıyor...</CardTitle>
            <CardDescription>{message}</CardDescription>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <CardTitle>Başarılı!</CardTitle>
            <CardDescription>{message}</CardDescription>
          </>
        );
      case 'error':
        return (
          <>
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <CardTitle>Hata!</CardTitle>
            <CardDescription>{message}</CardDescription>
            <Button onClick={() => navigate('/login')} className="mt-4">Giriş Sayfasına Dön</Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Seo
        title="Hesap Doğrulama"
        description="HikayeGO hesap doğrulama sayfası."
        noIndex={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="flex justify-center">
                {renderStatus()}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bu pencereyi güvenle kapatabilirsiniz.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AuthCallbackPage;