import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Clock, Briefcase, Loader2 } from 'lucide-react';
import { careerService } from '../../../services/careerService';
import type { JobOpening } from '../../../types';

export default function CareerManager() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<JobOpening | Partial<JobOpening> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await careerService.getJobOpenings();
      setJobs(res.data);
    } catch (error) {
      console.error('Failed to fetch job openings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    setSaving(true);
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
      console.error('Failed to save job opening', error);
      alert('Gagal menyimpan lowongan pekerjaan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lowongan pekerjaan ini?')) return;
    try {
      await careerService.deleteJobOpening(id);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (error) {
      console.error('Failed to delete job opening', error);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Kelola Lowongan Karir</h2>
          <p className="text-neutral-500">Tambah, ubah, atau hapus posisi pekerjaan yang ditawarkan.</p>
        </div>
        <button
          onClick={() => setEditingJob({ title: '', type: 'Full-Time', loc: 'Bogor, ID', desc: '' })}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} /> Tambah Lowongan
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-neutral-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-400">
          <Briefcase className="mx-auto text-neutral-300 mb-3" size={40} />
          <p className="font-semibold text-neutral-500">Belum ada lowongan pekerjaan.</p>
          <p className="text-xs text-neutral-400 mt-1">Klik tombol di atas untuk memposting posisi kerja baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{job.title}</h3>
                <div className="flex gap-4 text-xs text-neutral-500 font-medium mb-4">
                  <span className="bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200/60">{job.type}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {job.loc}</span>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-6">
                  {job.desc}
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4 mt-2">
                <button
                  onClick={() => setEditingJob(job)}
                  className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                  title="Ubah Lowongan"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Lowongan"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-neutral-950/70 flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl relative border border-neutral-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditingJob(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block mb-1">Manajemen Karir</span>
                <h3 className="text-2xl font-bold text-neutral-900">
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
                  disabled={saving}
                  className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors disabled:opacity-75 cursor-pointer min-w-[140px]"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
