import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Service, WorkProcess } from '../../../types';
import { serviceService } from '../../../services/serviceService';

const availableIcons = [
  'Building2',
  'Sofa',
  'HardHat',
  'Map',
  'Home',
  'Briefcase',
  'PenTool',
  'PaintRoller',
  'Ruler',
  'Hammer',
  'Truck',
  'CheckCircle',
  'Wrench',
  'Scissors',
  'Users',
  'MessageSquare',
  'Key'
];

const IconRenderer = ({ name, className }: { name?: string, className?: string }) => {
  if (!name) return null;
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ElementType;
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [processes, setProcesses] = useState<WorkProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | Partial<Service> | null>(null);
  const [editingProcess, setEditingProcess] = useState<WorkProcess | Partial<WorkProcess> | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingProcess, setSavingProcess] = useState(false);
  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false);

  async function fetchServices() {
    try {
      setLoading(true);
      const [servicesRes, processesRes] = await Promise.all([
        serviceService.getServices(),
        serviceService.getWorkProcesses()
      ]);
      setServices(servicesRes.data);
      setProcesses(processesRes.data);
    } catch (error) {
      console.error('Failed to fetch services page data', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);



  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setSaving(true);
    try {
      if ('id' in editingService && editingService.id) {
        // Update
        const res = await serviceService.updateService(editingService.id, editingService as Service);
        setServices(services.map(s => s.id === res.data.id ? res.data : s));
      } else {
        // Create
        const res = await serviceService.createService(editingService as Omit<Service, 'id'>);
        setServices([...services, res.data]);
      }
      setEditingService(null);
    } catch (error) {
      console.error('Failed to save service', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await serviceService.deleteService(id);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete service', error);
    }
  };

  const handleSaveProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProcess) return;

    setSavingProcess(true);
    try {
      if ('id' in editingProcess && editingProcess.id) {
        // Update
        const res = await serviceService.updateWorkProcess(editingProcess.id, editingProcess as WorkProcess);
        setProcesses(processes.map(p => p.id === res.data.id ? res.data : p));
      } else {
        // Create
        const res = await serviceService.createWorkProcess(editingProcess as Omit<WorkProcess, 'id'>);
        setProcesses([...processes, res.data]);
      }
      setEditingProcess(null);
    } catch (error) {
      console.error('Failed to save process', error);
    } finally {
      setSavingProcess(false);
    }
  };

  const handleDeleteProcess = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus metode kerja ini?')) return;
    try {
      await serviceService.deleteWorkProcess(id);
      setProcesses(processes.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete process', error);
    }
  };

  if (loading && services.length === 0) return <div className="text-neutral-500 animate-pulse">Loading data...</div>;

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            {editingService ? (editingService.id ? 'Edit Layanan' : 'Tambah Layanan') : 'Kelola Layanan'}
          </h2>
          <p className="text-neutral-500">
            {editingService ? 'Silakan isi detail layanan di bawah ini.' : 'Daftar layanan furniture yang ditawarkan Mitra Daya Kreasi.'}
          </p>
        </div>
        {!editingService && (
          <button
            onClick={() => setEditingService({ title: '', description: '', iconName: '' })}
            className="px-4 py-2 bg-primary-900 text-white rounded-lg flex items-center gap-2 hover:bg-primary-800 transition-colors cursor-pointer"
          >
            <Plus size={18} /> Tambah Layanan
          </button>
        )}
      </header>

      {editingService ? (
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Icon Name (Lucide React)</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsIconDropdownOpen(!isIconDropdownOpen)}
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none flex justify-between items-center cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      {editingService.iconName ? (
                        <>
                          <IconRenderer name={editingService.iconName} className="w-5 h-5 text-primary-600" />
                          <span className="text-neutral-900">{editingService.iconName}</span>
                        </>
                      ) : (
                        <span className="text-neutral-400">-- Pilih Icon --</span>
                      )}
                    </span>
                    <ChevronDown size={20} className="text-neutral-400" />
                  </button>
                  
                  {isIconDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                        {availableIcons.map(icon => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => {
                              setEditingService({ ...editingService, iconName: icon });
                              setIsIconDropdownOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                              editingService.iconName === icon ? 'bg-primary-50 text-primary-700' : 'hover:bg-neutral-50 text-neutral-700'
                            }`}
                          >
                            <IconRenderer name={icon} className="w-5 h-5" />
                            <span>{icon}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
            <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-6 py-3 flex items-center gap-2 text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} /> Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 flex items-center gap-2 bg-primary-900 text-white font-medium hover:bg-primary-800 rounded-xl transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden w-full">
          {services.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">Belum ada layanan. Silakan tambah layanan.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-neutral-500">Service Info</th>
                  <th className="px-6 py-4 text-sm font-medium text-neutral-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900">{service.title}</p>
                      <p className="text-sm text-neutral-500 line-clamp-1">{service.description}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingService(service)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- SECTION METODE KERJA --- */}
      <div className="mt-16 pt-16 border-t border-neutral-200">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              {editingProcess ? (editingProcess.id ? 'Edit Metode Kerja' : 'Tambah Metode Kerja') : 'Kelola Metode Kerja'}
            </h2>
            <p className="text-neutral-500">
              {editingProcess ? 'Silakan isi detail metode kerja di bawah ini.' : 'Daftar metode kerja yang ditawarkan Mitra Daya Kreasi.'}
            </p>
          </div>
          {!editingProcess && (
            <button
              onClick={() => setEditingProcess({ title: '', description: '', iconName: '' })}
              className="px-4 py-2 bg-primary-900 text-white rounded-lg flex items-center gap-2 hover:bg-primary-800 transition-colors cursor-pointer"
            >
              <Plus size={18} /> Tambah Metode
            </button>
          )}
        </header>

        {editingProcess ? (
          <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
            <form onSubmit={handleSaveProcess} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Judul Metode</label>
                  <input
                    type="text"
                    required
                    value={editingProcess.title || ''}
                    onChange={(e) => setEditingProcess({ ...editingProcess, title: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                    placeholder="Contoh: 1. Konsultasi Awal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Deskripsi</label>
                  <textarea
                    required
                    rows={4}
                    value={editingProcess.description || ''}
                    onChange={(e) => setEditingProcess({ ...editingProcess, description: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none resize-y"
                    placeholder="Deskripsi singkat proses kerja..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Icon Name (Lucide React)</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsIconDropdownOpen(!isIconDropdownOpen)}
                      className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none flex justify-between items-center cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        {editingProcess.iconName ? (
                          <>
                            <IconRenderer name={editingProcess.iconName} className="w-5 h-5 text-primary-600" />
                            <span className="text-neutral-900">{editingProcess.iconName}</span>
                          </>
                        ) : (
                          <span className="text-neutral-400">-- Pilih Icon --</span>
                        )}
                      </span>
                      <ChevronDown size={20} className="text-neutral-400" />
                    </button>
                    
                    {isIconDropdownOpen && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                          {availableIcons.map(icon => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => {
                                setEditingProcess({ ...editingProcess, iconName: icon });
                                setIsIconDropdownOpen(false);
                              }}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                                editingProcess.iconName === icon ? 'bg-primary-50 text-primary-700' : 'hover:bg-neutral-50 text-neutral-700'
                              }`}
                            >
                              <IconRenderer name={icon} className="w-5 h-5" />
                              <span>{icon}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingProcess(null)}
                  className="px-6 py-3 flex items-center gap-2 text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} /> Batal
                </button>
                <button
                  type="submit"
                  disabled={savingProcess}
                  className="px-6 py-3 flex items-center gap-2 bg-primary-900 text-white font-medium hover:bg-primary-800 rounded-xl transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save size={20} /> {savingProcess ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden w-full">
            {processes.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">Belum ada metode kerja. Silakan tambah metode kerja.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-neutral-500">Metode Kerja</th>
                    <th className="px-6 py-4 text-sm font-medium text-neutral-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {processes.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-4">
                        {p.iconName && (
                          <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                            <IconRenderer name={p.iconName} className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-neutral-900">{p.title}</p>
                          <p className="text-sm text-neutral-500 line-clamp-1">{p.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingProcess(p)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
                          >
                            <Edit2 size={16} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProcess(p.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
