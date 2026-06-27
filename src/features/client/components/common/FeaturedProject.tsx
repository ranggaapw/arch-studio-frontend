import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, User, BrickWall, Sparkles } from 'lucide-react';
import { projectService } from '../../../../services/projectService';
import type { Project } from '../../../../types';

const AVAILABLE_CATEGORIES = [
  { id: 'rumah tropis modern', label: 'Rumah Tropis Modern' },
  { id: 'minimalis modern', label: 'Minimalis Modern' },
  { id: 'klasik', label: 'Klasik' },
  { id: 'industrial', label: 'Industrial' }
];

const defaultProjectsList: Project[] = [
  { 
    id: 1, 
    title: 'Modern Minimalist House', 
    description: 'Desain rumah arsitektur minimalis yang memaksimalkan sirkulasi cahaya alami dan fungsionalitas ruang di pusat perkotaan padat. Menggunakan tata ruang terbuka (open plan) untuk memberikan kesan lapang dan koneksi antar ruang yang harmonis.', 
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 
    isFeatured: true, 
    categories: ['minimalis modern'],
    materials: 'Beton Ekspos, Kaca Tempered, Kayu Jati Solid, Baja Hitam, Cat Anti-UV Premium',
    location: 'Jakarta Selatan, DKI Jakarta',
    year: 2024,
    clientName: 'Bapak Ronald Sitorus',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'
    ]
  },
  { 
    id: 2, 
    title: 'Urban Coffee Shop', 
    description: 'Renovasi interior kedai kopi modern bergaya industrial kontemporer. Memanfaatkan ekspos struktur dinding semen kasar, material besi hollow, dan aksen kayu pinus hangat untuk menciptakan suasana nyaman, santai, dan estetik bagi para pengunjung.', 
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', 
    isFeatured: true, 
    categories: ['industrial'],
    materials: 'Besi Hollow Hitam, Semen Kamprot, Bata Merah Ekspos, Kayu Pinus Vernis, Lampu Edison Filamen',
    location: 'Dago, Bandung',
    year: 2023,
    clientName: 'Kopi Nemu Group',
    galleryImages: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
    ]
  },
  { 
    id: 3, 
    title: 'Luxury Villa Bali', 
    description: 'Desain villa peristirahatan tropis modern yang terintegrasi langsung dengan keindahan alam sekitarnya. Dilengkapi infinity pool luas dengan dek kayu ulin berkualitas tinggi, dinding batu paras Jogja yang elegan, serta sirkulasi udara silang maksimal.', 
    imageUrl: 'https://images.unsplash.com/photo-1613490908578-83141f6cb65f?w=800', 
    isFeatured: true, 
    categories: ['rumah tropis modern'],
    materials: 'Batu Paras Jogja, Kayu Ulin Kalimantan, Atap Alang-alang Premium, Kaca Frameless Tempered, Lantai Teraso',
    location: 'Ubud, Bali',
    year: 2025,
    clientName: 'Mrs. Sarah Jenkins',
    galleryImages: [
      'https://images.unsplash.com/photo-1613490908578-83141f6cb65f?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
    ]
  }
];

export default function FeaturedProject() {
  const { data: projectsResponse, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects()
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const projects = projectsResponse?.data && projectsResponse.data.length > 0 ? projectsResponse.data : defaultProjectsList;
  const featuredProjects = projects.filter(p => p.isFeatured);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
  };

  const filteredProjects = activeCategory === 'all'
    ? featuredProjects
    : featuredProjects.filter(p => p.categories?.includes(activeCategory));

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

  // Retrieve gallery images for modal
  const modalImages = selectedItem
    ? (selectedItem.galleryImages && selectedItem.galleryImages.length > 0
        ? selectedItem.galleryImages
        : [selectedItem.imageUrl])
    : [];

  if (isLoading) {
    return (
      <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-h3-bold text-neutral-900 mb-12 text-center">Desain Terbaik</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-neutral-200 animate-pulse rounded-3xl h-[400px]"></div>
            <div className="bg-neutral-200 animate-pulse rounded-3xl h-[400px]"></div>
            <div className="bg-neutral-200 animate-pulse rounded-3xl h-[400px]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8 animate-fade-in">
        <div className="text-center mb-10">
          <span className="text-sm md:text-base font-extrabold text-primary-600 uppercase tracking-[0.2em] mb-3 block">
            Koleksi Pilihan
          </span>
          <h2 className="text-3xl md:text-h3-bold text-neutral-900 font-bold tracking-tight">
            Desain Terbaik
          </h2>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center items-center gap-3.5 mb-14">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-6 py-2.5 text-body-md-bold uppercase rounded-full border transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
              activeCategory === 'all'
                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/15 scale-[1.03]'
                : 'bg-white hover:bg-neutral-50/50 hover:text-neutral-900 border-neutral-200 text-neutral-500 hover:border-neutral-300'
            }`}
          >
            All ({featuredProjects.length})
          </button>
          {AVAILABLE_CATEGORIES.map((cat) => {
            const count = featuredProjects.filter(p => p.categories?.includes(cat.id)).length;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-6 py-2.5 text-body-md-bold uppercase rounded-full border transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                  isActive
                    ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/15 scale-[1.03]'
                    : 'bg-white hover:bg-neutral-50/50 hover:text-neutral-900 border-neutral-200 text-neutral-500 hover:border-neutral-300'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Layout Grid: Dynamic with animations */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-16 text-neutral-500 text-body-lg-regular border border-dashed border-neutral-200 rounded-3xl bg-neutral-50/50"
            >
              Tidak ada desain terbaik dalam kategori yang dipilih.
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  key={project.id}
                  onClick={() => {
                    setSelectedItem(project);
                    setActiveImageIndex(0);
                  }}
                  className="relative rounded-3xl overflow-hidden shadow-xl group h-[400px] hover:shadow-arch-xl transition-shadow duration-300 cursor-pointer"
                >
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6">
                    <span className="text-primary-400 text-body-sm-bold uppercase drop-shadow-md tracking-wider">
                      {project.categories && project.categories.length > 0
                        ? project.categories.join(' / ')
                        : 'Project'}
                    </span>
                    <h4 className="text-h4-bold text-white mt-1.5 drop-shadow-md line-clamp-2 leading-snug">{project.title}</h4>
                    <p className="text-white/70 text-body-sm-regular mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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