import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { ArrowRight, X, Mouse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CtaSection from '../components/common/CtaSection';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../../services/projectService';
import type { Project } from '../../../types';

export default function PortfolioPage() {
  const [selectedItem, setSelectedItem] = useState<Project | null>(null);
  const [scrollPos, setScrollPos] = useState(0);

  const { data: projectsResponse, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects()
  });

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

  const moveLeft = scrollPos * 0.9;
  const moveRight = scrollPos * 0.9;
  const fadeOut = Math.max(1 - scrollPos / 300, 0);

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedItem]);

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-x-hidden">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <section className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center relative bg-neutral-50 px-8 pb-10">
        <div className="flex flex-col md:flex-row items-center justify-center w-full overflow-visible mb-6">
          <h1 
            style={{ transform: `translateX(-${moveLeft}px)` }}
            className="text-[80px] md:text-[120px] lg:text-[160px] font-bold text-primary-500 leading-none tracking-tighter transition-transform duration-75 ease-out"
          >
            Vision
          </h1>
          <h1 
            style={{ transform: `translateX(${moveRight}px)` }}
            className="text-[80px] md:text-[120px] lg:text-[160px] font-bold text-neutral-800 leading-none tracking-tighter md:ml-6 transition-transform duration-75 ease-out"
          >
            Meets Reality
          </h1>
        </div>

        <p 
          style={{ opacity: fadeOut }}
          className="text-xl md:text-2xl text-neutral-400 text-center mb-16 z-10 transition-opacity duration-75 ease-out"
        >
          Membawa visi arsitektur dan interior Anda menjadi kenyataan.
        </p>

        <div className="absolute bottom-10 flex flex-col items-center gap-4 opacity-60 animate-bounce">
          <span 
            className="text-xs uppercase tracking-[0.3em] text-neutral-500" 
            style={{ writingMode: 'vertical-rl' }}
          >
            scroll down
          </span>
          <Mouse size={20} className="text-neutral-500" />
        </div>
      </section>
      
      {/* --- MAIN PORTFOLIO GRID --- */}
      <main className="max-w-7xl mx-auto px-8 pb-20 pt-10 relative z-10 bg-neutral-50">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-arch-sm animate-pulse">
                <div className="w-full h-64 bg-neutral-200"></div>
                <div className="p-6">
                  <div className="h-4 w-1/3 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-6 w-3/4 bg-neutral-200 rounded mb-4"></div>
                  <div className="h-4 w-1/4 bg-neutral-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500">Failed to load projects.</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">Belum ada proyek yang ditambahkan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {projects.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-arch-sm hover:shadow-arch-lg transition-shadow duration-300">
                <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <span className="text-primary-600 text-body-sm-bold uppercase tracking-wider">Project</span>
                  <h3 className="text-h5-bold text-neutral-900 mt-2 mb-4">{item.title}</h3>
                  
                  <button 
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center text-primary-600 font-bold group cursor-pointer"
                  >
                    Lihat Rincian <ArrowRight size={18} className="ml-2 group-hover:ml-4 transition-all" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CtaSection />
      <Footer />

      {/* --- POP-UP MODAL --- */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-neutral-900/70"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-neutral-900 rounded-full shadow-md transition-colors z-20 cursor-pointer"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row h-full md:max-h-[600px]">
                <div className="w-full md:w-1/2 h-64 md:h-auto">
                  <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
                  <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-body-sm-bold uppercase tracking-wider w-max mb-4">
                    Project
                  </span>
                  <h2 className="text-h3-bold text-neutral-900 mb-6">{selectedItem.title}</h2>
                  <p className="text-body-lg-regular text-neutral-600 leading-relaxed mb-8">
                    {selectedItem.description}
                  </p>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="w-full py-4 bg-primary-600 text-white rounded-xl text-body-lg-bold hover:bg-primary-700 transition-colors cursor-pointer"
                  >
                    Tutup Rincian
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}