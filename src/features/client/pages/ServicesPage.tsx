import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ContactSection from '../components/common/ContactSection';
import { motion } from 'framer-motion';
import { MessageSquare, PenTool, HardHat, Key } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../../../services/serviceService';
import * as LucideIcons from 'lucide-react';

const IconRenderer = ({ name, className }: { name?: string, className?: string }) => {
  if (!name) return null;
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ElementType;
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

// Data Proses Kerja (tetap statis)
const workProcesses = [
  {
    icon: <MessageSquare size={32} />,
    title: '1. Konsultasi Awal',
    desc: 'Diskusi mendalam mengenai visi, kebutuhan ruang, gaya yang diinginkan, dan alokasi anggaran Anda.'
  },
  {
    icon: <PenTool size={32} />,
    title: '2. Konsep & Desain',
    desc: 'Pembuatan sketsa awal, denah, hingga visualisasi 3D fotorealistik untuk persetujuan Anda.'
  },
  {
    icon: <HardHat size={32} />,
    title: '3. Eksekusi & Konstruksi',
    desc: 'Tim ahli kami mulai bekerja di lapangan dengan pengawasan ketat terhadap kualitas dan waktu.'
  },
  {
    icon: <Key size={32} />,
    title: '4. Serah Terima',
    desc: 'Finalisasi detail, pembersihan menyeluruh, dan penyerahan kunci ruang impian Anda.'
  }
];

export default function ServicesPage() {
  const { data: servicesResponse, isLoading, isError } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices()
  });

  const services = servicesResponse?.data || [];

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="w-full pt-32 pb-20 px-8 flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-primary-600 text-sm font-bold uppercase tracking-widest mb-4"
        >
          Keahlian Kami
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 tracking-tight max-w-4xl"
        >
          Solusi <span className="text-primary-600">Terpadu</span> untuk Ruang Impian Anda
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-neutral-500 max-w-2xl"
        >
          Dari perancangan struktur bangunan hingga detail furnitur terkecil, kami menangani setiap aspek dengan presisi dan estetika tingkat tinggi.
        </motion.p>
      </section>

      {/* --- MAIN SERVICES (ZIG-ZAG) --- */}
      <main className="max-w-7xl mx-auto px-8 pb-32 flex flex-col gap-32 pt-10">
        
        {isLoading ? (
          <div className="flex flex-col gap-32">
            {[1, 2].map((i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-16 animate-pulse`}>
                <div className={`w-full md:w-1/2 h-[500px] bg-neutral-200 rounded-3xl ${i % 2 === 0 ? 'md:order-2' : ''}`}></div>
                <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:order-1' : ''}`}>
                  <div className="h-10 w-3/4 bg-neutral-200 rounded mb-6"></div>
                  <div className="h-6 w-full bg-neutral-200 rounded mb-2"></div>
                  <div className="h-6 w-full bg-neutral-200 rounded mb-2"></div>
                  <div className="h-6 w-2/3 bg-neutral-200 rounded mb-8"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-20">Gagal memuat layanan.</div>
        ) : services.length === 0 ? (
          <div className="text-center text-neutral-500 py-20">Belum ada layanan.</div>
        ) : (
          services.map((service, index) => {
            const isEven = index % 2 !== 0;
            return (
              <div key={service.id} className="flex flex-col md:flex-row items-center gap-16">
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`w-full md:w-1/2 h-[500px] rounded-3xl overflow-hidden shadow-2xl relative ${isEven ? 'order-1 md:order-2' : ''}`}
                >
                  {/* Gunakan random placeholder image berdasarkan index jika tidak ada imageUrl */}
                  <img 
                    src={service.imageUrl || [
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
                      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
                      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
                    ][index % 4]} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-6 ${isEven ? 'right-6' : 'left-6'} w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg`}>
                    {service.iconName ? (
                      <IconRenderer name={service.iconName} className="text-primary-600 w-7 h-7" />
                    ) : (
                      <LucideIcons.CheckCircle className="text-primary-600 w-7 h-7" />
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                  className={`w-full md:w-1/2 ${isEven ? 'order-2 md:order-1' : ''}`}
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">{service.title}</h2>
                  <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                    {service.description}
                  </p>
                </motion.div>
              </div>
            );
          })
        )}
      </main>

      {/* --- PROSES KERJA KAMI --- */}
      <section className="w-full bg-white py-32 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <span className="text-primary-600 text-sm font-bold uppercase tracking-widest mb-4 block">
              Metode Kami
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900">
              Proses Kerja yang Transparan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workProcesses.map((process, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-start text-left p-10 bg-neutral-50 rounded-3xl border border-neutral-100 hover:shadow-arch-md hover:-translate-y-1 transition-all duration-300 group h-full min-h-[320px]"
              >
                <div className="text-primary-600 mb-8 group-hover:scale-110 origin-left transition-transform duration-300">
                  {process.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">{process.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm">
                  {process.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
}