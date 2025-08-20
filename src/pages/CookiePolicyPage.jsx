import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';

const CookiePolicyPage = () => {
  return (
    <>
      <Seo
        title="Çerez Politikası"
        description="HikayeGO çerez politikası. Web sitemizde çerezleri nasıl kullandığımızı ve tercihlerinizi nasıl yönetebileceğinizi öğrenin."
        url="/cookie-policy"
      />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow container mx-auto py-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose dark:prose-invert max-w-4xl mx-auto"
          >
            <h1>Çerez Politikası</h1>
            <p className="lead">Son Güncelleme: 02 Temmuz 2025</p>
            
            <h2>1. Giriş</h2>
            <p>HikayeGO olarak, web sitemizi ("Hizmet") ziyaret ettiğinizde deneyiminizi geliştirmek, hizmetlerimizi iyileştirmek ve güvenliği sağlamak amacıyla çerezler ve benzeri teknolojiler kullanıyoruz. Bu Çerez Politikası, hangi çerezleri, neden kullandığımızı ve bu çerezleri nasıl kontrol edebileceğinizi açıklamaktadır.</p>

            <h2>2. Çerez Nedir?</h2>
            <p>Çerezler, bir web sitesini ziyaret ettiğinizde bilgisayarınıza veya mobil cihazınıza indirilen küçük metin dosyalarıdır. Bu dosyalar, web sitesinin sizi ve tercihlerinizi (örneğin, oturum açma bilgileri, dil veya tema seçimi) hatırlamasına yardımcı olur, böylece siteyi her ziyaret ettiğinizde aynı bilgileri tekrar girmeniz gerekmez.</p>

            <h2>3. Kullandığımız Çerez Türleri</h2>
            <p>Platformumuzda aşağıdaki çerez türlerini kullanmaktayız:</p>
            <ul>
              <li>
                <strong>Kesinlikle Gerekli Çerezler:</strong> Bu çerezler, web sitemizin temel işlevlerinin çalışması için zorunludur. Örneğin, kullanıcı oturumlarını yönetmek, güvenliği sağlamak ve çerez onay durumunuzu hatırlamak için kullanılırlar. Bu çerezler olmadan hizmetlerimizi güvenli ve düzgün bir şekilde sunamayız.
              </li>
              <li>
                <strong>Performans ve Analitik Çerezler:</strong> Bu çerezler, ziyaretçilerin sitemizi nasıl kullandığı hakkında anonim bilgiler toplar. Hangi sayfaların en popüler olduğunu, kullanıcıların sitede ne kadar zaman geçirdiğini ve hangi hatalarla karşılaştıklarını anlamamıza yardımcı olur. Bu verileri, sitemizin performansını ve kullanıcı deneyimini sürekli olarak iyileştirmek için kullanırız.
              </li>
              <li>
                <strong>İşlevsellik Çerezleri:</strong> Bu çerezler, sitemizi daha kişisel bir deneyim haline getirmek için kullanılır. Örneğin, seçtiğiniz tema (karanlık/aydınlık mod) veya dil tercihi gibi ayarlarınızı hatırlamamızı sağlarlar.
              </li>
              <li>
                <strong>Hedefleme ve Reklam Çerezleri:</strong> Şu anda platformumuzda üçüncü taraf reklam çerezleri kullanmıyoruz. Gelecekte bu politikayı değiştirirsek, bu bölümü güncelleyerek sizi bilgilendireceğiz.
              </li>
            </ul>

            <h2>4. Çerezleri Nasıl Yönetebilirsiniz?</h2>
            <p>Çerez tercihlerinizi yönetme hakkına sahipsiniz. Çoğu web tarayıcısı, çerezleri kabul edecek şekilde ayarlanmıştır, ancak genellikle tarayıcınızın ayarlarını değiştirerek çerezleri reddedebilir veya bir çerez gönderildiğinde sizi uyaracak şekilde yapılandırabilirsiniz.</p>
            <p>Lütfen unutmayın ki, kesinlikle gerekli çerezleri devre dışı bırakırsanız, web sitemizin bazı bölümleri (örneğin, oturum açma) beklendiği gibi çalışmayabilir.</p>
            <p>Sitemizi ilk ziyaretinizde size sunulan çerez onay banner'ı aracılığıyla da tercihlerinizi belirtebilirsiniz. Onayınızı verdikten sonra, bu tercihiniz bir çerez aracılığıyla saklanır ve banner bir sonraki ziyaretinizde tekrar gösterilmez.</p>

            <h2>5. Politikadaki Değişiklikler</h2>
            <p>Bu Çerez Politikasını zaman zaman güncelleyebiliriz. Değişiklikler, bu sayfada yayınlandığı anda yürürlüğe girer. Politikayı düzenli olarak gözden geçirmenizi öneririz.</p>

            <h2>6. İletişim</h2>
            <p>Çerez politikamız hakkında daha fazla bilgi almak isterseniz, lütfen bizimle <a href="mailto:destek@hikayego.com">destek@hikayego.com</a> e-posta adresi üzerinden iletişime geçin.</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CookiePolicyPage;