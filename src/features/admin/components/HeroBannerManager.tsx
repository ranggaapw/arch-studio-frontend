import { useState, useEffect } from 'react';
import { Save, Plus, X } from 'lucide-react';
import type { HeroBanner, Project } from '../../../types';
import { homeService } from '../../../services/homeService';
import { projectService } from '../../../services/projectService';

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
        setBanner(bannerRes.data);
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
