import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ContactSection from '../components/common/ContactSection';
import { Mouse, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import CtaSection from '../components/common/CtaSection';
import { useQuery } from '@tanstack/react-query';
import { aboutService } from '../../../services/aboutService';
import { projectService } from '../../../services/projectService';

// Data untuk Why Choose Us
const reasons = [
  {
    title: 'Desain Berkelanjutan',
    desc: 'Kami memprioritaskan material ramah lingkungan dan efisiensi energi dalam setiap rancangan.',
    img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    icon: Leaf
  },
  {
    title: 'Komitmen Penuh',
    desc: 'Tim ahli kami mendampingi Anda dari konsep awal hingga penyelesaian konstruksi.',
    img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    icon: ShieldCheck
  },
  {
    title: 'Inovasi Modern',
    desc: 'Memadukan estetika kontemporer dengan teknologi smart home terkini.',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    icon: Sparkles
  }
];

// Data untuk Featured Projects Carousel
const featuredImages = [
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
  'https://images.unsplash.com/photo-1593062096033-9a26b09da705',
  'https://images.unsplash.com/photo-1505577058444-a3dab90d4253',
];

export default function AboutPage() {
  // State manual untuk scroll tracking (seperti yang kita gunakan di PortfolioPage)
  const [scrollPos, setScrollPos] = useState(0);

  const { data: aboutResponse, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: () => aboutService.getAboutInfo()
  });

  const { data: projectsResponse } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects()
  });
  
  const about = aboutResponse?.data;
  const projects = projectsResponse?.data || [];

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as Document | HTMLElement;
      const currentScroll = 
        window.scrollY || 
        (target as HTMLElement).scrollTop || 
        document.documentElement.scrollTop || 
        0;
      setScrollPos(currentScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rootElement) {
        rootElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  
  // Opacity fade in untuk Visi & Misi
  const fadeVision = Math.min(1, Math.max(0, (scrollPos - 300) / 300));
  const fadeMission = Math.min(1, Math.max(0, (scrollPos - 600) / 300));

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="w-full min-h-[90vh] flex flex-col items-center justify-center relative px-8 pt-20 pb-32">
        <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-4 text-center tracking-tight">
          We are <span className="text-primary-600">Mitra Daya Kreasi</span>
        </h1>
        <div className="text-xl md:text-2xl text-neutral-500 text-center mb-24 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <span className="animate-pulse bg-neutral-200 h-6 w-3/4 block rounded"></span>
              <span className="animate-pulse bg-neutral-200 h-6 w-2/4 block rounded"></span>
            </div>
          ) : (
            <p>{about?.description || <>Perjalanan Kami Terus <span className="text-primary-500">Berkembang</span></>}</p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 text-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-primary-600 mb-2">10+</h2>
            <p className="text-neutral-500">Tahun Pengalaman</p>
          </div>
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-primary-600 mb-2">50+</h2>
            <p className="text-neutral-500">Ahli Arsitektur</p>
          </div>
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-primary-600 mb-2">150+</h2>
            <p className="text-neutral-500">Klien Puas</p>
          </div>
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-primary-600 mb-2">300+</h2>
            <p className="text-neutral-500">Proyek Selesai</p>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-4 opacity-60 animate-bounce">
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500" style={{ writingMode: 'vertical-rl' }}>
            scroll down
          </span>
          <Mouse size={20} className="text-neutral-500" />
        </div>
      </section>

      {/* --- VISION & MISSION SECTION --- */}
      <section className="w-full py-32 px-8 max-w-5xl mx-auto flex flex-col gap-32">
        {/* Visi */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <h2 
            className="text-4xl md:text-6xl font-bold text-primary-600 uppercase tracking-wider w-full md:w-1/3 transition-all duration-300 ease-out"
            style={{ transform: `translateX(${fadeVision < 1 ? -50 + (fadeVision * 50) : 0}px)`, opacity: fadeVision }}
          >
            OUR <span className="text-neutral-900">Vision</span>
          </h2>
          <p 
            className="text-xl md:text-2xl text-neutral-500 leading-relaxed w-full md:w-2/3 transition-all duration-300 ease-out"
            style={{ transform: `translateX(${fadeVision < 1 ? 50 - (fadeVision * 50) : 0}px)`, opacity: fadeVision }}
          >
            {isLoading ? <span className="animate-pulse bg-neutral-200 h-10 w-full block rounded"></span> : about?.vision || 'Menjadi pelopor biro arsitektur yang menghadirkan ruang hidup berkelanjutan, memadukan estetika alam dan inovasi teknologi untuk masa depan yang lebih baik.'}
          </p>
        </div>

        {/* Misi */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <h2 
            className="text-4xl md:text-6xl font-bold text-primary-600 uppercase tracking-wider w-full md:w-1/3 transition-all duration-300 ease-out md:order-2"
            style={{ transform: `translateX(${fadeMission < 1 ? 50 - (fadeMission * 50) : 0}px)`, opacity: fadeMission }}
          >
            OUR <span className="text-neutral-900">Mission</span>
          </h2>
          <p 
            className="text-xl md:text-2xl text-neutral-500 leading-relaxed w-full md:w-2/3 transition-all duration-300 ease-out md:order-1 text-left md:text-right"
            style={{ transform: `translateX(${fadeMission < 1 ? -50 + (fadeMission * 50) : 0}px)`, opacity: fadeMission }}
          >
            {isLoading ? <span className="animate-pulse bg-neutral-200 h-10 w-full block rounded"></span> : about?.mission || 'Berinvestasi pada desainer berbakat, menerapkan standar konstruksi tertinggi, dan bersama-sama merancang ruang yang berfokus pada kenyamanan dan kebutuhan fungsional klien kami.'}
          </p>
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="w-full bg-white py-24 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16">
            <span className="text-primary-600 text-sm font-bold uppercase tracking-widest mb-4 block">
              Mengapa Memilih Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Bersama kami, wujudkan ruang impian Anda!
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-arch-sm hover:shadow-arch-lg transition-all duration-500 hover:-translate-y-2 group flex flex-col border border-neutral-100/50">
                  <div className="relative overflow-hidden h-56">
                    <img 
                      src={reason.img} 
                      alt={reason.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                  <div className="p-8 pt-10 text-center relative flex-1 flex flex-col items-center">
                    {/* Floating Icon Container */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white transition-transform duration-500 group-hover:scale-110">
                      <Icon size={22} />
                    </div>
                    
                    <h3 className="text-body-lg-bold text-neutral-900 font-bold mb-3 mt-1 group-hover:text-primary-600 transition-colors">
                      {reason.title}
                    </h3>
                    <p className="text-neutral-500 leading-relaxed text-sm">
                      {reason.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FEATURED PROJECTS CAROUSEL --- */}
      <section className="w-full py-24 bg-neutral-50 overflow-hidden">
        <div className="text-center mb-16 px-8">
          <span className="text-primary-600 text-sm font-bold uppercase tracking-widest mb-4 block">
            Featured Projects
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900">
            Lihat karya unggulan kami
          </h2>
        </div>

        {/* Auto-scrolling Carousel CSS Trick */}
        <div className="relative w-full flex overflow-x-hidden group">
          <div className="flex space-x-8 px-4 animate-marquee whitespace-nowrap group-hover:pause">
            {(projects.length > 0 ? [...projects, ...projects] : []).map((project, index) => (
              <div key={index} className="inline-block w-80 md:w-96 h-[400px] rounded-2xl overflow-hidden shadow-lg flex-shrink-0 relative">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <p className="text-white font-bold text-lg whitespace-normal leading-snug">{project.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
      <ContactSection />
      <Footer />
    </div>
  );
}