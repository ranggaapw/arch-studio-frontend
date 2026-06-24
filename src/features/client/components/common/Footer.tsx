export default function Footer() {
  return (
    <footer className="w-full bg-white py-16 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Logo Section */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-h4-bold text-neutral-900 mb-6">Arch Studio</h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-body-sm-bold text-neutral-900 mb-2">Kantor Pusat</h4>
                <p className="text-body-sm-regular text-neutral-500 leading-relaxed">
                  Jl. Raya Bogor KM 30,<br />
                  Bogor, Jawa Barat, Indonesia.
                </p>
              </div>
              <div>
                <h4 className="text-body-sm-bold text-neutral-900 mb-2">Kontak</h4>
                <p className="text-body-sm-regular text-neutral-500">021-12345678</p>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-body-sm-bold text-neutral-900 mb-6 uppercase tracking-wider">Perusahaan</h4>
            <ul className="space-y-4 text-body-sm-regular text-neutral-500">
              <li><a href="#" className="hover:text-primary-600">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-primary-600">Portofolio</a></li>
              <li><a href="#" className="hover:text-primary-600">Karir</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-body-sm-bold text-neutral-900 mb-6 uppercase tracking-wider">Layanan</h4>
            <ul className="space-y-4 text-body-sm-regular text-neutral-500">
              <li><a href="#" className="hover:text-primary-600">Arsitektur</a></li>
              <li><a href="#" className="hover:text-primary-600">Interior</a></li>
              <li><a href="#" className="hover:text-primary-600">Konsultasi</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-body-sm-bold text-neutral-900 mb-6 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-4 text-body-sm-regular text-neutral-500">
              <li><a href="#" className="hover:text-primary-600">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-primary-600">Syarat Ketentuan</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-body-sm-regular text-neutral-400">
            © 2026 Arch Studio. Semua Hak Dilindungi.
          </p>
          <div className="flex gap-6 text-neutral-500">
            {/* Twitter / X SVG */}
            <a href="#" className="hover:text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            {/* LinkedIn SVG */}
            <a href="#" className="hover:text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            {/* Instagram SVG */}
            <a href="#" className="hover:text-primary-600">
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