export const validateRegistrationData = (name, email, password) => {
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Ad Soyad en az 2 karakter olmalıdır');
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Geçerli bir e-posta adresi girin');
  }
  
  if (!password || password.length < 6) {
    errors.push('Şifre en az 6 karakter olmalıdır');
  }
  
  return errors;
};

export const handleLoginError = (error) => {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('invalid login credentials')) {
    return {
      type: 'invalid_credentials',
      message: 'E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.'
    };
  }
  if (errorMessage.includes('email not confirmed')) {
    return {
      type: 'email_not_confirmed',
      message: 'Giriş yapmadan önce e-posta adresinizi doğrulamanız gerekiyor. Lütfen e-posta kutunuzu kontrol edin.'
    };
  }
  if (errorMessage.includes('too many requests') || errorMessage.includes('rate limit exceeded')) {
    return {
      type: 'rate_limit',
      message: 'Çok fazla başarısız deneme yaptınız. Lütfen bir süre bekleyip tekrar deneyin.'
    };
  }

  return {
    type: 'generic',
    message: 'Giriş sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  };
};

export const handleRegistrationError = (error) => {
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('user already registered') || errorMessage.includes('already been registered')) {
    return 'Bu e-posta adresi zaten kullanımda. Lütfen giriş yapmayı deneyin.';
  }
  if (errorMessage.includes('email rate limit exceeded')) {
    return 'Çok fazla deneme yaptınız. Lütfen bir süre bekleyip tekrar deneyin.';
  }
  if (errorMessage.includes('for security purposes')) {
    return 'Güvenlik nedeniyle bir süre bekleyip tekrar deneyiniz. Çok fazla deneme yaptınız.';
  }
  if (errorMessage.includes('password should be at least')) {
    return 'Şifreniz en az 8 karakter olmalı ve güvenlik kurallarını karşılamalıdır.';
  }
  if (errorMessage.includes('unable to validate email address') || errorMessage.includes('is invalid')) {
    return 'Geçersiz e-posta adresi. Lütfen geçerli bir e-posta adresi kullanın.';
  }
  if (errorMessage.includes('invalid name')) {
    return 'Geçersiz ad veya soyad.';
  }
  
  return 'Kayıt sırasında beklenmedik bir hata oluştu. Lütfen tekrar deneyin.';
};

export const handlePasswordResetError = (error) => {
    const errorMessage = error.message.toLowerCase();
    const errorCode = error.code;

    if (errorCode === '429' || errorMessage.includes('email rate limit exceeded') || errorMessage.includes('for security purposes')) {
        return 'Çok fazla deneme yaptınız. Lütfen bir süre bekleyip tekrar deneyin.';
    }
    if (errorMessage.includes('token has expired') || errorMessage.includes('link is invalid') || errorMessage.includes('expired') || errorMessage.includes('not found') || errorMessage.includes('token not found')) {
        return 'Doğrulama bağlantısının süresi doldu veya geçersiz. Lütfen yeni bir sıfırlama talebinde bulunun.';
    }
    if (errorMessage.includes('same as the old')) {
        return 'Yeni şifreniz eski şifreyle aynı olamaz.';
    }
    if (errorMessage.includes('user not found')) {
        return 'Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı.';
    }
    return 'Şifre sıfırlanırken bir hata oluştu. Lütfen tekrar deneyin.';
};