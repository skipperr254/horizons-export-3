import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Seo
        title="Gizlilik Politikası"
        description="HikayeGO gizlilik politikası. Verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında bilgi edinin."
        url="/privacy-policy"
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
            <h1>Gizlilik Politikası</h1>
            <p className="lead">Son Güncelleme: 02 Temmuz 2025</p>
            
            <h2>1. Giriş</h2>
            <p>
              HikayeGO ("biz", "bize", veya "bizim") olarak, gizliliğinize ve kişisel verilerinizin korunmasına büyük önem veriyoruz. Bu Gizlilik Politikası, web sitemizi ve hizmetlerimizi ("Hizmet") kullandığınızda kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı, paylaştığımızı ve koruduğumuzu ayrıntılı bir şekilde açıklamaktadır. Hizmetimizi kullanarak, bu politikada açıklanan uygulamaları kabul etmiş olursunuz.
            </p>

            <h2>2. Topladığımız Bilgiler</h2>
            <p>
              Hizmetlerimizi sunmak ve geliştirmek için çeşitli türde bilgiler topluyoruz:
            </p>
            <ul>
              <li><strong>Kayıt Bilgileri:</strong> Bir hesap oluşturduğunuzda, adınız, soyadınız ve e-posta adresiniz gibi bilgileri toplarız.</li>
              <li><strong>Profil Bilgileri:</strong> İsteğe bağlı olarak profilinize ekleyebileceğiniz avatar gibi ek bilgileri saklayabiliriz.</li>
              <li><strong>Kullanım ve İlerleme Verileri:</strong> Hangi hikayeleri okuduğunuz, hangi kelimeleri öğrendiğiniz, quiz sonuçlarınız, platformda ne kadar zaman geçirdiğiniz ve diğer etkileşimleriniz gibi öğrenme ilerlemenizle ilgili verileri toplarız.</li>
              <li><strong>Ödeme Bilgileri:</strong> Premium abonelik satın aldığınızda, ödeme işleminizi güvenli bir şekilde gerçekleştirmek için iyzico gibi üçüncü taraf ödeme işlemcileri kullanırız. Kredi kartı numaranız gibi hassas ödeme bilgilerinizi sunucularımızda saklamayız veya işlemeyiz. Yalnızca abonelik durumunuzu (aktif, iptal edilmiş vb.) ve işlem onayını saklarız.</li>
              <li><strong>Teknik Veriler:</strong> IP adresiniz, tarayıcı türünüz, işletim sisteminiz, yönlendiren URL'ler ve ziyaret tarih/saat bilgileri gibi teknik verileri otomatik olarak toplayabiliriz.</li>
              <li><strong>Çerezler ve Benzer Teknolojiler:</strong> Sitemizdeki deneyiminizi iyileştirmek için çerezler kullanıyoruz. Daha fazla bilgi için lütfen <a href="/cookie-policy">Çerez Politikamızı</a> inceleyin.</li>
            </ul>

            <h2>3. Bilgilerinizi Nasıl Kullanıyoruz?</h2>
            <p>
              Topladığımız bilgileri aşağıdaki meşru amaçlar doğrultusunda kullanırız:
            </p>
            <ul>
                <li><strong>Hizmeti Sunmak ve Yönetmek:</strong> Hesabınızı oluşturmak, oturumunuzu açık tutmak ve platformun tüm özelliklerine erişmenizi sağlamak.</li>
                <li><strong>Deneyimi Kişiselleştirmek:</strong> Öğrenme seviyenize ve ilgi alanlarınıza uygun hikayeler ve içerikler önermek.</li>
                <li><strong>İletişim Kurmak:</strong> Size hizmetle ilgili önemli güncellemeler, güvenlik uyarıları, işlem bildirimleri ve destek taleplerinize yanıtlar göndermek.</li>
                <li><strong>Hizmeti Geliştirmek:</strong> Kullanım verilerini analiz ederek platformun hangi özelliklerinin popüler olduğunu anlamak, hataları tespit etmek ve genel kullanıcı deneyimini iyileştirmek.</li>
                <li><strong>Güvenliği Sağlamak:</strong> Dolandırıcılığı önlemek, hizmet şartlarımızı uygulamak ve platformun güvenliğini korumak.</li>
            </ul>

            <h2>4. Bilgilerinizi Nasıl Paylaşıyoruz?</h2>
            <p>
              Kişisel bilgilerinizi sizin onayınız olmadan üçüncü taraflara satmayız veya kiralamayız. Bilgilerinizi yalnızca aşağıdaki durumlarda paylaşabiliriz:
            </p>
            <ul>
              <li><strong>Hizmet Sağlayıcılar:</strong> Web sitemizi barındıran, ödemeleri işleyen (örn. iyzico), e-posta gönderimi yapan ve veri analizi hizmetleri sunan güvenilir üçüncü taraf hizmet sağlayıcılarla, yalnızca hizmetlerini yerine getirebilmeleri için gerekli olan bilgileri paylaşırız.</li>
              <li><strong>Yasal Yükümlülükler:</strong> Yasal bir zorunluluk, mahkeme kararı veya resmi bir talep olması durumunda bilgilerinizi yetkili makamlarla paylaşabiliriz.</li>
            </ul>

            <h2>5. Veri Güvenliği</h2>
            <p>
              Kişisel bilgilerinizi yetkisiz erişime, değiştirilmeye, ifşa edilmeye veya imha edilmeye karşı korumak için endüstri standardı teknik ve idari güvenlik önlemleri alıyoruz. Bu önlemler arasında veri şifreleme (SSL), güvenli sunucu altyapısı ve erişim kontrolleri bulunmaktadır. Ancak, internet üzerinden hiçbir aktarım yönteminin veya elektronik depolama yönteminin %100 güvenli olmadığını unutmamanız önemlidir.
            </p>

            <h2>6. Veri Saklama</h2>
            <p>
              Kişisel bilgilerinizi, hesabınız aktif olduğu sürece veya size hizmet sunmak için gerekli olduğu sürece saklarız. Yasal yükümlülüklerimizi yerine getirmek, anlaşmazlıkları çözmek ve sözleşmelerimizi uygulamak için gerekli olduğu ölçüde bilgilerinizi saklamaya ve kullanmaya devam edebiliriz.
            </p>

            <h2>7. Haklarınız</h2>
            <p>
              Veri koruma yasaları kapsamında, kişisel bilgilerinizle ilgili çeşitli haklara sahipsiniz. Bu haklar arasında bilgilerinize erişme, onları düzeltme, silme veya işlenmesini kısıtlama talebinde bulunma hakkı bulunmaktadır. Bu haklarınızı kullanmak için lütfen hesap ayarlarınızı ziyaret edin veya bizimle iletişime geçin.
            </p>

            <h2>8. Çocukların Gizliliği</h2>
            <p>
              Hizmetimiz 13 yaşın altındaki çocuklara yönelik değildir. Bilerek 13 yaşın altındaki çocuklardan kişisel bilgi toplamıyoruz. Bir ebeveyn veya vasi iseniz ve çocuğunuzun bize kişisel bilgi sağladığını fark ederseniz, lütfen bizimle iletişime geçin.
            </p>

            <h2>9. Politikadaki Değişiklikler</h2>
            <p>
              Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olması durumunda, size e-posta yoluyla veya hizmetimiz üzerinden belirgin bir bildirimle haber vereceğiz.
            </p>

            <h2>10. Bize Ulaşın</h2>
            <p>
              Bu Gizlilik Politikası ile ilgili herhangi bir sorunuz veya endişeniz varsa, lütfen bizimle <a href="mailto:destek@hikayego.com">destek@hikayego.com</a> adresinden iletişime geçin.
            </p>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;