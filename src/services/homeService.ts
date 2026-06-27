import type { HeroBanner, ApiResponse } from '../types';
import axiosClient from '../features/client/api/axiosClient';

const defaultHeroBanner: HeroBanner = {
  id: 1,
  title: 'Eksplorasi Ruang dan Estetika Bersama Mitra Daya Kreasi',
  subtitle: 'Wujudkan Desain Impian',
  description: 'Dari arsitektur modern hingga interior tropis, kami membawa visi Anda menjadi kenyataan dengan sentuhan profesional yang tak lekang oleh waktu.',
  backgroundImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920'
};

export const homeService = {
  getHeroBanner: async (): Promise<ApiResponse<HeroBanner>> => {
    try {
      const response = await axiosClient.get<ApiResponse<HeroBanner>>('/api/home/banner');
      if (!response.data || !response.data.data || !response.data.data.title) {
        // Seed to DB if empty
        const seedRes = await axiosClient.put<ApiResponse<HeroBanner>>('/api/home/banner', defaultHeroBanner);
        return seedRes.data;
      }
      return response.data;
    } catch (e) {
      console.warn("API empty, seeding default banner...", e);
      try {
        const seedRes = await axiosClient.put<ApiResponse<HeroBanner>>('/api/home/banner', defaultHeroBanner);
        return seedRes.data;
      } catch (err) {
        return { data: defaultHeroBanner, message: 'Fallback', status: 200 };
      }
    }
  },

  updateHeroBanner: async (data: HeroBanner): Promise<ApiResponse<HeroBanner>> => {
    const response = await axiosClient.put<ApiResponse<HeroBanner>>('/api/home/banner', data);
    return response.data;
  }
};
