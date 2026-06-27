import { useState, useEffect } from 'react';
import { Trash2, CheckCircle2, Download, Search, Mail, Phone, Calendar, Briefcase, ChevronRight, FileText } from 'lucide-react';
import { jobApplicationService } from '../../../services/jobApplicationService';
import type { JobApplication } from '../../../types';

export default function JobApplicationManager({ onAppRead }: { onAppRead?: () => void }) {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await jobApplicationService.getApplications();
      // Sort applications: unread first, then newest first
      const sorted = res.data.sort((a, b) => {
        if (a.isRead === b.isRead) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.isRead ? 1 : -1;
      });
      setApps(sorted);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await jobApplicationService.markAsRead(id);
      setApps(apps.map(app => app.id === id ? { ...app, isRead: true } : app));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, isRead: true });
      }
      if (onAppRead) onAppRead();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lamaran ini?')) return;
    try {
      await jobApplicationService.deleteApplication(id);
      setApps(apps.filter(app => app.id !== id));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full font-sans">
      {/* Left Column: Applications List */}
      <div className="w-full lg:w-1/2 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-neutral-900">Berkas Lamaran Masuk</h3>
            <p className="text-sm text-neutral-500">Total {filteredApps.length} berkas lamaran</p>
          </div>
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Cari pelamar / posisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-neutral-50 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">Tidak ada lamaran ditemukan.</div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  setSelectedApp(app);
                  if (!app.isRead) handleMarkAsRead(app.id);
                }}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between items-center group ${
                  selectedApp?.id === app.id
                    ? 'bg-primary-50/50 border-primary-500 shadow-sm'
                    : 'bg-neutral-50 border-neutral-100 hover:bg-neutral-100/60'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-900">{app.name}</span>
                    {!app.isRead && (
                      <span className="bg-primary-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Baru
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                    <span className="text-primary-600 font-semibold">{app.jobTitle}</span>
                    <span>•</span>
                    <span>{new Date(app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Application Details */}
      <div className="w-full lg:w-1/2">
        {selectedApp ? (
          <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-start gap-4 pb-6 border-b border-neutral-100">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900">{selectedApp.name}</h3>
                <div className="flex items-center gap-2 text-primary-600 font-semibold mt-1">
                  <Briefcase size={16} />
                  <span>{selectedApp.jobTitle}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(selectedApp.id)}
                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Hapus Lamaran"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl text-sm border border-neutral-200/40">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-neutral-400 flex-shrink-0" />
                <a href={`mailto:${selectedApp.email}`} className="text-neutral-700 hover:text-primary-600 transition-colors font-medium break-all">{selectedApp.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-neutral-400 flex-shrink-0" />
                <a href={`tel:${selectedApp.phone}`} className="text-neutral-700 hover:text-primary-600 transition-colors font-medium">{selectedApp.phone}</a>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2 border-t border-neutral-200/50 pt-2.5 mt-1">
                <Calendar size={16} className="text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-500">Terkirim pada {new Date(selectedApp.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* CV Attachment */}
            {selectedApp.cvFileData ? (
              <div className="p-4 bg-primary-50/30 border border-primary-100 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-neutral-800 line-clamp-1">{selectedApp.cvFileName || 'CV_Pelamar.pdf'}</h5>
                    <span className="text-xs text-neutral-500 font-medium">Dokumen Lamaran</span>
                  </div>
                </div>
                <a
                  href={selectedApp.cvFileData}
                  download={selectedApp.cvFileName || 'CV_Pelamar.pdf'}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-sm"
                >
                  <Download size={14} /> Unduh CV
                </a>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-yellow-800 text-sm flex items-center gap-2">
                ⚠️ CV tidak diunggah atau berkas rusak.
              </div>
            )}

            {/* Cover Letter */}
            <div>
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Surat Lamaran / Cover Letter</h4>
              <div className="p-6 bg-neutral-50/70 border border-neutral-200/40 rounded-xl text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap italic">
                "{selectedApp.coverLetter}"
              </div>
            </div>

            {/* Mark read info */}
            {selectedApp.isRead && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 justify-end">
                <CheckCircle2 size={14} /> Lamaran telah ditinjau
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-neutral-200 shadow-sm text-center text-neutral-400 flex flex-col items-center justify-center h-full min-h-[300px]">
            <Briefcase size={40} className="text-neutral-300 mb-3" />
            <p className="font-semibold text-neutral-500">Detail Lamaran Kerja</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">Pilih pelamar kerja di daftar sebelah kiri untuk melihat detail cv, kontak, dan surat lamarannya.</p>
          </div>
        )}
      </div>
    </div>
  );
}
