import type { Service, ApiResponse } from '../types';
import axiosClient from '../features/client/api/axiosClient';

const defaultServices: Omit<Service, 'id'>[] = [
  { title: 'Desain Arsitektur', description: 'Perencanaan dan desain bangunan komersial maupun residensial dengan fokus pada fungsi dan estetika.', iconName: 'Building2' },
  { title: 'Desain Interior', description: 'Menciptakan ruang dalam yang nyaman, ergonomis, dan mencerminkan kepribadian atau identitas brand Anda.', iconName: 'Sofa' },
  { title: 'Manajemen Konstruksi', description: 'Pengawasan dan pengelolaan proyek konstruksi untuk memastikan standar kualitas dan ketepatan waktu.', iconName: 'HardHat' },
  { title: 'Konsultasi Masterplan', description: 'Perencanaan kawasan skala besar untuk pengembangan residensial, resort, atau fasilitas publik.', iconName: 'Map' },
];

const mapServiceFromApi = (s: any): Service => {
  if (!s) return {} as Service;
  return {
    id: s.id,
    title: s.title || s.judul || '',
    description: s.description || s.deskripsi || '',
    iconName: s.iconName || s.icon_name || s.icon || '',
    imageUrl: s.imageUrl || s.image_url || ''
  };
};

const mapServiceToApi = (s: any) => {
  return {
    id: s.id,
    title: s.title,
    judul: s.title,
    description: s.description,
    deskripsi: s.description,
    iconName: s.iconName,
    icon_name: s.iconName,
    icon: s.iconName,
    imageUrl: s.imageUrl,
    image_url: s.imageUrl
  };
};

export const serviceService = {
  getServices: async (): Promise<ApiResponse<Service[]>> => {
    try {
      const response = await axiosClient.get('/api/services');
      const resVal = response.data?.data !== undefined ? response.data.data : response.data;
      
      let rawList: any[] = [];
      if (Array.isArray(resVal)) {
        rawList = resVal;
      } else if (resVal && typeof resVal === 'object') {
        rawList = [resVal];
      }
      
      const mappedList = rawList.map(mapServiceFromApi);

      // Verify and seed only missing default services
      const seededList = [...mappedList];
      let needsSeed = false;
      
      for (const s of defaultServices) {
        const exists = seededList.some(existing => existing.title.toLowerCase().trim() === s.title.toLowerCase().trim());
        if (!exists) {
          needsSeed = true;
          try {
            const apiPayload = mapServiceToApi(s);
            const res = await axiosClient.post('/api/services', apiPayload);
            const resData = res.data?.data || res.data;
            seededList.push(mapServiceFromApi(resData));
          } catch (postErr) {
            console.error("Failed to seed service to DB", postErr);
          }
        }
      }

      if (needsSeed) {
        return { data: seededList, message: 'Seeded successfully', status: 200 };
      }
      return { data: mappedList, message: 'Success', status: 200 };
    } catch (e) {
      console.warn("API empty, seeding default services...", e);
      try {
        const seededList: Service[] = [];
        for (const s of defaultServices) {
          const apiPayload = mapServiceToApi(s);
          const res = await axiosClient.post('/api/services', apiPayload);
          const resData = res.data?.data || res.data;
          seededList.push(mapServiceFromApi(resData));
        }
        return { data: seededList, message: 'Seeded fallback', status: 200 };
      } catch (err) {
        const fallbackList = defaultServices.map((s, idx) => ({ ...s, id: idx + 1 })) as Service[];
        return { data: fallbackList, message: 'Fallback list', status: 200 };
      }
    }
  },

  createService: async (data: Omit<Service, 'id'>): Promise<ApiResponse<Service>> => {
    const apiPayload = mapServiceToApi(data);
    const response = await axiosClient.post('/api/services', apiPayload);
    const resData = response.data?.data || response.data;
    return { data: mapServiceFromApi(resData), message: 'Success', status: 201 };
  },

  updateService: async (id: number, data: Service): Promise<ApiResponse<Service>> => {
    const apiPayload = mapServiceToApi(data);
    const response = await axiosClient.put(`/api/services/${id}`, apiPayload);
    const resData = response.data?.data || response.data;
    return { data: mapServiceFromApi(resData), message: 'Success', status: 200 };
  },

  deleteService: async (id: number): Promise<ApiResponse<null>> => {
    await axiosClient.delete(`/api/services/${id}`);
    return { data: null, message: 'Success', status: 200 };
  }
};
