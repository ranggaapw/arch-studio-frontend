import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ArrowRight,
  X,
  Sparkles,
  Wallet,
  Gem,
  Tag,
  User,
  Calendar,
  MapPin,
  BrickWall,
  ChevronDown,
} from "lucide-react";
import { calculateAhp } from "../../../../services/ahpService";
import { projectService } from "../../../../services/projectService";
import type { Project, AhpRequestType, ProjectRank } from "../../../../types";

// ─── Pemetaan pilihan sederhana → nilai AHP desimal ──────────────────────────
type PriorityKey = "budget" | "bahan" | "kategori";

const PRIORITY_PRESETS: Record<PriorityKey, AhpRequestType> = {
  // Budget paling penting
  budget: { bahanVsBudget: 0.2, bahanVsKategori: 0.333, budgetVsKategori: 5.0 },
  // Kualitas Bahan paling penting
  bahan: { bahanVsBudget: 5.0, bahanVsKategori: 3.0, budgetVsKategori: 0.333 },
  // Kesesuaian Kategori paling penting
  kategori: {
    bahanVsBudget: 0.333,
    bahanVsKategori: 0.2,
    budgetVsKategori: 0.2,
  },
};

const PRIORITY_OPTIONS: {
  key: PriorityKey;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  gradient: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
}[] = [
  {
    key: "budget",
    label: "Hemat Budget",
    sublabel: "Tampilkan proyek dengan estimasi harga paling terjangkau",
    icon: <Wallet size={22} />,
    gradient: "from-emerald-500 to-teal-600",
    activeBg: "bg-emerald-50",
    activeBorder: "border-emerald-400 ring-2 ring-emerald-200",
    activeText: "text-emerald-700",
  },
  {
    key: "bahan",
    label: "Kualitas Bahan Premium",
    sublabel: "Tampilkan proyek dengan material kayu solid & bahan terbaik",
    icon: <Gem size={22} />,
    gradient: "from-primary-500 to-orange-600",
    activeBg: "bg-primary-50",
    activeBorder: "border-primary-400 ring-2 ring-primary-200",
    activeText: "text-primary-700",
  },
  {
    key: "kategori",
    label: "Kesesuaian Kategori",
    sublabel:
      "Tampilkan proyek yang paling relevan dengan kategori desain Anda",
    icon: <Tag size={22} />,
    gradient: "from-violet-500 to-purple-600",
    activeBg: "bg-violet-50",
    activeBorder: "border-violet-400 ring-2 ring-violet-200",
    activeText: "text-violet-700",
  },
];

