import type { AboutInfo, ApiResponse } from '../types';
// import axiosClient from '../features/client/api/axiosClient';

const defaultMockAboutInfo: AboutInfo = {
  id: 1,
  description: 'Arch Studio adalah biro arsitektur dan desain interior terkemuka yang berbasis di Jakarta. Kami percaya bahwa setiap ruang memiliki cerita dan potensi untuk menginspirasi. Dengan pendekatan desain yang inovatif dan berpusat pada manusia, kami menciptakan lingkungan yang tidak hanya indah secara estetika, tetapi juga fungsional dan berkelanjutan.',
  mission: 'Menciptakan desain inovatif yang meningkatkan kualitas hidup melalui perpaduan estetika, fungsi, dan keberlanjutan.',
  vision: 'Menjadi biro arsitektur terdepan di Asia Tenggara yang dikenal karena keunggulan desain dan komitmen terhadap lingkungan.',
  imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
};

const getMockAboutInfo = (): AboutInfo => {
  const stored = localStorage.getItem('mockAboutInfo');
  return stored ? JSON.parse(stored) : defaultMockAboutInfo;
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
