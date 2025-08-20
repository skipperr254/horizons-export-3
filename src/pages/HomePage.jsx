import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import HeroSection from '@/components/home/HeroSection';
import Seo from '@/components/Seo';
import { Skeleton } from '@/components/ui/skeleton';

const WhyHikayeGOSection = React.lazy(() => import('@/components/home/WhyHikayeGOSection'));
const HowItWorksSection = React.lazy(() => import('@/components/home/HowItWorksSection'));
const PremiumPlanSection = React.lazy(() => import('@/components/home/PremiumPlanSection'));

const SectionSkeleton = () => (
  <div className="container mx-auto px-4 py-20 sm:py-24">
    <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  </div>
);

const HomePage = () => {
  const { canAccessPremiumFeatures } = useAuth();

  const preloadImages = [
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/47ed419b-a823-468d-9e6e-80c8442792f0/8e4da15f7992a68d2379afd09d9b840c.png',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/47ed419b-a823-468d-9e6e-80c8442792f0/10bb739c5df82a97d762dcd29e1a7d3e.png',
    'https://storage.googleapis.com/hostinger-horizons-assets-prod/47ed419b-a823-468d-9e6e-80c8442792f0/8ea15bcadeb7d90c9ac4778aba6d0daa.png'
  ];

  return (
    <>
      <Seo
        title="İngilizce Öğrenmenin En Keyifli Yolu"
        description="Hikayelerle İngilizce öğrenin. Her seviyeye uygun sürükleyici hikayeler, akıllı kelime asistanı ve etkileşimli etkinliklerle dil becerilerinizi geliştirin."
        url="/"
        keywords="İngilizce öğren, İngilizce hikayeler, dil öğrenimi, kelime öğrenme, İngilizce pratik"
      >
        {preloadImages.map((src, index) => (
          <link key={index} rel="preload" as="image" href={src} />
        ))}
      </Seo>
      <div className="flex flex-col min-h-screen bg-white dark:bg-background">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <Suspense fallback={<SectionSkeleton />}>
            <WhyHikayeGOSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <HowItWorksSection />
          </Suspense>
          {!canAccessPremiumFeatures && (
            <Suspense fallback={<SectionSkeleton />}>
              <PremiumPlanSection />
            </Suspense>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};
export default HomePage;