import { useState, useEffect } from "react";
import { Save, Plus, X } from "lucide-react";
import type { HeroBanner, Project } from "../../../types";
import { homeService } from "../../../services/homeService";
import { projectService } from "../../../services/projectService";
import ServiceManager from "./ServiceManager";

const AVAILABLE_CATEGORIES = [
  "rumah tropis modern",
  "minimalis modern",
  "klasik",
  "industrial",
];

export default function HeroBannerManager() {
  const [banner, setBanner] = useState<HeroBanner | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(
    null,
  );
  const [selectedProjectDetail, setSelectedProjectDetail] =
    useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, projectsRes] = await Promise.all([
          homeService.getHeroBanner(),
          projectService.getProjects(),
        ]);

        const bannerData = { ...bannerRes.data };
        if (!bannerData.description) {
          bannerData.description =
            "Mitra Daya Kreasi (MDK) adalah workshop pembuatan furniture custom, desainer interior, sekaligus kontraktor terpercaya. Kami menghadirkan kualitas rancangan arsitektur dan interior modern dengan presisi pengerjaan terbaik untuk mewujudkan ruang impian Anda.";
        }
        if (!bannerData.backgroundImageUrl) {
          bannerData.backgroundImageUrl =
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920";
        }

        setBanner(bannerData);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
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
    setMessage("");
    try {
      // Save Hero Banner
      const res = await homeService.updateHeroBanner(banner);
      setBanner(res.data);

      // Save New or Updated Project if form is open and has title
      if (editingProject && editingProject.title) {
        if ("id" in editingProject && editingProject.id) {
          // Update
          const projRes = await projectService.updateProject(
            editingProject.id,
            editingProject as Project,
          );
          setProjects((prev) =>
            prev.map((p) => (p.id === editingProject.id ? projRes.data : p)),
          );
        } else {
          // Create
          const projRes = await projectService.createProject(
            editingProject as Omit<Project, "id">,
          );
          setProjects((prev) => [...prev, projRes.data]);
        }
        setEditingProject(null); // Close the form after successful save
      }

      setMessage("Semua perubahan berhasil disimpan!");
    } catch (error) {
      console.error("Failed to update", error);
      setMessage("Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus desain ini?")) return;
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete project", error);
      alert("Gagal menghapus desain.");
    }
  };

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingProject) {
          setEditingProject({
            ...editingProject,
            imageUrl: reader.result as string,
          });
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
          if (typeof reader.result === "string") {
            newImages.push(reader.result);
          }
          loadedCount++;
          if (loadedCount === files.length) {
            setEditingProject({
              ...editingProject,
              galleryImages: [...currentImages, ...newImages],
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
      setProjects(
        projects.map((p) => (p.id === project.id ? updatedProject : p)),
      );
    } catch (error) {
      console.error("Failed to update project feature status", error);
      alert("Gagal mengupdate status desain terbaik.");
    }
  };

  const handleAddProject = () => {
    setEditingProject({
      title: "",
      description: "",
      imageUrl: "",
      categories: [],
      materials: "",
      location: "",
      clientName: "",
      galleryImages: [],
    });
  };

  const handleCancelEditing = () => {
    setEditingProject(null);
  };

  if (loading)
    return (
      <div className="text-neutral-500 animate-pulse">Loading data...</div>
    );
  if (!banner) return <div className="text-red-500">Failed to load data.</div>;

  return (
    <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {message}
        </div>
      )}
      <form id="hero-banner-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Subtitle (Small text)
            </label>
            <input
              type="text"
              required
              value={banner.subtitle}
              onChange={(e) =>
                setBanner({ ...banner, subtitle: e.target.value })
              }
              className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Main Title
            </label>
            <input
              type="text"
              required
              value={banner.title}
              onChange={(e) => setBanner({ ...banner, title: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={banner.description}
              onChange={(e) =>
                setBanner({ ...banner, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Background Image (URL atau Upload File)
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                required
                value={banner.backgroundImageUrl}
                onChange={(e) =>
                  setBanner({ ...banner, backgroundImageUrl: e.target.value })
                }
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
                <img
                  src={banner.backgroundImageUrl}
                  alt="Preview"
                  className="h-32 object-cover rounded-xl border border-neutral-200"
                />
              </div>
            )}
          </div>
        </div>
      </form>

      {/* --- KELOLA LAYANAN KAMI --- */}
      <div className="mt-12 pt-12 border-t border-neutral-200">
        <ServiceManager />
      </div>

      <div className="mt-16 pt-16 border-t border-neutral-200">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-neutral-900">
              Kelola Portofolio
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              Fokus ke CRUD proyek. Penentuan desain terbaik sekarang otomatis
              lewat AHP.
            </p>
          </div>
          {!editingProject && (
            <button
              type="button"
              onClick={handleAddProject}
              className="px-4 py-2 bg-primary-900 text-white rounded-lg flex items-center gap-2 hover:bg-primary-800 transition-colors cursor-pointer"
            >
              <Plus size={18} /> Tambah Desain
            </button>
          )}
        </div>

        {editingProject && (
          <div className="mb-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h4 className="text-lg font-bold text-neutral-900">
                  {editingProject.id ? "Edit Desain" : "Tambah Desain Baru"}
                </h4>
                <p className="text-sm text-neutral-500 mt-1">
                  Isi data proyek, lalu simpan untuk menambah atau memperbarui
                  portofolio.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancelEditing}
                className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-white transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Judul Desain
                </label>
                <input
                  type="text"
                  value={editingProject.title || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                  placeholder="Masukkan judul proyek"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Kategori Desain
                </label>
                <select
                  value={editingProject.categories?.[0] || ""}
                  onChange={(e) => {
                    setEditingProject({
                      ...editingProject,
                      categories: e.target.value ? [e.target.value] : [],
                    });
                  }}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                >
                  <option value="">Pilih kategori</option>
                  {AVAILABLE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500 mt-2">
                  Pilih satu kategori yang paling sesuai.
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  rows={4}
                  value={editingProject.description || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none resize-y"
                  placeholder="Jelaskan detail proyek"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Image URL / Upload
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={editingProject.imageUrl || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        imageUrl: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                    placeholder="https://..."
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProjectImageUpload}
                    className="w-full md:max-w-xs px-2 py-2 bg-white rounded-xl border border-neutral-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
                {editingProject.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={editingProject.imageUrl}
                      alt="Preview"
                      className="h-28 w-full object-cover rounded-xl border border-neutral-200"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nama Klien
                </label>
                <input
                  type="text"
                  value={editingProject.clientName || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      clientName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                  placeholder="Nama klien"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={editingProject.location || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                  placeholder="Lokasi proyek"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tahun
                </label>
                <input
                  type="number"
                  value={editingProject.year || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      year: Number(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                  placeholder="2024"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bahan &amp; Material
                </label>
                <input
                  type="text"
                  value={editingProject.materials || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      materials: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                  placeholder="Kayu Jati, Kaca Tempered, Beton Ekspos"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="submit"
                form="hero-banner-form"
                className="px-5 py-3 bg-primary-900 text-white rounded-xl font-semibold hover:bg-primary-800 transition-colors cursor-pointer"
              >
                {editingProject.id ? "Simpan Perubahan" : "Tambah Desain"}
              </button>
              <button
                type="button"
                onClick={handleCancelEditing}
                className="px-5 py-3 bg-white border border-neutral-200 rounded-xl font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Tutup Form
              </button>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="p-8 text-center bg-neutral-50 rounded-xl text-neutral-500 border border-neutral-200">
            Belum ada data proyek. Silakan tambahkan proyek di menu Portofolio
            terlebih dahulu.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col bg-white rounded-xl border border-neutral-200 transition-colors hover:border-neutral-300"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-neutral-100">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-neutral-900 line-clamp-1 mb-1">
                      {project.title}
                    </h4>

                    {project.categories && project.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.categories.map((cat) => (
                          <span
                            key={cat}
                            className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded capitalize"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-neutral-500 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-neutral-100 pt-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedProjectDetail(project)}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors cursor-pointer"
                    >
                      Detail
                    </button>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingProject(project)}
                        className="text-xs font-semibold text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
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
          <Save size={20} />{" "}
          {saving ? "Menyimpan Perubahan..." : "Simpan Semua Perubahan"}
        </button>
      </div>

      {/* --- DETAIL MODAL --- */}
      {selectedProjectDetail && (
        <div className="fixed inset-0 bg-neutral-950/70 flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProjectDetail(null)}
              className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
              title="Tutup"
            >
              <X size={20} />
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block mb-1">
                  Detail Desain
                </span>
                <h3 className="text-2xl font-bold text-neutral-900">
                  {selectedProjectDetail.title}
                </h3>
              </div>

              {selectedProjectDetail.imageUrl && (
                <div className="w-full h-64 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-50">
                  <img
                    src={selectedProjectDetail.imageUrl}
                    alt={selectedProjectDetail.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/50">
                <div>
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Klien
                  </span>
                  <span className="text-sm font-semibold text-neutral-700">
                    {selectedProjectDetail.clientName || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Lokasi
                  </span>
                  <span className="text-sm font-semibold text-neutral-700">
                    {selectedProjectDetail.location || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Tahun
                  </span>
                  <span className="text-sm font-semibold text-neutral-700">
                    {selectedProjectDetail.year || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Kategori
                  </span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {selectedProjectDetail.categories?.map((cat) => (
                      <span
                        key={cat}
                        className="text-[10px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded border border-primary-200/30 capitalize font-medium"
                      >
                        {cat}
                      </span>
                    )) || "-"}
                  </div>
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Bahan &amp; Material
                </span>
                <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/40">
                  {selectedProjectDetail.materials || "-"}
                </p>
              </div>

              <div>
                <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Deskripsi Lengkap
                </span>
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                  {selectedProjectDetail.description || "Tidak ada deskripsi."}
                </p>
              </div>

              {selectedProjectDetail.galleryImages &&
                selectedProjectDetail.galleryImages.length > 0 && (
                  <div>
                    <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                      Galeri Proyek (
                      {selectedProjectDetail.galleryImages.length} Foto)
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {selectedProjectDetail.galleryImages.map(
                        (imgUrl, idx) => (
                          <div
                            key={idx}
                            className="aspect-4/3 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100"
                          >
                            <img
                              src={imgUrl}
                              alt={`Gallery ${idx}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(selectedProjectDetail);
                    setSelectedProjectDetail(null);
                  }}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Edit Proyek
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProjectDetail(null)}
                  className="px-6 py-2.5 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-bold text-neutral-600 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
