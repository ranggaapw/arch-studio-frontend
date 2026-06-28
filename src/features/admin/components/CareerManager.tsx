import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Briefcase, Loader2, Save, Image as ImageIcon, Sparkles, Heart, X } from 'lucide-react';
import { careerService } from '../../../services/careerService';
import type { JobOpening, CareerPageContent, PotentialItem, CultureItem } from '../../../types';

export default function CareerManager() {
  // Tab control inside Career Manager: 'content' | 'jobs'
  const [subTab, setSubTab] = useState<'content' | 'jobs'>('content');
  
  // Job openings state
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [editingJob, setEditingJob] = useState<JobOpening | Partial<JobOpening> | null>(null);
  const [savingJob, setSavingJob] = useState(false);

  // Career page content state
  const [content, setContent] = useState<CareerPageContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [savingContent, setSavingContent] = useState(false);

  const fetchData = async () => {
    try {
      setLoadingJobs(true);
      setLoadingContent(true);
      const [jobsRes, contentRes] = await Promise.all([
        careerService.getJobOpenings(),
        careerService.getCareerContent()
      ]);
      setJobs(jobsRes?.data || []);
      
      let rawContent: any = contentRes?.data || {};
      if (Array.isArray(rawContent)) {
        rawContent = rawContent[0] || {};
      }
      
      const parseSafe = (val: any, fallback: any) => {
        if (!val) return fallback;
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch (e) {
            console.error("Failed to parse JSON", e);
            return fallback;
          }
        }
        return val;
      };

      const defaultPotentials = [
        { title: 'Growth Opportunities', desc: 'Kesempatan belajar langsung dari pengrajin senior dan desainer interior profesional untuk meningkatkan keahlian Anda.', imgUrl: 'https://images.unsplash.com/photo-1531535934027-689615776d68?w=500' },
        { title: 'People First', desc: 'Lingkungan kerja kekeluargaan yang suportif, aman, dan saling menghargai kontribusi setiap anggota tim.', imgUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500' },
        { title: 'Inspiring Community', desc: 'Berkolaborasi bersama tim desainer kreatif dan produsen guna melahirkan produk furniture berkualitas tinggi.', imgUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500' }
      ];
      const defaultCultures = [
        { title: 'Teamwork', desc: 'Menyatukan keahlian desain dan presisi pengerjaan kayu guna menghadirkan kualitas produk furniture terbaik bagi klien.' },
        { title: 'Integrity', desc: 'Membangun kepercayaan melalui kejujuran bahan kayu asli, ketepatan waktu pengiriman, dan transparansi proses workshop.' },
        { title: 'Innovation', desc: 'Terus bereksperimen dengan metode perakitan modern, efisiensi bahan baku, serta detail konstruksi tahan lama.' }
      ];

      const parsedPotentials = parseSafe(rawContent.potentials, null);
      const parsedCultures = parseSafe(rawContent.cultures, null);

      setContent({
        heroTitle: rawContent.heroTitle || 'Become Part of #MDKteam',
        heroSubtitle: rawContent.heroSubtitle || 'Bergabung dan Menjadi Inovator',
        heroBgUrl: rawContent.heroBgUrl || 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?auto=format&fit=crop&w=1600&q=80',
        potentials: (Array.isArray(parsedPotentials) && parsedPotentials.length > 0) ? parsedPotentials : defaultPotentials,
        cultures: (Array.isArray(parsedCultures) && parsedCultures.length > 0) ? parsedCultures : defaultCultures
      });
    } catch (error) {
      console.error('Failed to fetch career data', error);
    } finally {
      setLoadingJobs(false);
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    setSavingJob(true);
    try {
      if ('id' in editingJob && editingJob.id) {
        // Update
        const res = await careerService.updateJobOpening(editingJob.id, editingJob as JobOpening);
        setJobs(jobs.map(j => j.id === res.data.id ? res.data : j));
      } else {
        // Create
        const res = await careerService.createJobOpening(editingJob as Omit<JobOpening, 'id'>);
        setJobs([...jobs, res.data]);
      }
      setEditingJob(null);
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan lowongan.');
    } finally {
      setSavingJob(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lowongan pekerjaan ini?')) return;
    try {
      await careerService.deleteJobOpening(id);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSavingContent(true);
    try {
      await careerService.updateCareerContent(content);
      alert('Konten halaman karir berhasil diperbarui!');
    } catch (error) {
      console.error(error);
      alert('Gagal memperbarui konten halaman.');
    } finally {
      setSavingContent(true);
      setTimeout(() => setSavingContent(false), 800);
    }
  };

  // Helper to compress images before converting to base64
  const compressImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Base64 image handler helper
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    target: 'hero' | { type: 'potential'; index: number }
  ) => {
    const file = e.target.files?.[0];
    if (file && content) {
      try {
        const maxDim = target === 'hero' ? 1200 : 600;
        const base64 = await compressImage(file, maxDim, maxDim, 0.75);
        if (target === 'hero') {
          setContent({ ...content, heroBgUrl: base64 });
        } else {
          const updatedPotentials = [...content.potentials];
          updatedPotentials[target.index] = {
            ...updatedPotentials[target.index],
            imgUrl: base64
          };
          setContent({ ...content, potentials: updatedPotentials });
        }
      } catch (err) {
        console.error("Failed to compress image", err);
      }
    }
  };

  // Potential card inputs change helper
  const handlePotentialChange = (index: number, field: keyof PotentialItem, value: string) => {
    if (!content) return;
    const updated = [...content.potentials];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, potentials: updated });
  };

  const handleAddPotential = () => {
    if (!content) return;
    setContent({ ...content, potentials: [...content.potentials, { title: '', desc: '', imgUrl: 'https://images.unsplash.com/photo-1531535934027-689615776d68?w=500' }] });
  };

  const handleRemovePotential = (index: number) => {
    if (!content || content.potentials.length <= 1) return;
    setContent({ ...content, potentials: content.potentials.filter((_, i) => i !== index) });
  };

  // Culture item inputs change helper
  const handleCultureChange = (index: number, field: keyof CultureItem, value: string) => {
    if (!content) return;
    const updated = [...content.cultures];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, cultures: updated });
  };

  const handleAddCulture = () => {
    if (!content) return;
    setContent({ ...content, cultures: [...content.cultures, { title: '', desc: '' }] });
  };

  const handleRemoveCulture = (index: number) => {
    if (!content || content.cultures.length <= 1) return;
    setContent({ ...content, cultures: content.cultures.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header & Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Kelola Halaman Karir</h2>
          <p className="text-neutral-500">Edit layout halaman statis karir dan postingan lowongan kerja aktif.</p>
        </div>
        
        {/* Inner Sub Tabs Toggle */}
        <div className="flex bg-neutral-100 p-1.5 rounded-xl border border-neutral-200/50">
          <button
            onClick={() => setSubTab('content')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              subTab === 'content' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Konten Halaman
          </button>
          <button
            onClick={() => setSubTab('jobs')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              subTab === 'jobs' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Daftar Lowongan
          </button>
        </div>
      </div>

      {/* --- SUB TAB 1: EDIT LAYOUT CONTENT --- */}
      {subTab === 'content' && (
        <div className="animate-in fade-in duration-300">
          {loadingContent || !content ? (
            <div className="space-y-6">
              <div className="h-40 bg-neutral-100 animate-pulse rounded-2xl"></div>
              <div className="h-60 bg-neutral-100 animate-pulse rounded-2xl"></div>
            </div>
          ) : (
            <form onSubmit={handleSaveContent} className="space-y-8">
              {/* SECTION: HERO HEADER */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <Sparkles className="text-primary-500" size={20} />
                  Bagian Hero Banner Utama
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Judul Banner (Hero Title)</label>
                      <input
                        required
                        type="text"
                        value={content.heroTitle}
                        onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-neutral-800"
                        placeholder="Contoh: Become Part of #MDKteam"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Sub-Judul (Hero Subtitle)</label>
                      <input
                        required
                        type="text"
                        value={content.heroSubtitle}
                        onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-neutral-800"
                        placeholder="Contoh: Bergabung dan Menjadi Inovator"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">Gambar Latar Belakang (Hero Background)</label>
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 flex-shrink-0 relative">
                        {content.heroBgUrl ? (
                          <img src={content.heroBgUrl} alt="Hero Background" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400"><ImageIcon size={24} /></div>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'hero')}
                          className="hidden"
                          id="hero-bg-file"
                        />
                        <label
                          htmlFor="hero-bg-file"
                          className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold cursor-pointer border border-neutral-300 transition-colors inline-block"
                        >
                          Pilih Gambar Baru
                        </label>
                        <p className="text-[10px] text-neutral-400 mt-1.5">Maks. 2MB, Rekomendasi rasio landscape 16:9.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: EMPOWERING YOUR POTENTIAL */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <Sparkles className="text-primary-500" size={20} />
                    Bagian "Empowering Your Potential"
                  </h3>
                  <button type="button" onClick={handleAddPotential} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold cursor-pointer border border-primary-200 transition-colors">
                    <Plus size={12} /> Tambah Kartu
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {content.potentials.map((item, index) => (
                    <div key={index} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                          <h4 className="font-bold text-neutral-800 text-sm">Kartu {index + 1}</h4>
                        </div>
                        {content.potentials.length > 1 && (
                          <button type="button" onClick={() => handleRemovePotential(index)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Hapus kartu ini">
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase">Judul Kartu</label>
                        <input
                          required
                          type="text"
                          value={item.title}
                          onChange={(e) => handlePotentialChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 text-xs text-neutral-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase">Deskripsi</label>
                        <textarea
                          required
                          rows={3}
                          value={item.desc}
                          onChange={(e) => handlePotentialChange(index, 'desc', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 text-xs text-neutral-600 resize-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase">Visual Gambar</label>
                        <div className="flex gap-3 items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-200 bg-white flex-shrink-0">
                            {item.imgUrl ? (
                              <img src={item.imgUrl} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400"><ImageIcon size={16} /></div>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, { type: 'potential', index })}
                              className="hidden"
                              id={`potential-img-file-${index}`}
                            />
                            <label
                              htmlFor={`potential-img-file-${index}`}
                              className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 text-neutral-700 rounded-lg text-[10px] font-semibold cursor-pointer border border-neutral-300 transition-colors inline-block"
                            >
                              Ganti Gambar
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: OUR CULTURE */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <Heart className="text-red-500" size={20} />
                    Bagian "Our Culture" (Budaya Kerja MDK)
                  </h3>
                  <button type="button" onClick={handleAddCulture} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold cursor-pointer border border-red-200 transition-colors">
                    <Plus size={12} /> Tambah Nilai
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {content.cultures.map((item, index) => (
                    <div key={index} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                          <h4 className="font-bold text-neutral-800 text-sm">Nilai Budaya {index + 1}</h4>
                        </div>
                        {content.cultures.length > 1 && (
                          <button type="button" onClick={() => handleRemoveCulture(index)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Hapus nilai ini">
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase">Judul Budaya</label>
                        <input
                          required
                          type="text"
                          value={item.title}
                          onChange={(e) => handleCultureChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 text-xs text-neutral-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-1 uppercase">Deskripsi Nilai</label>
                        <textarea
                          required
                          rows={3}
                          value={item.desc}
                          onChange={(e) => handleCultureChange(index, 'desc', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 text-xs text-neutral-600 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SAVE BUTTON FOR CONTENT */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={savingContent}
                  className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm cursor-pointer flex items-center gap-2 min-w-[200px] justify-center"
                >
                  {savingContent ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> Simpan Konten Halaman</>}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* --- SUB TAB 2: ACTIVE JOB OPENINGS CRUD --- */}
      {subTab === 'jobs' && (
        <div className="animate-in fade-in duration-300 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Lowongan Pekerjaan Aktif</h3>
              <p className="text-xs text-neutral-500">Postingan lowongan yang sedang tampil di halaman depan klien.</p>
            </div>
            <button
              onClick={() => setEditingJob({ title: '', type: 'Full-Time', loc: 'Bogor, ID', desc: '' })}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={14} /> Lowongan Baru
            </button>
          </div>

          {loadingJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-44 bg-neutral-100 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-400">
              <Briefcase className="mx-auto text-neutral-300 mb-3" size={36} />
              <p className="font-semibold text-neutral-500">Belum ada lowongan pekerjaan aktif.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-bold text-neutral-900 text-base mb-1.5">{job.title}</h4>
                    <div className="flex gap-3 text-[10px] text-neutral-500 font-medium mb-3">
                      <span className="bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200/60">{job.type}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {job.loc}</span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mb-4">
                      {job.desc}
                    </p>
                  </div>

                  <div className="flex justify-end gap-1.5 border-t border-neutral-100 pt-3 mt-1">
                    <button
                      onClick={() => setEditingJob(job)}
                      className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Lowongan"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Lowongan"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Job Opening CRUD Form Modal */}
          {editingJob && (
            <div className="fixed inset-0 bg-neutral-950/70 flex items-center justify-center p-6 z-50 animate-fade-in">
              <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl relative border border-neutral-100 animate-in zoom-in-95 duration-200">
                <button
                  onClick={() => setEditingJob(null)}
                  className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>

                <form onSubmit={handleSaveJob} className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block mb-1">Manajemen Karir</span>
                    <h3 className="text-xl font-bold text-neutral-900">
                      {editingJob.id ? 'Edit Lowongan Pekerjaan' : 'Tambah Lowongan Baru'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Nama Posisi / Pekerjaan</label>
                      <input
                        required
                        type="text"
                        value={editingJob.title || ''}
                        onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-neutral-800"
                        placeholder="Contoh: Drafter Furniture"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Tipe Pekerjaan</label>
                        <select
                          value={editingJob.type || 'Full-Time'}
                          onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-neutral-800"
                        >
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Lokasi Workshop</label>
                        <input
                          required
                          type="text"
                          value={editingJob.loc || ''}
                          onChange={(e) => setEditingJob({ ...editingJob, loc: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-neutral-800"
                          placeholder="Contoh: Bogor, ID"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Deskripsi Singkat Lowongan</label>
                      <textarea
                        required
                        rows={4}
                        value={editingJob.desc || ''}
                        onChange={(e) => setEditingJob({ ...editingJob, desc: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-neutral-800 text-sm leading-relaxed resize-none"
                        placeholder="Sebutkan tanggung jawab utama dan kualifikasi minimum..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setEditingJob(null)}
                      className="px-6 py-3 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-sm font-bold text-neutral-600 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={savingJob}
                      className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors disabled:opacity-75 cursor-pointer min-w-[140px]"
                    >
                      {savingJob ? <Loader2 className="animate-spin" size={18} /> : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
