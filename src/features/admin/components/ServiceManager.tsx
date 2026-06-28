import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Service } from '../../../types';
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
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);
  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false);

  async function fetchServices() {
    try {
      setLoading(true);
      const res = await serviceService.getServices();
      setServices(res.data);
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    </div>
  );
}
