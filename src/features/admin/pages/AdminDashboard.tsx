import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary-600 mb-10">Arch Admin</h1>
          
          <nav className="space-y-4">
            <a href="#" className="flex items-center gap-3 text-neutral-900 font-medium">
              <LayoutDashboard size={20} /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 text-neutral-600 hover:text-primary-600 transition-colors">
              <Users size={20} /> Users
            </a>
            <a href="#" className="flex items-center gap-3 text-neutral-600 hover:text-primary-600 transition-colors">
              <FileText size={20} /> Projects
            </a>
            <a href="#" className="flex items-center gap-3 text-neutral-600 hover:text-primary-600 transition-colors">
              <Settings size={20} /> Settings
            </a>
          </nav>
        </div>

        {/* Tombol Logout - Tambahkan kelas 'group' untuk mengaktifkan efek hover */}
        <button 
          onClick={handleLogout} 
          className="group flex items-center gap-3 text-red-600 font-medium hover:opacity-80 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <LogOut size={20} /> 
          <span className="relative">
            Logout
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h2>
          <p className="text-neutral-500">Selamat datang kembali, Admin!</p>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Total Projects', value: '142' },
            { title: 'Active Users', value: '89' },
            { title: 'Pending Inquiries', value: '12' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h3 className="text-neutral-500 text-sm mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}