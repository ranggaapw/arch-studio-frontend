import { useCallback, useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, X, Calendar, MapPin, User, BrickWall, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { projectService } from '../../../../services/projectService';
import type { Project } from '../../../../types';

export default function ProjectCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedItem, setSelectedItem] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const { data: projectsResponse, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects()
  });

  const projects = projectsResponse?.data || [];

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedItem]);

  const modalImages = selectedItem
    ? (selectedItem.galleryImages && selectedItem.galleryImages.length > 0
        ? selectedItem.galleryImages
        : [selectedItem.imageUrl])
    : [];

  return (
    <section className="w-full py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <span className="text-primary-600 text-body-sm-bold uppercase tracking-[0.25em] mb-3 block">
            Eksplorasi Karya
          </span>
          <h2 className="text-3xl md:text-h3-bold text-neutral-900 font-bold tracking-tight">
            Desain Terbaru Kami
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative flex items-center">
          <button 
            onClick={scrollPrev} 
            className="absolute -left-4 md:-left-16 bg-white p-3 rounded-full shadow-arch-lg hover:bg-primary-50 transition-colors z-10 text-neutral-900 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="overflow-hidden w-full" ref={emblaRef}>
            <div className="flex -ml-6">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex-[0_0_100%] md:flex-[0_0_33.333%] pl-6">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-arch-lg h-96 animate-pulse">
                       <div className="w-full h-56 bg-neutral-200"></div>
                       <div className="p-6">
                         <div className="h-6 w-3/4 bg-neutral-200 rounded mb-4"></div>
                         <div className="h-4 w-1/2 bg-neutral-200 rounded"></div>
                       </div>
                    </div>
                  </div>
                ))
              ) : isError ? (
                <div className="w-full text-center py-10 text-red-500">Gagal memuat desain terbaru</div>
              ) : projects.length === 0 ? (
                <div className="w-full text-center py-10 text-neutral-500">Belum ada proyek yang ditambahkan.</div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="flex-[0_0_100%] md:flex-[0_0_33.333%] pl-6">
                    <div 
                      onClick={() => {
                        setSelectedItem(project);
                        setActiveImageIndex(0);
                      }}
                      className="bg-white rounded-2xl overflow-hidden shadow-arch-lg h-full transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col group"
                    >
                      <div className="relative overflow-hidden h-60">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" draggable="false" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wider block mb-1">
                            {project.categories && project.categories.length > 0
                              ? project.categories.join(' / ')
                              : 'Project'}
                          </span>
                          <h3 className="text-body-lg-bold text-neutral-900 font-bold line-clamp-1 group-hover:text-primary-600 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-neutral-500 text-xs mt-2 leading-relaxed line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-neutral-400 text-[11px]">
                          <span className="flex items-center gap-1 line-clamp-1 max-w-[65%]">
                            <MapPin size={12} className="text-primary-500 flex-shrink-0" />
                            {project.location || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-primary-500" />
                            {project.year || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={scrollNext} 
            className="absolute -right-4 md:-right-16 bg-white p-3 rounded-full shadow-arch-lg hover:bg-primary-50 transition-colors z-10 text-neutral-900 cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* --- LARGE MODAL DETAIL DESAIN --- */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
            {/* Backdrop Overlay */}
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
    </section>
  );
}