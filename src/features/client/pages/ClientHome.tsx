import Navbar from '../components/common/Navbar';
import ServicesSection from '../components/common/ServicesSection';
import ProjectCarousel from '../components/common/ProjectCarousel';
import Footer from '../components/common/Footer';
import TestimonialSection from '../components/common/TestimonialSection';
import FeaturedProject from '../components/common/FeaturedProject'

export default function ClientHome() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center">
        <span className="text-primary-600 text-body-md-bold uppercase tracking-widest mb-4">
          Wujudkan Desain Impian
        </span>
        <h1 className="text-h1-bold text-neutral-900 mb-6 max-w-4xl">
          Eksplorasi Ruang dan Estetika Bersama Arch Studio
        </h1>
        <p className="text-body-lg-regular text-neutral-500 max-w-2xl mb-10">
          Dari arsitektur modern hingga interior tropis, kami membawa visi Anda menjadi kenyataan dengan sentuhan profesional yang tak lekang oleh waktu.
        </p>
        <button className="px-8 py-4 bg-primary-600 text-white text-body-lg-bold rounded-xl shadow-arch-lg hover:bg-primary-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          Lihat Portofolio Kami
        </button>
      </main>

      {/* Services Section */}
      <ServicesSection />

      {/* Featured Project */}
      <FeaturedProject />

      {/* Project Carousel */}
      <ProjectCarousel />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}