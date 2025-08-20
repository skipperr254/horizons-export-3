import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, User, Lock, Activity, BarChart3, Star, Download } from 'lucide-react';
import Seo from '@/components/Seo';

const faqs = [
  {
    question: "Hesap bilgilerimi (e-posta, şifre) nasıl değiştirebilirim?",
    answer: "Profil bilgilerinizi, şifrenizi ve avatarınızı 'Ayarlar' sayfasından kolayca güncelleyebilirsiniz. Ayarlar sayfasına, profil menünüzdeki 'Ayarlar' bağlantısına tıklayarak ulaşabilirsiniz."
  },
  {
    question: "HikayeGO Premium aboneliği neleri içerir?",
    answer: "Premium abonelik; tüm seviyelerdeki hikayelere sınırsız erişim, gelişmiş sesli okuma, sınırsız kelime kaydetme ve pratik yapma, hikayeleri PDF olarak indirme, hikayeleri favorilere ekleme ve tamamen reklamsız bir deneyim sunar."
  },
  {
    question: "Aboneliğimi nasıl iptal edebilirim?",
    answer: "Aboneliğinizi 'Ayarlar' sayfasındaki 'Abonelik' bölümünden istediğiniz zaman iptal edebilirsiniz. İptal işlemi, mevcut fatura döneminizin sonunda geçerli olacaktır ve o zamana kadar premium özelliklerden yararlanmaya devam edebilirsiniz."
  },
  {
    question: "'Aktiviteler' bölümü ne işe yarar?",
    answer: "'Aktiviteler' bölümü, hikayelerden öğrendiğiniz kelime dağarcığını ve gramer yapılarını pekiştirmenize yardımcı olan quizler ve kelime eşleştirme oyunları gibi çeşitli alıştırmalar içerir."
  },
  {
    question: "Gelişimimi nasıl takip edebilirim?",
    answer: "Okuma geçmişiniz ve kaydettiğiniz kelimeler profiliniz altında takip edilir. 'Aktiviteler' sayfasından kaydettiğiniz kelimelerle pratik yapabilir ve kelime bilginizi test edebilirsiniz."
  },
  {
    question: "Kelime asistanı nasıl çalışır?",
    answer: "Hikaye okurken anlamını bilmediğiniz bir kelimeye tıkladığınızda, kelime asistanı anında kelimenin Türkçe çevirisini, telaffuzunu ve örnek cümle içindeki kullanımını gösterir. 'Kaydet' butonuna basarak bu kelimeyi kişisel kelime listenize ekleyebilirsiniz."
  },
  {
    question: "Yeni hikayeler ne sıklıkla ekleniyor?",
    answer: "Platformumuza düzenli olarak yeni hikayeler ve içerikler eklemeye özen gösteriyoruz. Her seviyeden kullanıcı için sürekli olarak yeni maceralar sunmayı hedefliyoruz."
  }
];

const HelpCenterPage = () => {
  return (
    <>
      <Seo
        title="Yardım Merkezi"
        description="HikayeGO hakkında sıkça sorulan sorular ve cevapları."
        url="/help-center"
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
            <LifeBuoy className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Yardım Merkezi
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto mt-12"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HelpCenterPage;