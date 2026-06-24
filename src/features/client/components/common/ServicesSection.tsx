import { PencilRuler, Armchair, Building2 } from 'lucide-react';

const services = [
  {
    title: 'Desain Arsitektur',
    desc: 'Kami merancang struktur bangunan yang menggabungkan estetika modern dengan fungsionalitas maksimal. Setiap proyek diawali dengan analisis lokasi yang mendalam untuk memastikan harmoni antara bangunan dan lingkungan sekitar.',
    icon: <PencilRuler className="w-8 h-8 text-primary-600" />
  },
  {
    title: 'Interior Design',
    desc: 'Transformasikan ruang Anda menjadi tempat yang mencerminkan kepribadian Anda. Kami menangani pemilihan material, pencahayaan, hingga tata letak furnitur secara detail untuk menciptakan kenyamanan paripurna.',
    icon: <Armchair className="w-8 h-8 text-primary-600" />
  },
  {
    title: 'Konsultasi Bangunan',
    desc: 'Butuh panduan teknis? Kami menyediakan jasa konsultasi profesional untuk renovasi, manajemen konstruksi, hingga pengawasan proyek agar realisasi bangunan Anda berjalan sesuai rencana dan anggaran.',
    icon: <Building2 className="w-8 h-8 text-primary-600" />
  }
];

export default function ServicesSection() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-h3-bold text-neutral-900 mb-4 text-center">Layanan Kami</h2>
        <p className="text-body-lg-regular text-neutral-500 text-center mb-16 max-w-2xl mx-auto">
          Kami memberikan solusi arsitektur menyeluruh dengan fokus pada kualitas, inovasi, dan kepuasan klien.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-h5-bold text-neutral-900 mb-3">{service.title}</h3>
              <p className="text-body-md-regular text-neutral-600 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}