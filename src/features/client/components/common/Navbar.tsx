import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="w-full bg-white shadow-arch-lg px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo Area (Diubah menjadi Link ke Home) */}
      <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-h5-bold">M</span>
        </div>
        <span className="text-h5-bold text-neutral-900 tracking-tight">Mitra Daya Kreasi</span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8 text-body-md-medium">
        <Link 
          to="/portfolio" 
          className={`transition-colors ${
            currentPath === '/portfolio' 
              ? 'text-primary-600 font-bold' 
              : 'text-neutral-600 hover:text-primary-600'
          }`}
        >
          Portofolio
        </Link>
        <Link 
          to="/services" 
          className={`transition-colors ${
            currentPath === '/services' 
              ? 'text-primary-600 font-bold' 
              : 'text-neutral-600 hover:text-primary-600'
          }`}
        >
          Layanan
        </Link>
        <Link 
          to="/about" 
          className={`transition-colors ${
            currentPath === '/about' 
              ? 'text-primary-600 font-bold' 
              : 'text-neutral-600 hover:text-primary-600'
          }`}
        >
          Tentang Kami
        </Link>
      </div>

      {/* CTA Button */}
      <Link 
        to="/login" 
        className="px-6 py-2.5 bg-primary-200 text-primary-900 text-body-md-bold rounded-lg hover:bg-primary-300 transition-colors"
      >
        Login Admin
      </Link>
    </nav>
  );
}