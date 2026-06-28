import type { HeroBanner, ApiResponse } from '../types';
import axiosClient from '../features/client/api/axiosClient';

const defaultHeroBanner: HeroBanner = {
  id: 1,
  title: 'Eksplorasi Ruang dan Estetika Bersama Mitra Daya Kreasi',
  subtitle: 'Wujudkan Desain Impian',
  description: 'Dari arsitektur modern hingga interior tropis, kami membawa visi Anda menjadi kenyataan dengan sentuhan profesional yang tak lekang oleh waktu.',
  backgroundImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920'
};

const mapHeroBannerFromApi = (b: any): HeroBanner => {
  if (!b) return {} as HeroBanner;
  return {
    id: b.id,
    title: b.title || '',
    subtitle: b.subtitle || '',
    description: b.description || b.desc || b.deskripsi || 'Mitra Daya Kreasi (MDK) adalah workshop pembuatan furniture custom, desainer interior, sekaligus kontraktor terpercaya. Kami menghadirkan kualitas rancangan arsitektur dan interior modern dengan presisi pengerjaan terbaik untuk mewujudkan ruang impian Anda.',
    backgroundImageUrl: b.backgroundImageUrl || b.bgImageUrl || ''
  };
};

const mapHeroBannerToApi = (b: HeroBanner) => {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    description: b.description,
    desc: b.description,
    deskripsi: b.description,
    bgImageUrl: b.backgroundImageUrl,
    backgroundImageUrl: b.backgroundImageUrl
  };
};

export const homeService = {
  getHeroBanner: async (): Promise<ApiResponse<HeroBanner>> => {
    try {
      const response = await axiosClient.get<ApiResponse<any>>('/api/home/banner');
      const rawData = response.data?.data;
      if (!rawData || !rawData.title) {
        // Seed to DB if empty
        const seedRes = await axiosClient.put<ApiResponse<any>>('/api/home/banner', mapHeroBannerToApi(defaultHeroBanner));
        const seedData = seedRes.data?.data;
        return {
          ...seedRes.data,
          data: mapHeroBannerFromApi(seedData)
        };
      }
      return {
        ...response.data,
        data: mapHeroBannerFromApi(rawData)
      };
    } catch (e) {
      console.warn("API empty, seeding default banner...", e);
      try {
        const seedRes = await axiosClient.put<ApiResponse<any>>('/api/home/banner', mapHeroBannerToApi(defaultHeroBanner));
        const seedData = seedRes.data?.data;
        return {
          ...seedRes.data,
          data: mapHeroBannerFromApi(seedData)
        };
      } catch (err) {
        return { data: defaultHeroBanner, message: 'Fallback', status: 200 };
      }
    }
  },

  updateHeroBanner: async (data: HeroBanner): Promise<ApiResponse<HeroBanner>> => {
    const apiPayload = mapHeroBannerToApi(data);
    const response = await axiosClient.put<ApiResponse<any>>('/api/home/banner', apiPayload);
    const resData = response.data?.data;
    return {
      ...response.data,
      data: mapHeroBannerFromApi(resData)
    };
  }
};
