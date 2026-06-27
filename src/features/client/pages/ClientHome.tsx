import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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
        className="relative w-full min-h-[85vh] pt-36 pb-24 px-6 flex flex-col items-center justify-center text-center bg-cover bg-center overflow-hidden"
        style={banner?.backgroundImageUrl ? { backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.65)), url(${banner.backgroundImageUrl})` } : {}}
      >
        {isLoading ? (
          <div className="py-20 flex flex-col items-center">
            <div className="h-6 w-48 bg-white/20 animate-pulse rounded mb-4"></div>
            <div className="h-16 w-[600px] max-w-full bg-white/20 animate-pulse rounded mb-6"></div>
            <div className="h-20 w-[500px] max-w-full bg-white/20 animate-pulse rounded mb-10"></div>
            <div className="h-14 w-48 bg-white/20 animate-pulse rounded-xl"></div>
          </div>
        ) : isError || !banner ? (
          <div className="py-20 text-red-100">Gagal memuat konten banner</div>
        ) : (
          <>
            <span className="text-primary-300 text-body-md-bold uppercase tracking-[0.2em] mb-4 drop-shadow-sm">
              {banner.subtitle}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-h1-bold text-white mb-6 max-w-4xl leading-tight font-bold drop-shadow-lg">
              {banner.title}
            </h1>
            <p className="text-body-lg-regular text-neutral-100 max-w-2xl mb-10 opacity-90 leading-relaxed drop-shadow-md">
              {banner.description}
            </p>
            <Link to="/portfolio" className="inline-block">
              <button className="px-8 py-4 bg-primary-600 text-white text-body-lg-bold rounded-xl shadow-arch-lg hover:bg-primary-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                Lihat Portofolio Kami
              </button>
            </Link>
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