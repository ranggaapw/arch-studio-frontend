import { useState } from 'react';
import type { AhpRequestType } from '../../../types';
import { Sliders, Sparkles } from 'lucide-react';

interface AhpComparisonFormProps {
  onSubmit: (payload: AhpRequestType) => void;
  isPending: boolean;
}

export default function AhpComparisonForm({ onSubmit, isPending }: AhpComparisonFormProps) {
  // State sliders range dari -8 sampai 8 (default 0 = sama penting)
  const [bahanVsBudget, setBahanVsBudget] = useState<number>(0);
  const [bahanVsKategori, setBahanVsKategori] = useState<number>(0);
  const [budgetVsKategori, setBudgetVsKategori] = useState<number>(0);

  // Konversi nilai slider (-8 s/d 8) ke skala Saaty (9 s/d 1 s/d 1/9)
  const sliderToAhpValue = (val: number): number => {
    if (val === 0) return 1.0;
    if (val < 0) {
      // Nilai negatif berarti kriteria kiri lebih penting
      // -1 -> 2, -2 -> 3, ..., -8 -> 9
      return Math.abs(val) + 1;
    } else {
      // Nilai positif berarti kriteria kanan lebih penting
      // 1 -> 1/2, 2 -> 1/3, ..., 8 -> 1/9
      return 1.0 / (val + 1);
    }
  };

  const getComparisonLabel = (val: number, leftLabel: string, rightLabel: string) => {
    if (val === 0) {
      return (
        <span className="text-neutral-500 font-semibold bg-neutral-100 px-3 py-1 rounded-full text-xs">
          {leftLabel} &amp; {rightLabel} Sama Penting
        </span>
      );
    }
    if (val < 0) {
      const scale = Math.abs(val) + 1;
      return (
        <span className="text-primary-700 font-semibold bg-primary-50 px-3 py-1 rounded-full text-xs border border-primary-100">
          {leftLabel} Lebih Penting (Skala {scale})
        </span>
      );
    } else {
      const scale = val + 1;
      return (
        <span className="text-amber-700 font-semibold bg-amber-50 px-3 py-1 rounded-full text-xs border border-amber-100">
          {rightLabel} Lebih Penting (Skala {scale})
        </span>
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: AhpRequestType = {
      bahanVsBudget: sliderToAhpValue(bahanVsBudget),
      bahanVsKategori: sliderToAhpValue(bahanVsKategori),
      budgetVsKategori: sliderToAhpValue(budgetVsKategori),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-arch-lg border border-neutral-100 flex flex-col gap-8 h-full">
      <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
        <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600 flex-shrink-0">
          <Sliders size={20} />
        </div>
        <div>
          <h2 className="text-h5-bold text-neutral-900 leading-tight">Preferensi Kriteria</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Tentukan perbandingan tingkat kepentingan kriteria Anda</p>
        </div>
      </div>

      <div className="flex flex-col gap-8 flex-grow">
        {/* SLIDER 1: Bahan vs Budget */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-neutral-700">Bahan &amp; Material</span>
            <span className="font-bold text-neutral-700">Budget Proyek</span>
          </div>
          
          <div className="relative pt-1">
            <input
              type="range"
              min="-8"
              max="8"
              step="1"
              value={bahanVsBudget}
              onChange={(e) => setBahanVsBudget(Number(e.target.value))}
              disabled={isPending}
              className="w-full h-2.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-bold px-1 mt-1.5 select-none">
              <span>9 (Bahan Utama)</span>
              <span>1 (Sama)</span>
              <span>9 (Budget Utama)</span>
            </div>
          </div>

          <div className="flex justify-center mt-1">
            {getComparisonLabel(bahanVsBudget, "Bahan", "Budget")}
          </div>
        </div>

        {/* SLIDER 2: Bahan vs Kategori */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-neutral-700">Bahan &amp; Material</span>
            <span className="font-bold text-neutral-700">Kategori Desain</span>
          </div>

          <div className="relative pt-1">
            <input
              type="range"
              min="-8"
              max="8"
              step="1"
              value={bahanVsKategori}
              onChange={(e) => setBahanVsKategori(Number(e.target.value))}
              disabled={isPending}
              className="w-full h-2.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-bold px-1 mt-1.5 select-none">
              <span>9 (Bahan Utama)</span>
              <span>1 (Sama)</span>
              <span>9 (Kategori Utama)</span>
            </div>
          </div>

          <div className="flex justify-center mt-1">
            {getComparisonLabel(bahanVsKategori, "Bahan", "Kategori")}
          </div>
        </div>

        {/* SLIDER 3: Budget vs Kategori */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-neutral-700">Budget Proyek</span>
            <span className="font-bold text-neutral-700">Kategori Desain</span>
          </div>

          <div className="relative pt-1">
            <input
              type="range"
              min="-8"
              max="8"
              step="1"
              value={budgetVsKategori}
              onChange={(e) => setBudgetVsKategori(Number(e.target.value))}
              disabled={isPending}
              className="w-full h-2.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-bold px-1 mt-1.5 select-none">
              <span>9 (Budget Utama)</span>
              <span>1 (Sama)</span>
              <span>9 (Kategori Utama)</span>
            </div>
          </div>

          <div className="flex justify-center mt-1">
            {getComparisonLabel(budgetVsKategori, "Budget", "Kategori")}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-body-md-bold transition-all duration-300 cursor-pointer shadow-md shadow-primary-600/10 active:scale-98 flex items-center justify-center gap-2 font-bold disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
      >
        {isPending ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Mengevaluasi Kriteria...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Cari Desain Terbaik
          </>
        )}
      </button>
    </form>
  );
}
