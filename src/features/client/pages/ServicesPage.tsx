import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CtaSection from '../components/common/CtaSection';
import { motion } from 'framer-motion';
import { Building2, PaintRoller, CheckCircle2, Users, MessageSquare, PenTool, HardHat, Key } from 'lucide-react';

// Data Layanan Arsitektur
const architectureFeatures = [
  'Perencanaan & Desain Struktural',
  'Pengembangan Fasad Modern',
  'Manajemen Proyek & Konstruksi',
  'Integrasi Desain Ramah Lingkungan'
];

// Data Layanan Interior
const interiorFeatures = [
  'Pemilihan Material & Furnitur Kustom',
  'Perencanaan Tata Cahaya (Lighting)',
  'Optimalisasi Ruang Sempit',
  'Konsep Smart Home Integration'
];

// Data Layanan Konsultasi
const consultingFeatures = [
  'Studi Kelayakan Proyek (Feasibility Study)',
  'Estimasi Rencana Anggaran Biaya (RAB)',
  'Konsultasi Perizinan Bangunan (PBG/IMB)',
  'Audit Struktur Bangunan Lama'
];

// Data Proses Kerja
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
        
        {/* Layanan 1: Arsitektur (Gambar Kiri, Teks Kanan) */}
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full md:w-1/2 h-[500px] rounded-3xl overflow-hidden shadow-2xl relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" 
              alt="Layanan Arsitektur" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="text-primary-600" size={28} />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">Arsitektur</h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              Kami merancang bangunan yang tidak hanya memukau secara visual, tetapi juga kokoh, fungsional, dan responsif terhadap lingkungan sekitarnya. Setiap rancangan arsitektur kami adalah perpaduan antara seni dan teknik struktur yang presisi.
            </p>
            <ul className="space-y-4">
              {architectureFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center text-neutral-700 font-medium">
                  <CheckCircle2 className="text-primary-600 mr-4 flex-shrink-0" size={20} />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Layanan 2: Interior (Teks Kiri, Gambar Kanan) */}
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-1/2 order-2 md:order-1"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">Desain Interior</h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              Kami percaya bahwa interior yang baik dapat meningkatkan kualitas hidup. Tim kami akan menyulap ruangan Anda menjadi tempat yang mencerminkan kepribadian Anda, sekaligus memaksimalkan kenyamanan dan produktivitas.
            </p>
            <ul className="space-y-4">
              {interiorFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center text-neutral-700 font-medium">
                  <CheckCircle2 className="text-primary-600 mr-4 flex-shrink-0" size={20} />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full md:w-1/2 h-[500px] rounded-3xl overflow-hidden shadow-2xl relative order-1 md:order-2"
          >
            <img 
              src="https://images.unsplash.com/photo-1600210491369-e753d80a41f3" 
              alt="Desain Interior" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <PaintRoller className="text-primary-600" size={28} />
            </div>
          </motion.div>
        </div>

        {/* Layanan 3: Konsultasi (Gambar Kiri, Teks Kanan) */}
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full md:w-1/2 h-[500px] rounded-3xl overflow-hidden shadow-2xl relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e" 
              alt="Layanan Konsultasi" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="text-primary-600" size={28} />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">Konsultasi & Perencanaan</h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              Membangun atau merenovasi properti butuh perhitungan matang. Layanan konsultasi kami membantu Anda menghindari pembengkakan biaya, merencanakan ruang secara efisien, dan memastikan regulasi bangunan terpenuhi.
            </p>
            <ul className="space-y-4">
              {consultingFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center text-neutral-700 font-medium">
                  <CheckCircle2 className="text-primary-600 mr-4 flex-shrink-0" size={20} />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

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

          {/* Mengurangi gap sedikit agar card bisa lebih lebar, persis seperti Layanan Kami */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workProcesses.map((process, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                // PERUBAHAN: Ubah ke rata kiri (items-start text-left), tambah padding (p-10), dan set tinggi minimal (min-h-[320px])
                className="flex flex-col items-start text-left p-10 bg-neutral-50 rounded-3xl border border-neutral-100 hover:shadow-arch-md hover:-translate-y-1 transition-all duration-300 group h-full min-h-[320px]"
              >
                {/* PERUBAHAN: Menghapus kotak putih, mengubah ikon jadi polos sesuai style Layanan Kami */}
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

      {/* --- CTA SECTION --- */}
      <CtaSection />
      
      <Footer />
    </div>
  );
}