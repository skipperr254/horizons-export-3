import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';

const TermsOfServicePage = () => {
  return (
    <>
      <Seo
        title="Kullanım Koşulları"
        description="HikayeGO hizmetlerinin kullanım koşulları. Platformumuzu kullanarak kabul ettiğiniz şartlar ve sorumluluklar."
        url="/terms-of-service"
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
            <h1>Kullanım Koşulları</h1>
            <p className="lead">Son Güncelleme: 29 Temmuz 2025</p>
            
            <h2>1. Şartların Kabulü</h2>
            <p>
              HikayeGO'ya ("Hizmet", "Platform") hoş geldiniz. Bu web sitesine erişerek veya hizmetlerimizi kullanarak, bu Kullanım Koşullarını ("Şartlar") ve ayrılmaz bir parçası olan <a href="/privacy-policy">Gizlilik Politikamızı</a> ve <a href="/cookie-policy">Çerez Politikamızı</a> okuduğunuzu, anladığınızı ve yasal olarak bağlayıcı olduğunu kabul etmiş olursunuz. Bu şartları kabul etmiyorsanız, Hizmeti kullanmamalısınız.
            </p>

            <h2>2. Hizmetin Tanımı</h2>
            <p>
              HikayeGO, kullanıcılara İngilizce dil becerilerini geliştirmeleri için çeşitli seviyelerde hikayeler, kelime öğrenme araçları, etkileşimli testler ve diğer dil öğrenme kaynaklarını sunan bir çevrimiçi platformdur. Hizmet, sınırlı özelliklere sahip ücretsiz bir plan ("Ücretsiz Plan") ve tüm özelliklere erişim sağlayan ücretli abonelik planları ("Premium Plan") içerebilir.
            </p>

            <h2>3. Kullanıcı Hesapları ve Sorumlulukları</h2>
            <p>
              Hizmetin belirli özelliklerinden yararlanmak için bir hesap oluşturmanız gerekmektedir. Hesap oluştururken verdiğiniz bilgilerin doğru, güncel ve eksiksiz olduğunu taahhüt edersiniz. Hesap şifrenizin gizliliğini korumak ve hesabınız altında gerçekleşen tüm faaliyetlerden tamamen siz sorumlusunuz. Hesabınızın yetkisiz kullanıldığını fark ettiğinizde derhal bizi bilgilendirmelisiniz. 13 yaşın altındaki kullanıcıların ebeveyn veya vasi onayı ile hesap oluşturması gerekmektedir.
            </p>

            <h2>4. Abonelikler, Ücretlendirme ve İptal</h2>
            <ul>
              <li>
                <strong>Premium Plan:</strong> Premium özelliklere erişim, belirtilen ücretler karşılığında aylık veya yıllık abonelikle sağlanır. Abonelik ücretleri ve özellikleri, abonelik sayfasında belirtilmiştir ve zaman zaman güncellenebilir.
              </li>
              <li>
                <strong>Ücretsiz Deneme:</strong> Yeni kullanıcılara belirli bir süre için Premium Plan'ı ücretsiz deneme ("Ücretsiz Deneme") imkanı sunabiliriz. Ücretsiz Deneme süresi sonunda, iptal etmediğiniz takdirde aboneliğiniz otomatik olarak ücretli bir Premium Plan'a dönüşecektir. Bu durum, deneme başlangıcında size açıkça belirtilecektir.
              </li>
              <li>
                <strong>Otomatik Yenileme:</strong> Aboneliğiniz, siz iptal edene kadar mevcut abonelik döneminizin sonunda otomatik olarak yenilenir. Yenileme, o anki geçerli abonelik ücreti üzerinden yapılır.
              </li>
              <li>
                <strong>İptal ve İade Politikası:</strong> Aboneliğinizi istediğiniz zaman hesap ayarlarınızdan iptal edebilirsiniz. <strong>İptal işlemi, mevcut fatura döneminizin sonunda yürürlüğe girer.</strong> Bu tarihe kadar Premium özelliklerden yararlanmaya devam edebilirsiniz. Yasaların gerektirdiği durumlar dışında, <strong>işlenmiş ödemeler ve mevcut abonelik dönemleri için kısmi veya tam geri ödeme yapılmaz.</strong> Abonelik iptali, gelecekteki yenileme ödemelerini durdurur.
              </li>
            </ul>

            <h2>5. Fikri Mülkiyet Hakları</h2>
            <p>
              Platformda yer alan hikayeler, metinler, grafikler, logolar, görseller, yazılımlar ve diğer tüm materyaller ("İçerik"), HikayeGO ve lisans verenlerinin mülkiyetindedir. Bu içerikler, telif hakkı ve diğer fikri mülkiyet yasalarıyla korunmaktadır. Size, yalnızca kişisel ve ticari olmayan kullanımınız için Hizmete erişim ve İçeriği kullanma konusunda sınırlı, münhasır olmayan, devredilemez bir lisans veriyoruz. İçeriği çoğaltmanız, dağıtmanız, değiştirmeniz veya türev çalışmalar oluşturmanız kesinlikle yasaktır.
            </p>

            <h2>6. Yasaklanmış Faaliyetler</h2>
            <p>
              Hizmeti kullanırken aşağıdakileri yapmamayı kabul edersiniz:
              <ul>
                <li>Yasa dışı, dolandırıcılık amaçlı, zararlı, tehdit edici veya taciz edici herhangi bir faaliyette bulunmak.</li>
                <li>Platformun altyapısına aşırı yük bindirecek veya hizmetin normal işleyişini engelleyecek (örneğin, DDoS saldırıları) eylemlerde bulunmak.</li>
                <li>Hizmetin herhangi bir bölümünü tersine mühendislik yapmak, kaynak koduna dönüştürmek veya kopyalamak.</li>
                <li>Virüs, solucan veya diğer kötü amaçlı yazılımları yaymak.</li>
                <li>Başka bir kullanıcının hesabına izinsiz erişmeye çalışmak.</li>
              </ul>
            </p>

            <h2>7. Sorumluluğun Reddi ve Sınırlandırılması</h2>
            <p>
              Hizmet, "olduğu gibi" ve "mevcut olduğu şekilde" sunulmaktadır. Hizmetin kesintisiz, hatasız veya tamamen güvenli olacağını garanti etmiyoruz. HikayeGO, hizmetin kullanımından veya kullanılamamasından kaynaklanan dolaylı, arızi veya sonuç olarak ortaya çıkan zararlardan sorumlu tutulamaz.
            </p>

            <h2>8. Fesih</h2>
            <p>
              Bu Şartları ihlal etmeniz durumunda, kendi takdirimize bağlı olarak, önceden bildirimde bulunmaksızın hesabınızı ve Hizmete erişiminizi derhal askıya alma veya feshetme hakkımızı saklı tutarız.
            </p>

            <h2>9. Geçerli Hukuk ve Anlaşmazlıkların Çözümü</h2>
            <p>
              Bu Şartlar, Türkiye Cumhuriyeti kanunlarına göre yönetilecek ve yorumlanacaktır. Bu Şartlardan kaynaklanan veya bunlarla ilgili herhangi bir anlaşmazlık durumunda, İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.
            </p>

            <h2>10. Şartlardaki Değişiklikler</h2>
            <p>
              Bu Kullanım Koşullarını zaman zaman değiştirme hakkımızı saklı tutarız. Değişiklikler bu sayfada yayınlandıktan sonra yürürlüğe girer. Değişikliklerden sonra Hizmeti kullanmaya devam etmeniz, güncellenmiş Şartları kabul ettiğiniz anlamına gelir. Önemli değişiklikler hakkında sizi bilgilendirmek için makul çabayı göstereceğiz.
            </p>

            <h2>11. İletişim</h2>
            <p>
              Bu Kullanım Koşulları ile ilgili herhangi bir sorunuz varsa, lütfen bizimle <a href="mailto:destek@hikayego.com">destek@hikayego.com</a> adresinden iletişime geçin.
            </p>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TermsOfServicePage;