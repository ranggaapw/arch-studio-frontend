import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { ArrowRight, X, Mouse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CtaSection from '../components/common/CtaSection';

const portfolioItems = [
  { 
    title: 'Villa Modern', 
    category: 'Architecture', 
    img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
    description: 'Sebuah karya arsitektur yang memadukan material beton ekspos dengan elemen alam. Villa ini dirancang untuk memaksimalkan sirkulasi udara dan cahaya alami, menciptakan hunian yang sejuk dan hemat energi.'
  },
  { 
    title: 'Kantor Minimalis', 
    category: 'Interior', 
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    description: 'Desain interior ruang kerja yang mengutamakan fokus dan produktivitas. Menggunakan palet warna monokrom dengan sentuhan kayu untuk memberikan kesan hangat namun tetap profesional.'
  },
  { 
    title: 'Apartemen Urban', 
    category: 'Interior', 
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    description: 'Optimalisasi ruang pada apartemen di tengah kota. Desain ini menggunakan furnitur multifungsi dan partisi kaca untuk membuat ruangan sempit terasa lebih luas dan modern.'
  },
  { 
    title: 'Modern Living Room', 
    category: 'Interior', 
    img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
    description: 'Ruang keluarga dengan konsep open-space yang terhubung langsung dengan taman dalam. Cocok untuk bersantai bersama keluarga dengan suasana yang tenang.'
  },
  { 
    title: 'Home Office Space', 
    category: 'Architecture', 
    img: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705',
    description: 'Ekstensi bangunan rumah yang dikhususkan untuk ruang kerja privat. Dirancang dengan kedap suara yang baik dan pemandangan menghadap langsung ke area hijau.'
  },
  { 
    title: 'Tropical Terrace', 
    category: 'Consulting', 
    img: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253',
    description: 'Konsultasi tata ruang luar (outdoor) yang memadukan elemen teras tropis. Penggunaan material tahan cuaca dan pemilihan vegetasi yang tepat membuat area ini mudah dirawat.'
  },
];

export default function PortfolioPage() {
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null);
  
  // State untuk menyimpan nilai scroll secara manual
  const [scrollPos, setScrollPos] = useState(0);

  // Fungsi sakti untuk melacak scroll dari window maupun root div
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as Document | HTMLElement;
      // Ambil nilai scroll, entah itu dari window, document, atau elemen spesifik
      const currentScroll = 
        window.scrollY || 
        (target as HTMLElement).scrollTop || 
        document.documentElement.scrollTop || 
        0;
      setScrollPos(currentScroll);
    };

    // Pantau scroll di window utama
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Fallback: Pantau juga scroll di elemen #root (kalau setup Tailwind kamu pakai overflow di root)
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

  // Hitung manual pergerakan animasi berdasarkan pixel scroll
  const moveLeft = scrollPos * 0.9;  // Semakin besar scroll, Vision semakin ke kiri
  const moveRight = scrollPos * 0.9; // Semakin besar scroll, Reality semakin ke kanan
  const fadeOut = Math.max(1 - scrollPos / 300, 0); // Opacity menurun dari 1 ke 0

  // Mengunci scroll layar utama saat pop-up terbuka
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
      
      {/* --- HERO SECTION ANIMASI MANUAL --- */}
      <section className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center relative bg-neutral-50 px-8 pb-10">
        
        {/* Container Teks Utama */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full overflow-visible mb-6">
          {/* Teks Kiri (Vision) - Menggunakan tag <h1> biasa dengan style transform manual */}
          <h1 
            style={{ transform: `translateX(-${moveLeft}px)` }}
            className="text-[80px] md:text-[120px] lg:text-[160px] font-bold text-primary-500 leading-none tracking-tighter transition-transform duration-75 ease-out"
          >
            Vision
          </h1>
          
          {/* Teks Kanan (Meets Reality) */}
          <h1 
            style={{ transform: `translateX(${moveRight}px)` }}
            className="text-[80px] md:text-[120px] lg:text-[160px] font-bold text-neutral-800 leading-none tracking-tighter md:ml-6 transition-transform duration-75 ease-out"
          >
            Meets Reality
          </h1>
        </div>

        {/* Teks Sub-judul */}
        <p 
          style={{ opacity: fadeOut }}
          className="text-xl md:text-2xl text-neutral-400 text-center mb-16 z-10 transition-opacity duration-75 ease-out"
        >
          Membawa visi arsitektur dan interior Anda menjadi kenyataan.
        </p>

        {/* Scroll Down Indicator */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {portfolioItems.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-arch-sm hover:shadow-arch-lg transition-shadow duration-300">
              <img src={item.img} alt={item.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <span className="text-primary-600 text-body-sm-bold uppercase tracking-wider">{item.category}</span>
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
                  <img src={selectedItem.img} alt={selectedItem.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
                  <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-body-sm-bold uppercase tracking-wider w-max mb-4">
                    {selectedItem.category}
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