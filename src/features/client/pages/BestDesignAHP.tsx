import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CtaSection from '../components/common/CtaSection';
import AhpComparisonForm from '../components/AhpComparisonForm';
import { calculateAhp } from '../../../services/ahpService';
import type { Project, AhpRequestType, AhpResult } from '../../../types';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, ArrowRight, X, CheckCircle2, User, Calendar, MapPin, BrickWall } from 'lucide-react';

export default function BestDesignAHP() {
  const [selectedItem, setSelectedItem] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Gunakan useMutation sesuai spesifikasi nomor 3
  const { mutate, data: recommendedDesignsResponse, isPending } = useMutation({
    mutationFn: calculateAhp,
  });

  const recommendedDesigns: AhpResult | undefined = recommendedDesignsResponse?.data;
  const rankings = recommendedDesigns?.rankings || [];

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
    ? selectedItem.galleryImages && selectedItem.galleryImages.length > 0
      ? selectedItem.galleryImages
      : [selectedItem.imageUrl]
    : [];

  const handleCalculate = (payload: AhpRequestType) => {
    mutate(payload);
  };

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="w-full py-16 bg-neutral-50 px-8 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full text-primary-600 mb-6 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> Decision Support System
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 leading-tight tracking-tight mb-6 max-w-4xl">
            Cari Desain Terbaik Berdasarkan <span className="text-primary-600">Preferensi Anda</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
            Metode Analytic Hierarchy Process (AHP) membantu Anda menghitung keputusan objektif dalam memilih desain dengan mengevaluasi perbandingan kriteria Bahan, Budget, dan Kategori.
          </p>
        </div>
      </section>

      {/* --- MAIN CALCULATOR SECTION --- */}
      <main className="max-w-7xl mx-auto px-8 py-16 bg-neutral-50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Sisi Kiri: Slider Preferensi */}
          <div className="lg:col-span-5">
            <AhpComparisonForm onSubmit={handleCalculate} isPending={isPending} />
          </div>

          {/* Sisi Kanan: Hasil Evaluasi */}
          <div className="lg:col-span-7 h-full">
            {/* STATE 1: Hasil belum dihitung */}
            {!isPending && !recommendedDesigns && (
              <div className="flex flex-col items-center justify-center border border-dashed border-neutral-200 bg-white rounded-3xl p-12 text-center h-[460px] shadow-arch-sm">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
                  <Sparkles size={28} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Lihat Hasil Rekomendasi</h3>
                <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
                  Tentukan perbandingan tingkat kepentingan kriteria Anda menggunakan slider di sisi kiri, kemudian klik tombol <strong>"Cari Desain Terbaik"</strong>.
                </p>
              </div>
            )}

            {/* STATE 2: Sedang dalam proses (Loading) */}
            {isPending && (
              <div className="flex flex-col gap-6 w-full">
                <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-2xl p-4 text-primary-700 text-xs font-semibold animate-pulse">
                  <svg className="animate-spin h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sistem sedang membentuk matriks keputusan &amp; menghitung nilai prioritas kriteria...</span>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-neutral-100 flex gap-5 items-center shadow-arch-sm animate-pulse">
                    <div className="w-24 h-24 bg-neutral-100 rounded-xl flex-shrink-0"></div>
                    <div className="flex-grow">
                      <div className="h-4 w-1/3 bg-neutral-200 rounded mb-2"></div>
                      <div className="h-6 w-2/3 bg-neutral-200 rounded mb-3"></div>
                      <div className="h-3 w-1/4 bg-neutral-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STATE 3: Hasil sudah dihitung */}
            {!isPending && recommendedDesigns && (
              <div className="flex flex-col w-full">
                {/* Visual Bobot Kriteria */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-6 text-white mb-8 shadow-arch-lg relative overflow-hidden border border-neutral-800">
                  <div className="absolute -right-6 -bottom-6 opacity-5 text-white pointer-events-none select-none">
                    <Sparkles size={140} />
                  </div>
                  <h3 className="text-body-sm-bold text-primary-200 uppercase tracking-widest mb-4 font-bold">Hasil Pembobotan Kriteria (Eigenvector)</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Bahan</span>
                      <span className="text-xl font-bold text-white">{(recommendedDesigns.wBahan * 100).toFixed(1)}%</span>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Budget</span>
                      <span className="text-xl font-bold text-white">{(recommendedDesigns.wBudget * 100).toFixed(1)}%</span>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Kategori</span>
                      <span className="text-xl font-bold text-white">{(recommendedDesigns.wKategori * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-neutral-400">
                    <span>Consistency Ratio: {recommendedDesigns.consistencyRatio.toFixed(4)}</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 size={12} /> Konsisten (CR &le; 0.1)
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  Daftar Desain Teratas
                </h3>

                {/* Grid/List Kartu Hasil AHP */}
                <div className="flex flex-col gap-6">
                  {rankings.map((rankItem, index) => {
                    const item = rankItem.project;
                    const matchPercentage = (rankItem.score * 100).toFixed(1);
                    return (
                      <div
                        key={item.id}
                        className={`relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col md:flex-row shadow-arch-sm hover:shadow-arch-lg ${
                          index === 0
                            ? 'border-amber-200 ring-2 ring-amber-300/40 md:p-1.5'
                            : 'border-neutral-100'
                        }`}
                      >
                        {/* Gold Badge untuk Rekomendasi Utama (Indeks 0) */}
                        {index === 0 && (
                          <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-neutral-900 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-amber-300">
                            <Award size={12} className="text-neutral-900" />
                            Rekomendasi Utama
                          </div>
                        )}

                        {/* Image Section */}
                        <div className="w-full md:w-[240px] h-[180px] md:h-auto overflow-hidden rounded-2xl flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover select-none pointer-events-none"
                          />
                        </div>

                        {/* Text Content Section */}
                        <div className="p-6 flex flex-col justify-between flex-grow">
                          <div>
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <span className="text-primary-600 text-xs font-bold uppercase tracking-wider">
                                {item.categories && item.categories.length > 0
                                  ? item.categories.join(' / ')
                                  : 'Project'}
                              </span>
                              {/* AHP Score Display */}
                              <div className="px-2.5 py-1 bg-neutral-100 text-neutral-800 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                Kesesuaian: {matchPercentage}%
                              </div>
                            </div>

                            <h4 className="text-h5-bold text-neutral-900 leading-tight mb-2">
                              {item.title}
                            </h4>
                            <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed mb-4">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="text-[10px] text-neutral-400 font-semibold">
                              Peringkat #{index + 1}
                            </div>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setActiveImageIndex(0);
                              }}
                              className="flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors group cursor-pointer"
                            >
                              Lihat Rincian
                              <ArrowRight size={14} className="ml-1.5 group-hover:ml-2.5 transition-all" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <CtaSection />
      <Footer />

      {/* --- POP-UP MODAL DETAIL (DIREPRODUKSI DARI PORTFOLIOPAGE) --- */}
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
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
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
                    {selectedItem.categories?.map((cat) => (
                      <span
                        key={cat}
                        className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-body-sm-bold uppercase tracking-wider"
                      >
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
                        <span className="text-[10px] text-neutral-400 block tracking-wider uppercase mb-0.5">
                          Klien
                        </span>
                        <span className="text-neutral-800 text-body-sm-medium font-semibold">
                          {selectedItem.clientName || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-neutral-50 rounded-lg text-primary-600 flex items-center justify-center">
                        <Calendar size={15} />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block tracking-wider uppercase mb-0.5">
                          Tahun
                        </span>
                        <span className="text-neutral-800 text-body-sm-medium font-semibold">
                          {selectedItem.year || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 col-span-2">
                      <div className="p-1.5 bg-neutral-50 rounded-lg text-primary-600 flex items-center justify-center">
                        <MapPin size={15} />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block tracking-wider uppercase mb-0.5">
                          Lokasi Proyek
                        </span>
                        <span className="text-neutral-800 text-body-sm-medium font-semibold">
                          {selectedItem.location || 'N/A'}
                        </span>
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
                    <span className="text-neutral-400 text-body-sm-bold uppercase tracking-wider block mb-1.5">
                      Deskripsi Proyek
                    </span>
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
