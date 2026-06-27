import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { MapPin, Clock, ArrowUpRight, Send, Check, Paperclip, Loader2 } from 'lucide-react';
import { jobApplicationService } from '../../../services/jobApplicationService';

export default function KarirPage() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [cvFileData, setCvFileData] = useState('');

  const jobs = [
    {
      title: 'Tukang Kayu / Woodworker Senior',
      type: 'Full-Time',
      loc: 'Bogor, ID',
      desc: 'Berpengalaman dalam pembuatan furniture custom minimalis dan klasik (Multiplex, HPL, Solid Wood).'
    },
    {
      title: 'Drafter & Estimator Furniture',
      type: 'Full-Time',
      loc: 'Bogor, ID',
      desc: 'Mampu memproses desain 3D menjadi gambar kerja CAD (2D) detail dan menyusun RAB produksi.'
    },
    {
      title: 'Helper Workshop / Finishing Operator',
      type: 'Full-Time',
      loc: 'Bogor, ID',
      desc: 'Membantu pengamplasan, pendempulan, dan aplikasi spray melamine/duco berkualitas tinggi.'
    }
  ];

  const handleApplyClick = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setShowApplyModal(true);
    setApplied(false);
    // Reset form fields
    setName('');
    setEmail('');
    setPhone('');
    setCoverLetter('');
    setCvFileName('');
    setCvFileData('');
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvFileData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await jobApplicationService.createApplication({
        jobTitle: selectedJob,
        name,
        email,
        phone,
        cvFileName,
        cvFileData,
        coverLetter
      });
      setApplied(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setApplied(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim lamaran. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-x-hidden font-sans">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section 
        className="relative w-full min-h-[75vh] pt-32 pb-20 px-8 flex flex-col items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.75)), url('https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?auto=format&fit=crop&w=1600&q=80')` }}
      >
        <div className="max-w-4xl mx-auto z-10 text-white">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-4">
            Become Part of <span className="text-primary-500">#MDKteam</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 font-medium tracking-wide mb-2 uppercase">
            Bergabung dan Menjadi Inovator
          </p>
          <div className="w-16 h-1 bg-primary-500 mx-auto mt-6 rounded-full"></div>
        </div>
      </section>

      {/* --- EMPOWERING YOUR POTENTIAL --- */}
      <section className="w-full py-24 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-16 tracking-tight">
            Empowering Your Potential
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Growth Opportunities',
                desc: 'Kesempatan belajar langsung dari pengrajin senior dan desainer interior profesional untuk meningkatkan keahlian Anda.',
                img: 'https://images.unsplash.com/photo-1531535934027-689615776d68?w=500'
              },
              {
                title: 'People First',
                desc: 'Lingkungan kerja kekeluargaan yang suportif, aman, dan saling menghargai kontribusi setiap anggota tim.',
                img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500'
              },
              {
                title: 'Inspiring Community',
                desc: 'Berkolaborasi bersama tim desainer kreatif dan produsen guna melahirkan produk furniture berkualitas tinggi.',
                img: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500'
              }
            ].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-48 h-48 rounded-2xl overflow-hidden mb-6 shadow-md transition-transform duration-500 group-hover:scale-105">
                  <img src={val.img} alt={val.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">{val.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- OUR CULTURE --- */}
      <section className="w-full py-24 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <span className="text-sm md:text-base font-extrabold text-primary-600 uppercase tracking-[0.2em] mb-3 block">
            Our Culture
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-16 tracking-tight">
            Cara Kerja yang Membentuk Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Teamwork',
                desc: 'Menyatukan keahlian desain dan presisi pengerjaan kayu guna menghadirkan kualitas produk furniture terbaik bagi klien.'
              },
              {
                title: 'Integrity',
                desc: 'Membangun kepercayaan melalui kejujuran bahan kayu asli, ketepatan waktu pengiriman, dan transparansi proses workshop.'
              },
              {
                title: 'Innovation',
                desc: 'Terus bereksperimen dengan metode perakitan modern, efisiensi bahan baku, serta detail konstruksi tahan lama.'
              }
            ].map((culture, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-neutral-200/50 shadow-sm text-left group hover:-translate-y-1.5 transition-all duration-300">
                <div className="text-4xl font-extrabold text-primary-600/20 mb-4 group-hover:text-primary-600/100 transition-colors duration-300">
                  {culture.title.substring(0, 2)}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{culture.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {culture.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EXCITING OPPORTUNITIES --- */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Exciting Opportunities
            </h2>
            <div className="w-12 h-1 bg-primary-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job, idx) => (
              <div 
                key={idx} 
                className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100 flex flex-col justify-between hover:shadow-md hover:border-primary-500/30 transition-all duration-300 group"
              >
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex gap-4 text-xs text-neutral-500 font-medium mb-6">
                    <span className="bg-white px-2.5 py-1 rounded-full border border-neutral-200/60">{job.type}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {job.loc}</span>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                    {job.desc}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleApplyClick(job.title)}
                  className="w-full py-3.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors cursor-pointer group-hover:scale-[1.02] duration-300"
                >
                  Apply Job <ArrowUpRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- APPLICATION MODAL --- */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-neutral-950/70 flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 md:p-10 max-w-3xl w-full shadow-2xl relative border border-neutral-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowApplyModal(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {applied ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Lamaran Terkirim!</h3>
                <p className="text-neutral-500 text-sm">
                  Lamaran Anda untuk posisi <strong>{selectedJob}</strong> berhasil dikirim. Kami akan meninjau berkas Anda dan menghubungi Anda kembali.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block mb-1">Form Lamaran Kerja (Widescreen)</span>
                  <h3 className="text-2xl font-bold text-neutral-900">Lamar Posisi: {selectedJob}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
                      <input 
                        required 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-neutral-800" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Alamat Email</label>
                      <input 
                        required 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-neutral-800" 
                        placeholder="john@example.com" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Nomor Telepon</label>
                      <input 
                        required 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-neutral-800" 
                        placeholder="08123456789" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Unggah CV / Resume</label>
                      <div className="relative w-full">
                        <input 
                          required 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={handleCvUpload}
                          className="hidden" 
                          id="cv-upload-input"
                        />
                        <label 
                          htmlFor="cv-upload-input"
                          className="w-full px-4 py-3 bg-neutral-50 border border-dashed border-neutral-300 hover:border-primary-500 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold text-neutral-600 transition-colors py-4"
                        >
                          <Paperclip size={18} className="text-neutral-400" />
                          {cvFileName ? cvFileName : 'Pilih File (PDF, DOC, DOCX)'}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Cover Letter) */}
                  <div className="flex flex-col h-full">
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Surat Lamaran / Cover Letter</label>
                    <textarea 
                      required
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all flex-1 min-h-[220px] resize-none text-neutral-800 text-sm leading-relaxed" 
                      placeholder="Tuliskan perkenalan singkat diri Anda, keahlian utama, dan mengapa Anda tertarik bekerja di bengkel produksi furniture kami..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-neutral-100">
                  <button 
                    type="button" 
                    onClick={() => setShowApplyModal(false)}
                    className="px-6 py-3 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-sm font-bold text-neutral-600 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors disabled:opacity-75 cursor-pointer min-w-[160px]"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Kirim Lamaran <Send size={16} /></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
