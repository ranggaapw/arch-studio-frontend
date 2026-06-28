import { useState, useEffect } from 'react';
import { Save, Plus, X } from 'lucide-react';
import type { HeroBanner, Project } from '../../../types';
import { homeService } from '../../../services/homeService';
import { projectService } from '../../../services/projectService';

const AVAILABLE_CATEGORIES = [
  'rumah tropis modern',
  'minimalis modern',
  'klasik',
  'industrial'
];

export default function HeroBannerManager() {
  const [banner, setBanner] = useState<HeroBanner | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, projectsRes] = await Promise.all([
          homeService.getHeroBanner(),
          projectService.getProjects()
        ]);
        
        const bannerData = { ...bannerRes.data };
        if (!bannerData.description) {
          bannerData.description = 'Mitra Daya Kreasi (MDK) adalah workshop pembuatan furniture custom, desainer interior, sekaligus kontraktor terpercaya. Kami menghadirkan kualitas rancangan arsitektur dan interior modern dengan presisi pengerjaan terbaik untuk mewujudkan ruang impian Anda.';
        }
        if (!bannerData.backgroundImageUrl) {
          bannerData.backgroundImageUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920';
        }

        setBanner(bannerData);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (banner) {
          setBanner({ ...banner, backgroundImageUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner) return;

    setSaving(true);
    setMessage('');
    try {
      // Save Hero Banner
      const res = await homeService.updateHeroBanner(banner);
      setBanner(res.data);

      // Save New Project if form is open and has title
      if (editingProject && editingProject.title) {
        const projRes = await projectService.createProject(editingProject as Omit<Project, 'id'>);
        // Ensure the new project is appended
        setProjects(prev => [...prev, projRes.data]);
        setEditingProject(null); // Close the form after successful save
      }

      setMessage('Semua perubahan berhasil disimpan!');
    } catch (error) {
      console.error('Failed to update', error);
      setMessage('Gagal menyimpan perubahan.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingProject) {
          setEditingProject({ ...editingProject, imageUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && editingProject) {
      const currentImages = editingProject.galleryImages || [];
      const newImages: string[] = [];
      let loadedCount = 0;

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            newImages.push(reader.result);
          }
          loadedCount++;
          if (loadedCount === files.length) {
            setEditingProject({
              ...editingProject,
              galleryImages: [...currentImages, ...newImages]
            });
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const updatedProject = { ...project, isFeatured: !project.isFeatured };
      await projectService.updateProject(project.id, updatedProject);
      setProjects(projects.map(p => p.id === project.id ? updatedProject : p));
    } catch (error) {
      console.error('Failed to update project feature status', error);
      alert('Gagal mengupdate status desain terbaik.');
    }
  };

  if (loading) return <div className="text-neutral-500 animate-pulse">Loading data...</div>;
  if (!banner) return <div className="text-red-500">Failed to load data.</div>;

  return (
    <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
      <form id="hero-banner-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Subtitle (Small text)</label>
            <input
              type="text"
              required
              value={banner.subtitle}
              onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Main Title</label>
            <input
              type="text"
              required
              value={banner.title}
              onChange={(e) => setBanner({ ...banner, title: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea
              required
              rows={4}
              value={banner.description}
              onChange={(e) => setBanner({ ...banner, description: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Background Image (URL atau Upload File)</label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                required
                value={banner.backgroundImageUrl}
                onChange={(e) => setBanner({ ...banner, backgroundImageUrl: e.target.value })}
                className="flex-1 px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                placeholder="https://... atau upload ->"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full md:max-w-xs px-2 py-2 bg-white rounded-xl border border-neutral-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>
            {banner.backgroundImageUrl && (
              <div className="mt-4">
                <img src={banner.backgroundImageUrl} alt="Preview" className="h-32 object-cover rounded-xl border border-neutral-200" />
              </div>
            )}
          </div>
        </div>
      </form>

      {/* SECTION DESAIN TERBAIK */}
      <div className="mt-12 pt-12 border-t border-neutral-200">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-neutral-900">Kelola Desain Terbaik</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Pilih proyek portofolio mana saja yang ingin ditampilkan sebagai "Desain Terbaik" di halaman depan.
            </p>
          </div>
          {!editingProject && (
            <button
              type="button"
              onClick={() => setEditingProject({ title: '', description: '', imageUrl: '', isFeatured: true })}
              className="px-4 py-2 bg-primary-900 text-white rounded-lg flex items-center gap-2 hover:bg-primary-800 transition-colors cursor-pointer"
            >
              <Plus size={18} /> Tambah Desain
            </button>
          )}
        </div>
        
        {editingProject ? (
          <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 mb-6 relative">
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Batal Tambah Desain"
            >
              <X size={20} />
            </button>
            <h4 className="font-bold text-neutral-900 mb-4">Tambah Desain Baru</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Judul Desain</label>
                <input
                  type="text"
                  form="hero-banner-form"
                  required={!!editingProject}
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Deskripsi</label>
                <textarea
                  form="hero-banner-form"
                  required={!!editingProject}
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Image (URL atau Upload File)</label>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    form="hero-banner-form"
                    required={!!editingProject}
                    value={editingProject.imageUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    className="flex-1 px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                    placeholder="https://... atau upload ->"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProjectImageUpload}
                    className="w-full md:max-w-xs px-2 py-2 bg-white rounded-xl border border-neutral-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
                {editingProject.imageUrl && (
                  <div className="mt-2">
                    <img src={editingProject.imageUrl} alt="Preview" className="h-24 object-cover rounded-xl border border-neutral-200" />
                  </div>
                )}
              </div>

              {/* DETAILS FIELDS FOR MODAL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nama Klien</label>
                  <input
                    type="text"
                    form="hero-banner-form"
                    value={editingProject.clientName || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                    placeholder="Bapak A / Company B"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Lokasi Proyek</label>
                  <input
                    type="text"
                    form="hero-banner-form"
                    value={editingProject.location || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                    placeholder="Jakarta / Bali"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Tahun Proyek</label>
                  <input
                    type="number"
                    form="hero-banner-form"
                    value={editingProject.year || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, year: parseInt(e.target.value) || undefined })}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                    placeholder="2024"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Bahan &amp; Material (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  form="hero-banner-form"
                  value={editingProject.materials || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, materials: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                  placeholder="Kayu Jati, Kaca Tempered, Beton Ekspos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Gambar Galeri / Slideshow</label>
                
                {/* Gallery Preview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-2">
                  {editingProject.galleryImages?.map((url, idx) => (
                    <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm">
                      <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingProject.galleryImages || []).filter((_, i) => i !== idx);
                          setEditingProject({ ...editingProject, galleryImages: updated });
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors cursor-pointer shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Hapus gambar ini"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload Card / Button */}
                  <label className="relative aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-primary-600 rounded-xl cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors shadow-sm">
                    <Plus className="text-neutral-400" size={24} />
                    <span className="text-xs font-semibold text-neutral-500 mt-1 text-center px-1">Upload Foto</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Add image URL input */}
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="Atau masukkan URL gambar..."
                    id="gallery-url-input"
                    className="flex-1 px-4 py-2.5 bg-white rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-primary-600 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const target = e.currentTarget;
                        const url = target.value.trim();
                        if (url) {
                          const current = editingProject.galleryImages || [];
                          setEditingProject({ ...editingProject, galleryImages: [...current, url] });
                          target.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('gallery-url-input') as HTMLInputElement;
                      const url = input?.value?.trim();
                      if (url) {
                        const current = editingProject.galleryImages || [];
                        setEditingProject({ ...editingProject, galleryImages: [...current, url] });
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-700 transition-colors cursor-pointer"
                  >
                    Tambah URL
                  </button>
                </div>
                <p className="text-xs text-neutral-400 mt-2">Anda bisa mengupload beberapa file gambar sekaligus atau menempelkan URL gambar langsung.</p>
              </div>
              
              {/* KATEGORI DESAIN CHECKBOX */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Kategori Desain (Bisa pilih lebih dari satu)</label>
                <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-neutral-200">
                  {AVAILABLE_CATEGORIES.map((cat) => {
                    const isChecked = editingProject.categories?.includes(cat) || false;
                    return (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-700">
                        <input
                          type="checkbox"
                          form="hero-banner-form"
                          checked={isChecked}
                          onChange={(e) => {
                            const currentCats = editingProject.categories || [];
                            const nextCats = e.target.checked
                              ? [...currentCats, cat]
                              : currentCats.filter(c => c !== cat);
                            setEditingProject({ ...editingProject, categories: nextCats });
                          }}
                          className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500 cursor-pointer"
                        />
                        <span className="capitalize">{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    form="hero-banner-form"
                    checked={!!editingProject.isFeatured}
                    onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded border-neutral-300 focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="font-medium text-neutral-700">Jadikan Desain Terbaik (Tampil di Home Banner)</span>
                </label>
                <p className="text-sm text-neutral-500 ml-7 mt-1">Jika tidak dicentang, desain ini akan masuk ke bagian "Desain Terbaru Kami".</p>
              </div>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center bg-neutral-50 rounded-xl text-neutral-500 border border-neutral-200">
            Belum ada data proyek. Silakan tambahkan proyek di menu Portofolio terlebih dahulu.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className={`flex flex-col bg-white rounded-xl border transition-colors ${project.isFeatured ? 'border-primary-500 ring-1 ring-primary-500' : 'border-neutral-200 hover:border-neutral-300'}`}>
                <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-neutral-100">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 shadow-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!project.isFeatured}
                        onChange={() => handleToggleFeatured(project)}
                        className="w-5 h-5 text-primary-600 rounded border-neutral-300 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-neutral-700 select-none">Tampilkan</span>
                    </label>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-semibold text-neutral-900 line-clamp-1 mb-1">{project.title}</h4>
                  
                  {project.categories && project.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.categories.map(cat => (
                        <span key={cat} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded capitalize">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-neutral-500 line-clamp-2">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-8 mt-8 border-t border-neutral-200">
        <button
          type="submit"
          form="hero-banner-form"
          disabled={saving}
          className="px-8 py-4 flex items-center gap-2 bg-primary-900 text-white font-bold hover:bg-primary-800 rounded-xl shadow-lg transition-all hover:-translate-y-1 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <Save size={20} /> {saving ? 'Menyimpan Perubahan...' : 'Simpan Semua Perubahan'}
        </button>
      </div>
    </div>
  );
}
