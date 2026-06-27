import type { Service, ApiResponse } from '../types';
import axiosClient from '../features/client/api/axiosClient';

const defaultServices: Omit<Service, 'id'>[] = [
  { title: 'Desain Arsitektur', description: 'Perencanaan dan desain bangunan komersial maupun residensial dengan fokus pada fungsi dan estetika.', iconName: 'Building2' },
  { title: 'Desain Interior', description: 'Menciptakan ruang dalam yang nyaman, ergonomis, dan mencerminkan kepribadian atau identitas brand Anda.', iconName: 'Sofa' },
  { title: 'Manajemen Konstruksi', description: 'Pengawasan dan pengelolaan proyek konstruksi untuk memastikan standar kualitas dan ketepatan waktu.', iconName: 'HardHat' },
  { title: 'Konsultasi Masterplan', description: 'Perencanaan kawasan skala besar untuk pengembangan residensial, resort, atau fasilitas publik.', iconName: 'Map' },
];

export const serviceService = {
  getServices: async (): Promise<ApiResponse<Service[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Service[]>>('/api/services');
      if (!response.data || !response.data.data || response.data.data.length === 0) {
        // Seed database
        console.log("Seeding default services to DB...");
        const seededList: Service[] = [];
        for (const s of defaultServices) {
          const res = await axiosClient.post<ApiResponse<Service>>('/api/services', s);
          seededList.push(res.data.data);
        }
        return { data: seededList, message: 'Seeded successfully', status: 200 };
      }
      return response.data;
    } catch (e) {
      console.warn("API empty, seeding default services...", e);
      try {
        const seededList: Service[] = [];
        for (const s of defaultServices) {
          const res = await axiosClient.post<ApiResponse<Service>>('/api/services', s);
          seededList.push(res.data.data);
        }
        return { data: seededList, message: 'Seeded fallback', status: 200 };
      } catch (err) {
        const fallbackList = defaultServices.map((s, idx) => ({ ...s, id: idx + 1 }));
        return { data: fallbackList, message: 'Fallback list', status: 200 };
      }
    }
  },

  createService: async (data: Omit<Service, 'id'>): Promise<ApiResponse<Service>> => {
    const response = await axiosClient.post<ApiResponse<Service>>('/api/services', data);
    return response.data;
  },

  updateService: async (id: number, data: Service): Promise<ApiResponse<Service>> => {
    const response = await axiosClient.put<ApiResponse<Service>>(`/api/services/${id}`, data);
    return response.data;
  },

  deleteService: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(`/api/services/${id}`);
    return response.data;
  }
};
