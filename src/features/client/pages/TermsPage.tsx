import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full pt-32 pb-16 px-8 flex flex-col items-center justify-center text-center">
        <span className="text-sm md:text-base font-extrabold text-primary-600 uppercase tracking-[0.2em] mb-3 block">
          Legalitas
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4 tracking-tight max-w-4xl">
          Syarat & <span className="text-primary-600">Ketentuan</span>
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl">
          Terakhir diperbarui: 27 Juni 2026
        </p>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-8 pb-32">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200/50 shadow-sm space-y-8 text-neutral-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">1. Ruang Lingkup Layanan</h2>
            <p>
              Workshop Furniture Mitra Daya Kreasi menyediakan jasa pembuatan custom furniture (seperti kitchen set, lemari pakaian, ranjang tidur, meja makan, dll) berdasarkan spesifikasi, ukuran, dan bahan yang telah disepakati bersama oleh Klien.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">2. Proses Pembayaran</h2>
            <p>
              Setiap proyek pemesanan furniture custom wajib mengikuti ketentuan pembayaran sebagai berikut:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Pembayaran uang muka (Down Payment / DP) sebesar 50% sebelum proses produksi dimulai di workshop.</li>
              <li>Pelunasan sisa 50% setelah barang selesai diproduksi dan siap dikirim ke lokasi Klien.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">3. Waktu Pengerjaan</h2>
            <p>
              Estimasi durasi produksi berkisar antara 14 hingga 30 hari kerja tergantung pada kompleksitas desain, volume pekerjaan, dan ketersediaan material. Kami akan selalu memberikan informasi progres pengerjaan berkala kepada Klien.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">4. Garansi Kualitas</h2>
            <p>
              Kami memberikan garansi pemeliharaan selama 3 bulan setelah barang dikirim dan dipasang untuk setiap kendala fungsi (seperti engsel longgar, rel laci macet, atau finishing terkelupas secara alami). Garansi tidak berlaku untuk kerusakan akibat kelalaian penggunaan atau bencana alam.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
