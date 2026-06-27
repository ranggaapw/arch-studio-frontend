import type { AboutInfo, ApiResponse } from '../types';
// import axiosClient from '../features/client/api/axiosClient';

const defaultMockAboutInfo: AboutInfo = {
  id: 1,
  description: 'Workshop Furniture Mitra Daya Kreasi adalah produsen dan manufaktur furniture custom terkemuka yang berbasis di Bogor. Kami percaya bahwa setiap ruang memiliki cerita dan potensi untuk menginspirasi. Dengan pendekatan desain yang inovatif dan berpusat pada manusia, kami menciptakan furniture yang tidak hanya indah secara estetika, tetapi juga fungsional, rapi, dan kokoh.',
  mission: 'Menciptakan desain inovatif yang meningkatkan kualitas hidup melalui perpaduan estetika, fungsi, dan keberlanjutan.',
  vision: 'Menjadi biro arsitektur terdepan di Asia Tenggara yang dikenal karena keunggulan desain dan komitmen terhadap lingkungan.',
  imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
};

const getMockAboutInfo = (): AboutInfo => {
  const stored = localStorage.getItem('mockAboutInfo');
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as AboutInfo;
      if (parsed.description && parsed.description.includes('Arch Studio')) {
        parsed.description = parsed.description.replace(/Arch Studio/g, 'Workshop Furniture Mitra Daya Kreasi');
        localStorage.setItem('mockAboutInfo', JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      console.error(e);
    }
  }
  return defaultMockAboutInfo;
};

const saveMockAboutInfo = (data: AboutInfo) => {
  localStorage.setItem('mockAboutInfo', JSON.stringify(data));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const aboutService = {
  getAboutInfo: async (): Promise<ApiResponse<AboutInfo>> => {
    // const response = await axiosClient.get<ApiResponse<AboutInfo>>('/api/about');
    // return response.data;
    await delay(500);
    return { data: getMockAboutInfo(), message: 'Success', status: 200 };
  },

  updateAboutInfo: async (data: AboutInfo): Promise<ApiResponse<AboutInfo>> => {
    // const response = await axiosClient.put<ApiResponse<AboutInfo>>('/api/about', data);
    // return response.data;
    await delay(500);
    const updated = { ...getMockAboutInfo(), ...data };
    saveMockAboutInfo(updated);
    return { data: updated, message: 'Updated successfully', status: 200 };
  }
};
