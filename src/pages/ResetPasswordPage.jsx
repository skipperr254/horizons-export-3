import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/customSupabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Seo from "@/components/Seo";

// Simple error handler for Supabase errors
const handlePasswordResetError = (error) => {
  if (error.message.includes("password should be at least")) {
    return "Şifre en az 8 karakter olmalıdır.";
  }
  if (error.message.includes("invalid") || error.message.includes("expired")) {
    return "Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir talep oluşturun.";
  }
  return error.message || "Bir hata oluştu. Lütfen tekrar deneyin.";
};

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      // Grab tokens from URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      console.log("Access token: ", access_token);
      console.log("Refresh token: ", refresh_token);
      console.log("Type: ", type);

      if (access_token && refresh_token && type === "recovery") {
        // Manually set session (important for mobile/in-app browsers)
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error("Error setting session:", error);
        } else {
          setIsRecoveryMode(true);
        }
        // Clear hash from URL after processing (optional, cleaner URL)
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } else {
        // Fallback: check if session already exists
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setIsRecoveryMode(true);
        }
      }

      setCheckingSession(false);

      // Listen for Supabase auth events
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsRecoveryMode(true);
          setCheckingSession(false);
        } else if (event === "USER_UPDATED") {
          toast({
            title: "Şifre başarıyla güncellendi!",
            description: "Yeni şifrenizle giriş yapabilirsiniz.",
            variant: "success",
          });
          navigate("/login");
        }
      });

      return () => subscription.unsubscribe();
    };

    init();
  }, [navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      toast({
        title: "Hata",
        description: "Şifreler eşleşmiyor.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      toast({
        title: "Hata",
        description: "Şifre en az 8 karakter olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      // Success handled by USER_UPDATED event
    } catch (err) {
      const friendlyError = handlePasswordResetError(err);
      setError(friendlyError);
      toast({
        title: "Hata",
        description: friendlyError,
        variant: "destructive",
      });
      if (
        friendlyError.includes("geçersiz") ||
        friendlyError.includes("süresi dolmuş")
      ) {
        setTimeout(() => navigate("/forgot-password"), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (checkingSession) {
      return (
        <div className='flex justify-center items-center p-8'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      );
    }

    if (!isRecoveryMode) {
      return (
        <div className='text-center p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'>
          <AlertCircle className='mx-auto h-12 w-12 text-destructive mb-4' />
          <h3 className='text-xl font-semibold text-destructive'>Hata</h3>
          <p className='text-muted-foreground mt-2'>
            {error || "Bu şifre sıfırlama bağlantısı geçersiz."}
          </p>
          <Button
            onClick={() => navigate("/forgot-password")}
            className='mt-6 w-full'
          >
            Yeni Bağlantı İste
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='password'>Yeni Şifre</Label>
          <div className='relative group'>
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
            <Input
              id='password'
              type={showPassword ? "text" : "password"}
              placeholder='En az 8 karakter'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className='pl-10 pr-10 h-10 text-sm'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors'
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>Yeni Şifre Tekrar</Label>
          <div className='relative group'>
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
            <Input
              id='confirmPassword'
              type={showConfirmPassword ? "text" : "password"}
              placeholder='Şifrenizi tekrar girin'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className='pl-10 pr-10 h-10 text-sm'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors'
            >
              {showConfirmPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
        </div>
        {error && (
          <p className='text-xs text-destructive flex items-center'>
            <AlertCircle className='h-3 w-3 mr-1' />
            {error}
          </p>
        )}
        <Button type='submit' className='w-full' disabled={loading}>
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Güncelleniyor...
            </>
          ) : (
            "Şifreyi Güncelle"
          )}
        </Button>
      </form>
    );
  };

  return (
    <>
      <Seo
        title='Yeni Şifre Belirle'
        description='HikayeGO hesabınız için yeni bir şifre oluşturun.'
        url='/reset-password'
        keywords='yeni şifre, şifre güncelleme, hesap güvenliği'
      />
      <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-secondary/20 relative'>
        <div className='absolute top-4 right-4'>
          <ThemeToggle />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md z-10'
        >
          <Card className='backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/20 shadow-2xl'>
            <CardHeader className='text-center'>
              <CardTitle className='text-2xl md:text-3xl font-bold'>
                Yeni Şifre Belirle
              </CardTitle>
              <CardDescription className='text-base'>
                Hesabınız için yeni bir şifre oluşturun.
              </CardDescription>
            </CardHeader>
            <CardContent>{renderContent()}</CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
