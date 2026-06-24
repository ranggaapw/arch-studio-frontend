import { useQuery } from '@tanstack/react-query';
import { homeService } from '../../../services/homeService';

import Navbar from '../components/common/Navbar';
import ServicesSection from '../components/common/ServicesSection';
import ProjectCarousel from '../components/common/ProjectCarousel';
import Footer from '../components/common/Footer';
import TestimonialSection from '../components/common/TestimonialSection';
import FeaturedProject from '../components/common/FeaturedProject';
import ContactSection from '../components/common/ContactSection';

export default function ClientHome() {
  const { data: bannerResponse, isLoading, isError } = useQuery({
    queryKey: ['heroBanner'],
    queryFn: () => homeService.getHeroBanner()
  });

  const banner = bannerResponse?.data;

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <main 
        className="relative max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center bg-cover bg-center rounded-b-3xl overflow-hidden"
        style={banner?.backgroundImageUrl ? { backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95)), url(${banner.backgroundImageUrl})` } : {}}
      >
        {isLoading ? (
          <div className="py-20 flex flex-col items-center">
            <div className="h-6 w-48 bg-neutral-200 animate-pulse rounded mb-4"></div>
            <div className="h-16 w-[600px] max-w-full bg-neutral-200 animate-pulse rounded mb-6"></div>
            <div className="h-20 w-[500px] max-w-full bg-neutral-200 animate-pulse rounded mb-10"></div>
            <div className="h-14 w-48 bg-neutral-200 animate-pulse rounded-xl"></div>
          </div>
        ) : isError || !banner ? (
          <div className="py-20 text-red-500">Failed to load content</div>
        ) : (
          <>
            <span className="text-primary-600 text-body-md-bold uppercase tracking-widest mb-4">
              {banner.subtitle}
            </span>
            <h1 className="text-h1-bold text-neutral-900 mb-6 max-w-4xl leading-tight">
              {banner.title}
            </h1>
            <p className="text-body-lg-regular text-neutral-600 max-w-2xl mb-10">
              {banner.description}
            </p>
            <button className="px-8 py-4 bg-primary-600 text-white text-body-lg-bold rounded-xl shadow-arch-lg hover:bg-primary-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              Lihat Portofolio Kami
            </button>
          </>
        )}
      </main>

      {/* Services Section */}
      <ServicesSection />

      {/* Featured Project */}
      <FeaturedProject />

      {/* Project Carousel */}
      <ProjectCarousel />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}