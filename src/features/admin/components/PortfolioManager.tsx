import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import type { Project } from '../../../types';
import { projectService } from '../../../services/projectService';

export default function PortfolioManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);

  async function fetchProjects() {
    try {
      setLoading(true);
      const res = await projectService.getProjects();
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSaving(true);
    try {
      if ('id' in editingProject && editingProject.id) {
        // Update
        const res = await projectService.updateProject(editingProject.id, editingProject as Project);
        setProjects(projects.map(p => p.id === res.data.id ? res.data : p));
      } else {
        // Create
        const res = await projectService.createProject(editingProject as Omit<Project, 'id'>);
        setProjects([...projects, res.data]);
      }
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to save project', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  };

  if (loading && projects.length === 0) return <div className="text-neutral-500 animate-pulse">Loading data...</div>;

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            {editingProject ? (editingProject.id ? 'Edit Portofolio' : 'Tambah Portofolio') : 'Kelola Portofolio'}
          </h2>
          <p className="text-neutral-500">
            {editingProject ? 'Ubah detail proyek.' : 'Daftar proyek yang tampil di halaman portofolio.'}
          </p>
        </div>
        {!editingProject && (
          <button
            onClick={() => setEditingProject({ title: '', description: '', imageUrl: '' })}
            className="px-4 py-2 bg-primary-900 text-white rounded-lg flex items-center gap-2 hover:bg-primary-800 transition-colors cursor-pointer"
          >
            <Plus size={18} /> Tambah Proyek
          </button>
        )}
      </header>

      {/* FORM EDIT PORTOFOLIO */}
      {editingProject ? (
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Image (URL atau Upload File)</label>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    required
                    value={editingProject.imageUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
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
                {editingProject.imageUrl && (
                  <div className="mt-4">
                    <img src={editingProject.imageUrl} alt="Preview" className="h-32 object-cover rounded-xl border border-neutral-200" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                  required
                  rows={8}
                  value={editingProject.description || ''}
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
                disabled={saving}
                className="px-6 py-3 flex items-center gap-2 bg-primary-900 text-white font-medium hover:bg-primary-800 rounded-xl transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* TABEL DATA PORTOFOLIO */
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden w-full">
          {projects.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">Belum ada proyek. Silakan tambah proyek.</div>
          ) : (
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
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
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
