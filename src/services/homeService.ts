import type { HeroBanner, ApiResponse } from '../types';
// import axiosClient from '../features/client/api/axiosClient';

// MOCK DATA SEMENTARA
const defaultMockHeroBanner: HeroBanner = {
  id: 1,
  title: 'Eksplorasi Ruang dan Estetika Bersama Mitra Daya Kreasi',
  subtitle: 'Wujudkan Desain Impian',
  description: 'Dari arsitektur modern hingga interior tropis, kami membawa visi Anda menjadi kenyataan dengan sentuhan profesional yang tak lekang oleh waktu.',
  backgroundImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920'
};

const getMockHeroBanner = (): HeroBanner => {
  const stored = localStorage.getItem('mockHeroBanner');
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as HeroBanner;
      if (parsed.title && parsed.title.includes('Arch Studio')) {
        parsed.title = parsed.title.replace('Arch Studio', 'Mitra Daya Kreasi');
        localStorage.setItem('mockHeroBanner', JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      console.error(e);
    }
  }
  return defaultMockHeroBanner;
};

const saveMockHeroBanner = (data: HeroBanner) => {
  localStorage.setItem('mockHeroBanner', JSON.stringify(data));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const homeService = {
  getHeroBanner: async (): Promise<ApiResponse<HeroBanner>> => {
    // KODE ASLI AXIOS (dikomentari sementara backend belum siap)
    // const response = await axiosClient.get<ApiResponse<HeroBanner>>('/api/home/banner');
    // return response.data;
    
    await delay(500);
    return { data: getMockHeroBanner(), message: 'Success', status: 200 };
  },

  updateHeroBanner: async (data: HeroBanner): Promise<ApiResponse<HeroBanner>> => {
    // const response = await axiosClient.put<ApiResponse<HeroBanner>>('/api/home/banner', data);
    // return response.data;

    await delay(500);
    const updated = { ...getMockHeroBanner(), ...data };
    saveMockHeroBanner(updated);
    return { data: updated, message: 'Updated successfully', status: 200 };
  }
};
