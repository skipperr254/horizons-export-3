import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import Seo from '@/components/Seo';
import { supabase } from '@/lib/customSupabaseClient';

const ContactPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const message = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    const emailBody = `
      <h2>Yeni İletişim Formu Mesajı</h2>
      <p><strong>Gönderen:</strong> ${message.name}</p>
      <p><strong>E-posta:</strong> ${message.email}</p>
      <p><strong>Konu:</strong> ${message.subject}</p>
      <hr>
      <h3>Mesaj:</h3>
      <p>${message.message.replace(/\n/g, '<br>')}</p>
    `;

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: JSON.stringify({
          subject: `İletişim Formu: ${message.subject}`,
          body: emailBody,
          from_name: message.name,
          from_email: message.email,
        }),
      });

      if (error) throw error;

      toast({
        title: "Mesajınız Gönderildi!",
        description: "En kısa sürede size geri dönüş yapacağız.",
      });
      e.target.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Hata!",
        description: "Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Bize Ulaşın"
        description="HikayeGO ile iletişime geçin. Sorularınız, önerileriniz veya işbirliği talepleriniz için buradayız."
        url="/contact"
      />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto py-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-text">İletişime</span> Geçin
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Sorularınız, önerileriniz veya sadece bir merhaba demek için bize yazın!
            </p>
          </motion.div>

          <div className="mt-16 grid md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl font-bold mb-6">İletişim Bilgileri</h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 mr-4 text-primary" />
                  <a href="mailto:contact@hikayego.com" className="text-lg text-muted-foreground hover:text-primary">contact@hikayego.com</a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 mr-4 text-primary" />
                  <span className="text-lg text-muted-foreground">+90 555 123 4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 mr-4 text-primary" />
                  <span className="text-lg text-muted-foreground">Teknoloji Parkı, İstanbul, Türkiye</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl font-bold mb-6">Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Adınız</Label>
                    <Input id="name" name="name" required disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresiniz</Label>
                    <Input id="email" name="email" type="email" required disabled={loading} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Konu</Label>
                  <Input id="subject" name="subject" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mesajınız</Label>
                  <Textarea id="message" name="message" rows={5} required disabled={loading} />
                </div>
                <Button type="submit" className="w-full btn-glow" disabled={loading}>
                  {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : 'Gönder'}
                </Button>
              </form>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;