import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { ArrowRight, X, Mouse, Calendar, MapPin, User, BrickWall, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CtaSection from '../components/common/CtaSection';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../../services/projectService';
import type { Project } from '../../../types';

export default function PortfolioPage() {
  const [selectedItem, setSelectedItem] = useState<Project | null>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

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

  const modalImages = selectedItem
    ? (selectedItem.galleryImages && selectedItem.galleryImages.length > 0
        ? selectedItem.galleryImages
        : [selectedItem.imageUrl])
    : [];

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
          <div className="text-center py-20 text-red-500">Gagal memuat portofolio desain.</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">Belum ada proyek yang ditambahkan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {projects.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-arch-sm hover:shadow-arch-lg transition-shadow duration-300">
                <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <span className="text-primary-600 text-body-sm-bold uppercase tracking-wider">
                    {item.categories && item.categories.length > 0 ? item.categories.join(' / ') : 'Project'}
                  </span>
                  <h3 className="text-h5-bold text-neutral-900 mt-2 mb-4">{item.title}</h3>
                  
                  <button 
                    onClick={() => {
                      setSelectedItem(item);
                      setActiveImageIndex(0);
                    }}
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

      {/* --- PREMIUM POP-UP MODAL --- */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
            {/* Backdrop Overlay (No Blur for smooth animations) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950/80"
              onClick={() => setSelectedItem(null)}
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-7xl md:w-[94vw] bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh] border border-neutral-100"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2.5 bg-neutral-900/10 hover:bg-neutral-950/20 text-neutral-800 rounded-full transition-colors z-50 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <X size={20} />
              </button>

              {/* Kiri: Gallery Area */}
              <div className="w-full md:w-[60%] p-6 md:p-8 flex flex-col justify-between bg-neutral-50/50 border-r border-neutral-100 max-h-[50vh] md:max-h-full">
                {/* Main Large Display Image */}
                <div className="flex-1 relative rounded-2xl overflow-hidden bg-neutral-100 flex items-center justify-center group h-[250px] md:h-[450px] lg:h-[500px]">
                  <motion.img 
                    key={activeImageIndex}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    src={modalImages[activeImageIndex]} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm select-none">
                    <Sparkles size={11} className="text-primary-400" />
                    Preview {activeImageIndex + 1} / {modalImages.length}
                  </div>
                </div>

                {/* Thumbnails Row */}
                {modalImages.length > 1 && (
                  <div className="flex gap-2.5 mt-4 overflow-x-auto scrollbar-hide py-1.5 flex-shrink-0">
                    {modalImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-16 md:w-24 md:h-18 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
                          activeImageIndex === idx
                            ? 'ring-2 ring-primary-600 opacity-100 scale-105 shadow-sm'
                            : 'opacity-65 hover:opacity-100 hover:scale-102'
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Kanan: Specifications Info Area */}
              <div className="w-full md:w-[40%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-full">
                <div>
                  {/* Category Badge */}
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    {selectedItem.categories?.map(cat => (
                      <span key={cat} className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-body-sm-bold uppercase tracking-wider">
                        {cat}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl md:text-h4-bold text-neutral-900 font-bold mb-5 leading-tight">
                    {selectedItem.title}
                  </h2>

                  {/* Spec Info Grid */}
                  <div className="grid grid-cols-2 gap-4 border-y border-neutral-100 py-4.5 mb-5 text-body-sm-regular text-neutral-600">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-neutral-50 rounded-lg text-primary-600 flex items-center justify-center">
                        <User size={15} />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block tracking-wider uppercase mb-0.5">Klien</span>
                        <span className="text-neutral-800 text-body-sm-medium font-semibold">{selectedItem.clientName || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-neutral-50 rounded-lg text-primary-600 flex items-center justify-center">
                        <Calendar size={15} />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block tracking-wider uppercase mb-0.5">Tahun</span>
                        <span className="text-neutral-800 text-body-sm-medium font-semibold">{selectedItem.year || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 col-span-2">
                      <div className="p-1.5 bg-neutral-50 rounded-lg text-primary-600 flex items-center justify-center">
                        <MapPin size={15} />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block tracking-wider uppercase mb-0.5">Lokasi Proyek</span>
                        <span className="text-neutral-800 text-body-sm-medium font-semibold">{selectedItem.location || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Materials Section */}
                  <div className="mb-5">
                    <div className="flex items-center gap-1.5 mb-1.5 text-neutral-400 text-body-sm-bold uppercase tracking-wider">
                      <BrickWall size={14} className="text-neutral-400" />
                      <span>Bahan &amp; Material</span>
                    </div>
                    <p className="text-neutral-800 text-body-md-medium leading-relaxed bg-neutral-50/70 p-3 rounded-xl border border-neutral-100 text-sm">
                      {selectedItem.materials || 'Spesifikasi material belum dicantumkan.'}
                    </p>
                  </div>

                  {/* Description Section */}
                  <div className="mb-6">
                    <span className="text-neutral-400 text-body-sm-bold uppercase tracking-wider block mb-1.5">Deskripsi Proyek</span>
                    <p className="text-neutral-600 text-body-md-regular leading-relaxed text-sm pr-2 max-h-[160px] overflow-y-auto scrollbar-thin">
                      {selectedItem.description}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-body-md-bold hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-md shadow-primary-600/10 active:translate-y-0"
                >
                  Tutup Rincian Desain
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}