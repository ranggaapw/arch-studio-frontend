import { useState, useEffect } from 'react';
import { LayoutDashboard, Home, Briefcase, FolderOpen, Info, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import HeroBannerManager from '../components/HeroBannerManager';
import ServiceManager from '../components/ServiceManager';
import PortfolioManager from '../components/PortfolioManager';
import AboutManager from '../components/AboutManager';
import MessageManager from '../components/MessageManager';
import { projectService } from '../../../services/projectService';
import { serviceService } from '../../../services/serviceService';
import { messageService } from '../../../services/messageService';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Menu yang tersedia: 'dashboard' | 'home' | 'services' | 'portfolio' | 'about'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard Stats
  const [stats, setStats] = useState({ projects: 0, services: 0, messages: 0 });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      const fetchStats = async () => {
        try {
          const [projectsRes, servicesRes, messagesRes] = await Promise.all([
            projectService.getProjects(),
            serviceService.getServices(),
            messageService.getMessages()
          ]);
          setStats({
            projects: projectsRes.data.length,
            services: servicesRes.data.length,
            messages: messagesRes.data.filter(m => !m.isRead).length
          });
        } catch (error) {
          console.error("Failed to fetch stats", error);
        }
      };
      fetchStats();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-neutral-200 p-6 flex flex-col justify-between h-screen sticky top-0">
        <div>
          <h1 className="text-xl font-bold text-primary-600 mb-10">MDK Admin</h1>

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
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 mt-8 px-4 pt-4 border-t border-neutral-100">Komunikasi</p>
            <button
              onClick={() => switchTab('messages')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors cursor-pointer ${activeTab === 'messages' ? 'bg-primary-50 text-primary-600 font-bold' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Pesan Masuk
              </div>
              {stats.messages > 0 && (
                <span className="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {stats.messages}
                </span>
              )}
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
                { title: 'Total Portofolio', value: stats.projects.toString() },
                { title: 'Total Layanan', value: stats.services.toString() },
                { title: 'Pesan Baru', value: stats.messages.toString() }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                  <h3 className="text-neutral-500 text-sm mb-2">{stat.title}</h3>
                  <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: HOME BANNER */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900">Kelola Home Banner</h2>
              <p className="text-neutral-500">Ubah teks utama dan gambar latar yang tampil di halaman depan.</p>
            </header>
            <HeroBannerManager />
          </div>
        )}

        {/* VIEW: LAYANAN */}
        {activeTab === 'services' && (
          <div className="animate-in fade-in duration-300">
            <ServiceManager />
          </div>
        )}

        {/* VIEW: TENTANG KAMI */}
        {activeTab === 'about' && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900">Kelola Tentang Kami</h2>
              <p className="text-neutral-500">Ubah profil perusahaan dan visi misi Mitra Daya Kreasi.</p>
            </header>
            <AboutManager />
          </div>
        )}

        {/* VIEW: PORTOFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="animate-in fade-in duration-300">
            <PortfolioManager />
          </div>
        )}

        {/* VIEW: PESAN MASUK */}
        {activeTab === 'messages' && (
          <div className="animate-in fade-in duration-300">
            <MessageManager onMessageRead={() => {
              setStats(prev => ({ ...prev, messages: Math.max(0, prev.messages - 1) }));
            }} />
          </div>
        )}

      </main>
    </div>
  );
}