import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CtaSection from '../components/common/CtaSection';

export default function FurnitureCustomPage() {
  const items = [
    {
      title: 'Kitchen Set & Kabinet Dapur',
      desc: 'Kabinet dapur fungsional yang dirancang khusus untuk kenyamanan memasak, menggunakan material tahan lembab tinggi (Multiplex HMR) dan aksesoris berkualitas (soft-close hinges).',
      img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800'
    },
    {
      title: 'Lemari Pakaian & Walk-In Closet',
      desc: 'Sistem penyimpanan pakaian terorganisir, pintu geser (sliding door) hemat ruang, gantungan baju alumunium solid, laci aksesoris bersekat beludru, hingga pencahayaan sensor LED.',
      img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800'
    },
    {
      title: 'Backdrop TV & Meja Konsol',
      desc: 'Pusat ruang keluarga elegan dengan desain melayang (floating console), aksen kisi-kisi kayu minimalis, panel marmer imitasi, serta tempat penyimpanan router/kabel yang tersembunyi rapi.',
      img: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800'
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
          Pembuatan <span className="text-primary-600">Furniture Custom</span>
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl">
          Wujudkan furniture impian Anda dengan ukuran, warna, fungsi, dan material terbaik yang pas dengan ruangan rumah Anda.
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
