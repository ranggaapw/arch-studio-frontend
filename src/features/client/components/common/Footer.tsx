import { Link } from 'react-router-dom';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white py-16 border-t border-neutral-100 relative">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Logo Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-h5-bold">M</span>
              </div>
              <h2 className="text-xl font-extrabold text-primary-600 tracking-tight leading-tight">
                Mitra Daya Kreasi
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">Workshop Furniture</span>
              </h2>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-body-sm-bold text-neutral-900 mb-2 font-semibold">Alamat Workshop</h4>
                <p className="text-body-sm-regular text-neutral-500 leading-relaxed">
                  GPF2+3GH, Tegal, Kemang,<br />
                  Kabupaten Bogor, Jawa Barat 16310.
                </p>
              </div>
              <div>
                <h4 className="text-body-sm-bold text-neutral-900 mb-2 font-semibold">Kontak</h4>
                <a 
                  href="https://wa.me/628986639200" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-body-sm-regular text-neutral-500 hover:text-primary-600 transition-colors"
                >
                  0898-6639-200
                </a>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-body-sm-bold text-neutral-900 mb-6 uppercase tracking-wider">Perusahaan</h4>
            <ul className="space-y-4 text-body-sm-regular text-neutral-500 flex flex-col">
              <li>
                <Link to="/about" onClick={handleScrollToTop} className="hover:text-primary-600 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/portfolio" onClick={handleScrollToTop} className="hover:text-primary-600 transition-colors">
                  Portofolio
                </Link>
              </li>
              <li>
                <Link to="/karir" onClick={handleScrollToTop} className="hover:text-primary-600 transition-colors">
                  Karir
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-body-sm-bold text-neutral-900 mb-6 uppercase tracking-wider">Layanan</h4>
            <ul className="space-y-4 text-body-sm-regular text-neutral-500 flex flex-col">
              <li>
                <Link to="/services" onClick={handleScrollToTop} className="hover:text-primary-600 transition-colors">
                  Furniture Custom
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={handleScrollToTop} className="hover:text-primary-600 transition-colors">
                  Interior
                </Link>
              </li>
              <li>
                <a href="/services#contact" className="hover:text-primary-600 transition-colors">
                  Konsultasi
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-body-sm-bold text-neutral-900 mb-6 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-4 text-body-sm-regular text-neutral-500 flex flex-col">
              <li>
                <Link to="/privacy" onClick={handleScrollToTop} className="hover:text-primary-600 transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link to="/terms" onClick={handleScrollToTop} className="hover:text-primary-600 transition-colors">
                  Syarat Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-body-sm-regular text-neutral-400">
            © 2026 Workshop Furniture Mitra Daya Kreasi. Semua Hak Dilindungi.
          </p>
          <div className="flex gap-6 text-neutral-500">
            {/* Twitter / X SVG */}
            <a href="#" className="hover:text-primary-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            {/* LinkedIn SVG */}
            <a href="#" className="hover:text-primary-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            {/* Instagram SVG */}
            <a href="#" className="hover:text-primary-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}