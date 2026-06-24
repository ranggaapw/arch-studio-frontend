import type { Service, ApiResponse } from '../types';
// import axiosClient from '../features/client/api/axiosClient';

const defaultMockServices: Service[] = [
  { id: 1, title: 'Desain Arsitektur', description: 'Perencanaan dan desain bangunan komersial maupun residensial dengan fokus pada fungsi dan estetika.', iconName: 'Building2' },
  { id: 2, title: 'Desain Interior', description: 'Menciptakan ruang dalam yang nyaman, ergonomis, dan mencerminkan kepribadian atau identitas brand Anda.', iconName: 'Sofa' },
  { id: 3, title: 'Manajemen Konstruksi', description: 'Pengawasan dan pengelolaan proyek konstruksi untuk memastikan standar kualitas dan ketepatan waktu.', iconName: 'HardHat' },
  { id: 4, title: 'Konsultasi Masterplan', description: 'Perencanaan kawasan skala besar untuk pengembangan residensial, resort, atau fasilitas publik.', iconName: 'Map' },
];

const getMockServices = (): Service[] => {
  const stored = localStorage.getItem('mockServices');
  return stored ? JSON.parse(stored) : defaultMockServices;
};

const saveMockServices = (data: Service[]) => {
  localStorage.setItem('mockServices', JSON.stringify(data));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const serviceService = {
  getServices: async (): Promise<ApiResponse<Service[]>> => {
    // const response = await axiosClient.get<ApiResponse<Service[]>>('/api/services');
    // return response.data;
    await delay(500);
    return { data: getMockServices(), message: 'Success', status: 200 };
  },

  createService: async (data: Omit<Service, 'id'>): Promise<ApiResponse<Service>> => {
    // const response = await axiosClient.post<ApiResponse<Service>>('/api/services', data);
    // return response.data;
    await delay(500);
    const newService = { ...data, id: Date.now() };
    const current = getMockServices();
    current.push(newService);
    saveMockServices(current);
    return { data: newService, message: 'Created successfully', status: 201 };
  },

  updateService: async (id: number, data: Service): Promise<ApiResponse<Service>> => {
    // const response = await axiosClient.put<ApiResponse<Service>>(`/api/services/${id}`, data);
    // return response.data;
    await delay(500);
    const updated = getMockServices().map(s => s.id === id ? data : s);
    saveMockServices(updated);
    return { data, message: 'Updated successfully', status: 200 };
  },

  deleteService: async (id: number): Promise<ApiResponse<null>> => {
    // const response = await axiosClient.delete<ApiResponse<null>>(`/api/services/${id}`);
    // return response.data;
    await delay(500);
    const filtered = getMockServices().filter(s => s.id !== id);
    saveMockServices(filtered);
    return { data: null, message: 'Deleted successfully', status: 200 };
  }
};
