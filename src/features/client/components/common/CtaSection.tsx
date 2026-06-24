import { ArrowRight, Mail } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="w-full bg-white pt-24 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 mb-24">
          <div className="w-full md:w-1/2">
            <h2 className="text-h2-bold text-neutral-900 mb-2">Mulai Sekarang!</h2>
            <div className="w-16 h-1 bg-primary-600 mb-6 rounded-full"></div>
            <p className="text-body-lg-regular text-neutral-600 mb-10 max-w-lg leading-relaxed">
              Tantangan diterima! Konsultasikan visi arsitektur dan desain interior Anda bersama Arch Studio, dan wujudkan ruang impian menjadi kenyataan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center px-8 py-3.5 bg-primary-700 text-white rounded-xl text-body-md-bold hover:bg-primary-800 transition-colors cursor-pointer shadow-arch-md hover:-translate-y-0.5 duration-300">
                Hubungi Kami <ArrowRight size={18} className="ml-2" />
              </button>
              <button className="px-8 py-3.5 bg-white text-primary-700 border border-primary-700 rounded-xl text-body-md-bold hover:bg-primary-50 transition-colors cursor-pointer">
                Kontak Sales
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative h-[350px] hidden md:block">
            <div className="absolute top-0 right-10 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl transform rotate-12 origin-bottom-right transition-transform hover:rotate-6 duration-500">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9" alt="Inspirasi 1" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-10 w-60 h-72 rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 border-8 border-white transition-transform hover:rotate-0 duration-500 z-10">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d" alt="Inspirasi 2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-neutral-50 py-16 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 text-center md:text-left">
            <h3 className="text-h3-bold text-neutral-900 mb-2">Tetap Terhubung</h3>
            <h4 className="text-h4-bold text-neutral-500">dengan Email Newsletter Kami</h4>
          </div>
          <div className="w-full md:w-1/2 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
              <input 
                type="email" 
                placeholder="Masukkan alamat email Anda" 
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-200 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all bg-white" 
              />
            </div>
            <button className="w-full sm:w-auto px-8 py-4 bg-primary-900 text-white rounded-xl text-body-md-bold hover:bg-primary-800 transition-colors whitespace-nowrap cursor-pointer">
              Berlangganan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}