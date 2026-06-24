const testimonials = [
  {
    name: 'Budi Santoso',
    role: 'Pemilik Rumah di Bogor',
    quote: 'Arch Studio mengubah konsep rumah impian saya menjadi kenyataan. Detail desainnya luar biasa dan proses konsultasinya sangat profesional.',
  },
  {
    name: 'Siti Aminah',
    role: 'Pengusaha Kafe',
    quote: 'Sangat puas dengan hasil interior kafe saya. Timnya sangat responsif dan mengerti betul estetika yang saya inginkan.',
  },
  {
    name: 'Andi Wijaya',
    role: 'Klien Renovasi',
    quote: 'Proses renovasi berjalan sangat lancar. Arch Studio benar-benar memperhatikan efisiensi biaya tanpa mengorbankan kualitas.',
  },
];

export default function TestimonialSection() {
  return (
    <section className="w-full py-20 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-h3-bold mb-16 text-center">Apa Kata Klien Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div key={index} className="p-8 bg-neutral-800 rounded-2xl border border-neutral-700 hover:border-primary-500 transition-all duration-300">
              <p className="text-body-md-regular text-neutral-300 italic mb-6 leading-relaxed">
                "{t.quote}"
              </p>
              <div>
                <h4 className="text-body-lg-bold text-white">{t.name}</h4>
                <span className="text-body-sm-regular text-primary-400">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}