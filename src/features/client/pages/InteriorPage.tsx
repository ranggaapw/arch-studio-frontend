import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CtaSection from '../components/common/CtaSection';

export default function InteriorPage() {
  const items = [
    {
      title: 'Tata Ruang Maksimal (Space Planning)',
      desc: 'Analisis tata letak furniture dan sirkulasi ruangan secara matang agar tidak sempit dan setiap jengkal ruang berfungsi optimal.',
      img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'
    },
    {
      title: 'Pemilihan Palet Warna & Material',
      desc: 'Penyusunan moodboard material (warna kayu, tekstur kain, jenis logam) untuk menciptakan keharmonisan gaya interior hunian Anda.',
      img: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800'
    },
    {
      title: 'Pencahayaan Estetik (Lighting Design)',
      desc: 'Perencanaan sistem pencahayaan pintar, mulai dari ambient light, task light, hingga aksen indirect LED strip hangat.',
      img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full pt-32 pb-20 px-8 flex flex-col items-center justify-center text-center">
        <span className="text-sm md:text-base font-extrabold text-primary-600 uppercase tracking-[0.2em] mb-3 block">
          Layanan Spesialis
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 tracking-tight max-w-4xl">
          Desain & Tata Letak <span className="text-primary-600">Interior</span>
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl">
          Kami membantu menyusun visualisasi interior yang estetis, fungsional, dan memberikan getaran nyaman yang membuat Anda betah berlama-lama di dalam rumah.
        </p>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-arch-sm hover:shadow-arch-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col border border-neutral-100/50">
              <div className="h-64 overflow-hidden relative">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">{item.title}</h3>
                  <p className="text-neutral-500 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <CtaSection />
      <Footer />
    </div>
  );
}
