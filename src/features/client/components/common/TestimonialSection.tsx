import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Valentino Lucas',
    role: 'Local Guide',
    quote: 'Pekerjaannya rapi, memuaskan.',
    rating: 5
  },
  {
    name: 'C4703R Prasetyo',
    role: 'Klien Workshop',
    quote: 'Mantabs keren.',
    rating: 5
  },
  {
    name: 'Agus Wahyono',
    role: 'Local Guide',
    quote: 'Pengerjaan furniture custom sangat presisi dan finishing-nya rapi.',
    rating: 4
  },
  {
    name: 'Aliyah Putri',
    role: 'Klien Furniture',
    quote: 'Sangat direkomendasikan untuk pembuatan custom furniture rumah tangga.',
    rating: 5
  },
  {
    name: 'Ahmad Furkon',
    role: 'Local Guide',
    quote: 'Komunikasi baik, pengerjaan pesanan rapi sesuai desain.',
    rating: 5
  },
  {
    name: 'Devid Sulistyo',
    role: 'Local Guide',
    quote: 'Kualitas bahan bagus dan awet. Pelayanan ramah.',
    rating: 5
  }
];

export default function TestimonialSection() {
  return (
    <section className="w-full py-20 bg-white text-neutral-800 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-sm md:text-base font-extrabold text-primary-600 uppercase tracking-[0.2em] mb-3 block">
            Testimoni Pelanggan
          </span>
          <h2 className="text-3xl md:text-h3-bold text-neutral-900 font-bold mb-4">
            Apa Kata Klien Kami
          </h2>
          
          {/* Google Review Score Card */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 bg-neutral-50 border border-neutral-200 px-6 py-3.5 rounded-full w-max mx-auto shadow-sm">
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-neutral-900">4.4</span>
              <span className="text-neutral-500 text-sm">/ 5.0</span>
            </div>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4].map(star => (
                <Star key={star} size={16} fill="currentColor" className="text-amber-400" />
              ))}
              {/* Half star for 4.4 */}
              <div className="relative text-neutral-300">
                <Star size={16} fill="currentColor" />
                <div className="absolute inset-0 overflow-hidden w-[40%] text-amber-400">
                  <Star size={16} fill="currentColor" />
                </div>
              </div>
            </div>
            <span className="text-neutral-500 text-sm border-l border-neutral-200 pl-3">
              7 Google Reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div key={index} className="p-8 bg-neutral-50 rounded-3xl border border-neutral-100 hover:bg-neutral-100/40 hover:border-primary-500/50 transition-all duration-300 flex flex-col justify-between group">
              <div>
                {/* Stars */}
                <div className="flex text-amber-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="text-amber-400" />
                  ))}
                  {Array.from({ length: 5 - t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-neutral-200" />
                  ))}
                </div>
                <p className="text-body-md-regular text-neutral-600 italic mb-6 leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
              <div className="border-t border-neutral-200/60 pt-4 mt-2 flex justify-between items-center">
                <div>
                  <h4 className="text-body-md-bold text-neutral-800 font-semibold group-hover:text-primary-600 transition-colors">{t.name}</h4>
                  <span className="text-[11px] text-neutral-400 block tracking-wider uppercase mt-0.5">{t.role}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-neutral-400 select-none border border-neutral-200/40">
                  G
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}