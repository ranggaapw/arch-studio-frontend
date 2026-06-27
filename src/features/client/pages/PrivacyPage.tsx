import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full pt-32 pb-16 px-8 flex flex-col items-center justify-center text-center">
        <span className="text-sm md:text-base font-extrabold text-primary-600 uppercase tracking-[0.2em] mb-3 block">
          Legalitas
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4 tracking-tight max-w-4xl">
          Kebijakan <span className="text-primary-600">Privasi</span>
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl">
          Terakhir diperbarui: 27 Juni 2026
        </p>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-8 pb-32">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200/50 shadow-sm space-y-8 text-neutral-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">1. Pengumpulan Informasi</h2>
            <p>
              Kami mengumpulkan informasi yang Anda berikan secara langsung saat mengisi formulir konsultasi di situs kami, termasuk nama lengkap, alamat email, subjek pesan, dan deskripsi proyek Anda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">2. Penggunaan Informasi</h2>
            <p>
              Informasi yang kami kumpulkan digunakan untuk:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Menghubungi Anda kembali terkait permintaan konsultasi furniture.</li>
              <li>Memberikan penawaran harga dan estimasi biaya proyek secara akurat.</li>
              <li>Meningkatkan kualitas pelayanan pelanggan kami di workshop.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">3. Keamanan Data</h2>
            <p>
              Kami berkomitmen untuk menjaga keamanan data pribadi Anda. Informasi Anda disimpan dengan aman dan tidak akan pernah dijual, disewakan, atau dibagikan kepada pihak ketiga di luar Mitra Daya Kreasi tanpa izin eksplisit dari Anda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">4. Hak Pengguna</h2>
            <p>
              Anda memiliki hak penuh untuk meminta kami memperbarui, mengubah, atau menghapus informasi kontak Anda dari basis data kami kapan saja dengan menghubungi kami via telepon atau formulir kontak yang tersedia.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
