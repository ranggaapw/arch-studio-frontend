import type { AboutInfo, ApiResponse } from '../types';
import axiosClient from '../features/client/api/axiosClient';

const defaultAboutInfo: AboutInfo = {
  id: 1,
  description: 'Workshop Furniture Mitra Daya Kreasi adalah produsen dan manufaktur furniture custom terkemuka yang berbasis di Bogor. Kami percaya bahwa setiap ruang memiliki cerita dan potensi untuk menginspirasi. Dengan pendekatan desain yang inovatif dan berpusat pada manusia, kami menciptakan furniture yang tidak hanya indah secara estetika, tetapi juga fungsional, rapi, dan kokoh.',
  mission: 'Menciptakan desain inovatif yang meningkatkan kualitas hidup melalui perpaduan estetika, fungsi, dan keberlanjutan.',
  vision: 'Menjadi biro arsitektur terdepan di Asia Tenggara yang dikenal karena keunggulan desain dan komitmen terhadap lingkungan.',
  imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
};

export const aboutService = {
  getAboutInfo: async (): Promise<ApiResponse<AboutInfo>> => {
    try {
      const response = await axiosClient.get<ApiResponse<AboutInfo>>('/api/about');
      if (!response.data || !response.data.data || !response.data.data.description) {
        // Seed to DB if empty
        const seedRes = await axiosClient.put<ApiResponse<AboutInfo>>('/api/about', defaultAboutInfo);
        return seedRes.data;
      }
      // Auto-migrate legacy brand names
      const d = response.data.data;
      if (d.description?.includes('Arch Studio') || d.mission?.includes('Arch Studio') || d.vision?.includes('Arch Studio')) {
        d.description = d.description?.replace(/Arch Studio/g, 'Mitra Daya Kreasi');
        d.mission = d.mission?.replace(/Arch Studio/g, 'Mitra Daya Kreasi');
        d.vision = d.vision?.replace(/Arch Studio/g, 'Mitra Daya Kreasi');
        // Save back to DB
        await axiosClient.put('/api/about', d);
      }
      return response.data;
    } catch (e) {
      console.warn("API empty, seeding default about details...", e);
      try {
        const seedRes = await axiosClient.put<ApiResponse<AboutInfo>>('/api/about', defaultAboutInfo);
        return seedRes.data;
      } catch (err) {
        return { data: defaultAboutInfo, message: 'Fallback', status: 200 };
      }
    }
  },

  updateAboutInfo: async (data: AboutInfo): Promise<ApiResponse<AboutInfo>> => {
    const response = await axiosClient.put<ApiResponse<AboutInfo>>('/api/about', data);
    return response.data;
  }
};
