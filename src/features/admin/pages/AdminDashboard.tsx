import { useState } from 'react';
import { LayoutDashboard, Home, Briefcase, FolderOpen, Info, LogOut, Edit2, X, Save, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA SEMENTARA ---
const initialProjects = [
  { id: 1, title: 'Modern Minimalist House', description: 'Desain rumah minimalis di pusat kota.', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500' },
  { id: 2, title: 'Urban Coffee Shop', description: 'Renovasi interior kedai kopi bergaya industrial.', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  // Menu yang tersedia: 'dashboard' | 'home' | 'services' | 'portfolio' | 'about'
  const [activeTab, setActiveTab] = useState('dashboard');

  // State untuk Portofolio
  const [projects, setProjects] = useState(initialProjects);
  const [editingProject, setEditingProject] = useState<any>(null);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  // Fungsi helper untuk ganti tab dengan rapi
  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
    setEditingProject(null); // Reset form jika ada yang sedang terbuka
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-neutral-200 p-6 flex flex-col justify-between h-screen sticky top-0">
        <div>
          <h1 className="text-xl font-bold text-primary-600 mb-10">Arch Admin</h1>

          <nav className="space-y-2">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 mt-4 px-4">Menu Utama</p>
            <button
              onClick={() => switchTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${activeTab === 'dashboard' ? 'bg-primary-50 text-primary-600 font-bold' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <LayoutDashboard size={20} /> Dashboard
            </button>

            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 mt-8 px-4">Kelola Konten</p>
            <button
              onClick={() => switchTab('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${activeTab === 'home' ? 'bg-primary-50 text-primary-600 font-bold' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <Home size={20} /> Home Banner
            </button>
            <button
              onClick={() => switchTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${activeTab === 'services' ? 'bg-primary-50 text-primary-600 font-bold' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <Briefcase size={20} /> Layanan
            </button>
            <button
              onClick={() => switchTab('portfolio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${activeTab === 'portfolio' ? 'bg-primary-50 text-primary-600 font-bold' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <FolderOpen size={20} /> Portofolio
            </button>
            <button
              onClick={() => switchTab('about')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${activeTab === 'about' ? 'bg-primary-50 text-primary-600 font-bold' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <Info size={20} /> Tentang Kami
            </button>
          </nav>
        </div>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer mt-8"
        >
          <LogOut size={20} />
          <span className="relative">
            Logout
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* VIEW: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h2>
              <p className="text-neutral-500">Selamat datang kembali, Admin!</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Total Portofolio', value: projects.length.toString() },
                { title: 'Total Layanan', value: '4' },
                { title: 'Pesan Masuk', value: '12' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                  <h3 className="text-neutral-500 text-sm mb-2">{stat.title}</h3>
                  <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: HOME BANNER (Contoh Struktur) */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900">Kelola Home Banner</h2>
              <p className="text-neutral-500">Ubah teks utama (Eksplorasi Ruang dan Estetika...) yang tampil di halaman depan.</p>
            </header>
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
              <p className="text-neutral-400 italic mb-4">Form CRUD Home Banner akan diletakkan di sini...</p>
              {/* Tempat kamu membuat form update teks hero */}
            </div>
          </div>
        )}

        {/* VIEW: LAYANAN (Contoh Struktur) */}
        {activeTab === 'services' && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Kelola Layanan</h2>
                <p className="text-neutral-500">Daftar layanan arsitektur yang ditawarkan Arch Studio.</p>
              </div>
              <button className="px-4 py-2 bg-primary-900 text-white rounded-lg flex items-center gap-2 hover:bg-primary-800 transition-colors cursor-pointer">
                <Plus size={18} /> Tambah Layanan
              </button>
            </header>
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
              <p className="text-neutral-400 italic">Tabel data Layanan akan diletakkan di sini...</p>
            </div>
          </div>
        )}

        {/* VIEW: TENTANG KAMI (Contoh Struktur) */}
        {activeTab === 'about' && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900">Kelola Tentang Kami</h2>
              <p className="text-neutral-500">Ubah profil perusahaan dan visi misi Arch Studio.</p>
            </header>
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
              <p className="text-neutral-400 italic mb-4">Form Editor Tentang Kami akan diletakkan di sini...</p>
            </div>
          </div>
        )}

        {/* VIEW: PORTOFOLIO (Sudah Jadi) */}
        {activeTab === 'portfolio' && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {editingProject ? 'Edit Portofolio' : 'Kelola Portofolio'}
                </h2>
                <p className="text-neutral-500">
                  {editingProject ? 'Ubah detail proyek.' : 'Daftar proyek yang tampil di halaman portofolio.'}
                </p>
              </div>
              {!editingProject && (
                <button className="px-4 py-2 bg-primary-900 text-white rounded-lg flex items-center gap-2 hover:bg-primary-800 transition-colors cursor-pointer">
                  <Plus size={18} /> Tambah Proyek
                </button>
              )}
            </header>

            {/* FORM EDIT PORTOFOLIO */}
            {editingProject ? (
              <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
                <form onSubmit={handleSaveProject} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Project Title</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Image URL (Sementara)</label>
                      <input
                        type="text"
                        required
                        value={editingProject.imageUrl}
                        onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                      <textarea
                        required
                        rows={8}
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none resize-y"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-6 py-3 flex items-center gap-2 text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <X size={20} /> Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 flex items-center gap-2 bg-primary-900 text-white font-medium hover:bg-primary-800 rounded-xl transition-colors cursor-pointer"
                    >
                      <Save size={20} /> Save Changes
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* TABEL DATA PORTOFOLIO */
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden w-full">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-4 text-sm font-medium text-neutral-500">Image</th>
                      <th className="px-6 py-4 text-sm font-medium text-neutral-500">Project Info</th>
                      <th className="px-6 py-4 text-sm font-medium text-neutral-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4">
                          <img src={project.imageUrl} alt={project.title} className="w-20 h-14 object-cover rounded-lg border border-neutral-200" />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-900">{project.title}</p>
                          <p className="text-sm text-neutral-500 line-clamp-1">{project.description}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setEditingProject(project)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
                          >
                            <Edit2 size={16} /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}