// ─── Modal Detail Proyek ──────────────────────────────────────────────────────
function ProjectDetailModal({
  item,
  onClose,
}: {
  item: Project;
  onClose: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const modalImages =
    item.galleryImages && item.galleryImages.length > 0
      ? item.galleryImages
      : [item.imageUrl];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-neutral-950/80"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh] border border-neutral-100"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 bg-neutral-900/10 hover:bg-neutral-950/20 rounded-full z-50 cursor-pointer hover:scale-105 transition-all"
        >
          <X size={20} />
        </button>

        {/* Gallery */}
        <div className="w-full md:w-[60%] p-6 md:p-8 flex flex-col justify-between bg-neutral-50/50 border-r border-neutral-100 max-h-[50vh] md:max-h-full">
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-neutral-100 h-62.5 md:h-112.5 lg:h-125">
            <motion.img
              key={activeIdx}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              src={modalImages[activeIdx]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 select-none">
              <Sparkles size={11} className="text-primary-400" />
              Preview {activeIdx + 1} / {modalImages.length}
            </div>
          </div>
          {modalImages.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto scrollbar-hide py-1.5">
              {modalImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 cursor-pointer transition-all ${
                    activeIdx === idx
                      ? "ring-2 ring-primary-600 scale-105 opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="w-full md:w-[40%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-full">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {item.categories?.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-body-sm-bold uppercase tracking-wider"
                >
                  {cat}
                </span>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-5 leading-tight">
              {item.title}
            </h2>
            <div className="grid grid-cols-2 gap-4 border-y border-neutral-100 py-4 mb-5 text-sm text-neutral-600">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-neutral-50 rounded-lg text-primary-600">
                  <User size={15} />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase tracking-wider mb-0.5">
                    Klien
                  </span>
                  <span className="text-neutral-800 font-semibold">
                    {item.clientName || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-neutral-50 rounded-lg text-primary-600">
                  <Calendar size={15} />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase tracking-wider mb-0.5">
                    Tahun
                  </span>
                  <span className="text-neutral-800 font-semibold">
                    {item.year || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 col-span-2">
                <div className="p-1.5 bg-neutral-50 rounded-lg text-primary-600">
                  <MapPin size={15} />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase tracking-wider mb-0.5">
                    Lokasi
                  </span>
                  <span className="text-neutral-800 font-semibold">
                    {item.location || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-1.5 text-neutral-400 text-xs uppercase tracking-wider font-bold">
                <BrickWall size={14} /> Bahan &amp; Material
              </div>
              <p className="text-sm bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-neutral-800 leading-relaxed">
                {item.materials || "Spesifikasi material belum dicantumkan."}
              </p>
            </div>
            <div className="mb-6">
              <span className="text-neutral-400 text-xs uppercase tracking-wider font-bold block mb-1.5">
                Deskripsi Proyek
              </span>
              <p className="text-sm text-neutral-600 leading-relaxed max-h-40 overflow-y-auto pr-2">
                {item.description?.trim() ||
                  "Deskripsi belum tersedia untuk proyek ini."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all cursor-pointer hover:-translate-y-0.5"
          >
            Tutup Rincian Desain
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Kartu Proyek Hasil AHP ───────────────────────────────────────────────────
function ProjectRankCard({
  rankItem,
  index,
  onDetail,
}: {
  rankItem: ProjectRank;
  index: number;
  onDetail: (p: Project) => void;
}) {
  const item = rankItem.project;
  const isTop = index === 0;
  const scorePercent = (rankItem.score * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className={`relative bg-white rounded-2xl overflow-hidden flex flex-col sm:flex-row border transition-shadow duration-300 hover:shadow-arch-lg ${
        isTop
          ? "border-amber-200 ring-2 ring-amber-200/60 shadow-arch-sm"
          : "border-neutral-100 shadow-arch-sm"
      }`}
    >
      {isTop && (
        <div className="absolute top-3.5 left-3.5 z-10 bg-linear-to-r from-amber-400 via-yellow-400 to-amber-500 text-neutral-900 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-amber-300">
          <Award size={11} /> Rekomendasi Terbaik #1
        </div>
      )}

      {/* Thumbnail */}
      <div
        className={`w-full sm:w-50 h-40 sm:h-auto shrink-0 overflow-hidden ${isTop ? "sm:rounded-xl sm:m-2" : ""}`}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover select-none"
        />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col justify-between grow">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <span className="text-primary-600 text-[10px] font-bold uppercase tracking-wider">
              {item.categories?.join(" / ") || "Proyek"}
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-600 font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
              Skor {scorePercent}%
            </span>
          </div>
          <h4 className="font-bold text-neutral-900 text-base leading-snug mb-1.5">
            {item.title}
          </h4>
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {item.description?.trim() || "Deskripsi proyek belum tersedia."}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-[10px] text-neutral-400 font-semibold">
            Peringkat #{index + 1}
          </span>
          <button
            onClick={() => onDetail(item)}
            className="flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors group cursor-pointer"
          >
            Lihat Detail{" "}
            <ArrowRight
              size={13}
              className="ml-1 group-hover:ml-2 transition-all"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function BestDesignSection() {
  const [selected, setSelected] = useState<PriorityKey>("bahan");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch semua proyek saat mount untuk tampilan awal
  const { data: projectsResp } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getProjects(),
  });
  const allProjects = projectsResp?.data || [];

  // Mutasi AHP
  const {
    mutate,
    data: ahpResp,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: calculateAhp,
  });

  const rankings = ahpResp?.data?.rankings;

  // Jalankan AHP otomatis saat pertama kali proyek tersedia
  useEffect(() => {
    if (allProjects.length > 0 && !isSuccess && !isPending) {
      mutate(PRIORITY_PRESETS[selected]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProjects.length]);

  // Jalankan ulang saat pilihan berubah (setelah user memilih)
  const handleSelect = (key: PriorityKey) => {
    setSelected(key);
    mutate(PRIORITY_PRESETS[key]);
    setShowAll(false);
  };

  // Tampilkan hasil AHP atau fallback proyek semua
  const displayRankings: ProjectRank[] = rankings
    ? rankings
    : allProjects.map((p, i) => ({ project: p, score: 1 / (i + 1) }));

  const visibleRankings = showAll
    ? displayRankings
    : displayRankings.slice(0, 3);
  const activeOption = PRIORITY_OPTIONS.find((o) => o.key === selected)!;

  return (
    <section className="w-full bg-neutral-50 py-20 px-6 md:px-8 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full text-primary-600 mb-4 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} /> Rekomendasi Cerdas
            </div>
            <h2 className="text-3xl md:text-h3-bold text-neutral-900 leading-tight font-bold">
              Temukan Desain Terbaik <br className="hidden md:block" />
              untuk Anda
            </h2>
            <p className="text-neutral-400 mt-3 max-w-lg leading-relaxed text-sm">
              Pilih prioritas Anda — sistem kami akan otomatis mengurutkan
              proyek terbaik menggunakan metode AHP.
            </p>
          </div>

          {/* Status indicator saat loading */}
          {isPending && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 shadow-arch-sm">
              <svg
                className="animate-spin h-4 w-4 text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Mengevaluasi kriteria...
            </div>
          )}
        </div>

        {/* ── Choice Chips ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {PRIORITY_OPTIONS.map((opt) => {
            const isActive = selected === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                disabled={isPending}
                className={`group relative flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
                  ${
                    isActive
                      ? `${opt.activeBg} ${opt.activeBorder}`
                      : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-arch-sm"
                  }`}
              >
                {/* Radio dot */}
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "border-primary-600 bg-primary-600"
                      : "border-neutral-300"
                  }`}
                >
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                <div>
                  {/* Icon + Label */}
                  <div
                    className={`flex items-center gap-2 font-bold text-sm mb-1 ${isActive ? opt.activeText : "text-neutral-700"}`}
                  >
                    <span
                      className={`${isActive ? opt.activeText : "text-neutral-400"} transition-colors`}
                    >
                      {opt.icon}
                    </span>
                    {opt.label}
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {opt.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Active label strip ── */}
        <div
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6 ${activeOption.activeText}`}
        >
          <div
            className={`w-6 h-0.5 bg-linear-to-r ${activeOption.gradient}`}
          />
          Diurutkan berdasarkan: {activeOption.label}
          <div
            className={`grow h-0.5 bg-linear-to-r ${activeOption.gradient} opacity-20`}
          />
        </div>

        {/* ── Kartu Hasil ── */}
        <div className="flex flex-col gap-5">
          {/* Loading skeleton */}
          {isPending &&
            displayRankings.length === 0 &&
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-neutral-100 flex gap-5 items-center animate-pulse"
              >
                <div className="w-50 h-30 bg-neutral-100 rounded-xl shrink-0" />
                <div className="grow space-y-2">
                  <div className="h-3 w-1/4 bg-neutral-100 rounded" />
                  <div className="h-5 w-2/3 bg-neutral-100 rounded" />
                  <div className="h-3 w-3/4 bg-neutral-100 rounded" />
                </div>
              </div>
            ))}

          {/* Daftar terurut */}
          <AnimatePresence mode="wait">
            {visibleRankings.map((rankItem, index) => (
              <ProjectRankCard
                key={`${rankItem.project.id}-${index}`}
                rankItem={rankItem}
                index={index}
                onDetail={setSelectedProject}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* ── Show More / Less ── */}
        {displayRankings.length > 3 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-neutral-200 hover:border-primary-300 rounded-xl text-sm font-bold text-neutral-700 hover:text-primary-600 transition-all shadow-arch-sm cursor-pointer"
            >
              {showAll
                ? "Tampilkan Lebih Sedikit"
                : `Lihat Semua ${displayRankings.length} Proyek`}
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            item={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
