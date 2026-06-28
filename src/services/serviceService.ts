import type { Service, WorkProcess, ApiResponse } from '../types';
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

const defaultProcesses: Omit<WorkProcess, 'id'>[] = [
  { title: '1. Konsultasi Awal', description: 'Diskusi mendalam mengenai visi, kebutuhan ruang, gaya yang diinginkan, dan alokasi anggaran Anda.', iconName: 'MessageSquare' },
  { title: '2. Konsep & Desain', description: 'Pembuatan sketsa awal, denah, hingga visualisasi 3D fotorealistik untuk persetujuan Anda.', iconName: 'PenTool' },
  { title: '3. Eksekusi & Konstruksi', description: 'Tim ahli kami mulai bekerja di lapangan dengan pengawasan ketat terhadap kualitas dan waktu.', iconName: 'HardHat' },
  { title: '4. Serah Terima', description: 'Finalisasi detail, pembersihan menyeluruh, dan penyerahan kunci ruang impian Anda.', iconName: 'Key' }
];

const mapProcessFromApi = (p: any): WorkProcess => {
  if (!p) return {} as WorkProcess;
  return {
    id: p.id,
    title: p.title || p.judul || '',
    description: p.description || p.deskripsi || '',
    iconName: p.iconName || p.icon_name || p.icon || ''
  };
};

const mapProcessToApi = (p: any) => {
  return {
    id: p.id,
    title: p.title,
    judul: p.title,
    description: p.description,
    deskripsi: p.description,
    iconName: p.iconName,
    icon_name: p.iconName,
    icon: p.iconName
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

      // Deduplicate locally and delete duplicate rows in the backend database
      const uniqueServices: Service[] = [];
      const titlesSeen = new Set<string>();

      for (const service of mappedList) {
        const normTitle = service.title.toLowerCase().trim();
        if (titlesSeen.has(normTitle)) {
          // Send delete request to backend to clean up the duplicated record
          try {
            await axiosClient.delete(`/api/services/${service.id}`);
            console.log(`Auto-cleaned duplicate service from database: ${service.title} (ID: ${service.id})`);
          } catch (delErr) {
            console.error(`Failed to auto-clean duplicate service: ${service.id}`, delErr);
          }
        } else {
          titlesSeen.add(normTitle);
          uniqueServices.push(service);
        }
      }

      // If database contains no unique services, seed defaults
      if (uniqueServices.length === 0) {
        const seededList: Service[] = [];
        for (const s of defaultServices) {
          try {
            const apiPayload = mapServiceToApi(s);
            const res = await axiosClient.post('/api/services', apiPayload);
            const resData = res.data?.data || res.data;
            seededList.push(mapServiceFromApi(resData));
          } catch (postErr) {
            console.error("Failed to seed service to DB", postErr);
          }
        }
        return { data: seededList, message: 'Seeded successfully', status: 200 };
      }

      // Verify and seed only missing default services
      const seededList = [...uniqueServices];
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
      return { data: uniqueServices, message: 'Success', status: 200 };
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
  },

  getWorkProcesses: async (): Promise<ApiResponse<WorkProcess[]>> => {
    try {
      const response = await axiosClient.get('/api/services/processes');
      const resVal = response.data?.data !== undefined ? response.data.data : response.data;
      
      let rawList: any[] = [];
      if (Array.isArray(resVal)) {
        rawList = resVal;
      } else if (resVal && typeof resVal === 'object') {
        rawList = [resVal];
      }
      
      const mappedList = rawList.map(mapProcessFromApi);

      // Deduplicate locally and delete duplicate rows in the backend database
      const uniqueProcesses: WorkProcess[] = [];
      const titlesSeen = new Set<string>();

      for (const p of mappedList) {
        const normTitle = p.title.toLowerCase().trim();
        if (titlesSeen.has(normTitle)) {
          try {
            await axiosClient.delete(`/api/services/processes/${p.id}`);
            console.log(`Auto-cleaned duplicate process from database: ${p.title} (ID: ${p.id})`);
          } catch (delErr) {
            console.error(`Failed to auto-clean duplicate process: ${p.id}`, delErr);
          }
        } else {
          titlesSeen.add(normTitle);
          uniqueProcesses.push(p);
        }
      }

      // If database contains no unique processes, seed defaults
      if (uniqueProcesses.length === 0) {
        const seededList: WorkProcess[] = [];
        for (const s of defaultProcesses) {
          try {
            const apiPayload = mapProcessToApi(s);
            const res = await axiosClient.post('/api/services/processes', apiPayload);
            const resData = res.data?.data || res.data;
            seededList.push(mapProcessFromApi(resData));
          } catch (postErr) {
            console.error("Failed to seed process to DB", postErr);
          }
        }
        return { data: seededList, message: 'Seeded successfully', status: 200 };
      }

      // Verify and seed only missing default processes
      const seededList = [...uniqueProcesses];
      let needsSeed = false;
      
      for (const s of defaultProcesses) {
        const exists = seededList.some(existing => existing.title.toLowerCase().trim() === s.title.toLowerCase().trim());
        if (!exists) {
          needsSeed = true;
          try {
            const apiPayload = mapProcessToApi(s);
            const res = await axiosClient.post('/api/services/processes', apiPayload);
            const resData = res.data?.data || res.data;
            seededList.push(mapProcessFromApi(resData));
          } catch (postErr) {
            console.error("Failed to seed process to DB", postErr);
          }
        }
      }

      if (needsSeed) {
        return { data: seededList, message: 'Seeded successfully', status: 200 };
      }
      return { data: uniqueProcesses, message: 'Success', status: 200 };
    } catch (e) {
      console.warn("API empty, seeding default processes...", e);
      try {
        const seededList: WorkProcess[] = [];
        for (const s of defaultProcesses) {
          const apiPayload = mapProcessToApi(s);
          const res = await axiosClient.post('/api/services/processes', apiPayload);
          const resData = res.data?.data || res.data;
          seededList.push(mapProcessFromApi(resData));
        }
        return { data: seededList, message: 'Seeded fallback', status: 200 };
      } catch (err) {
        const fallbackList = defaultProcesses.map((s, idx) => ({ ...s, id: idx + 1 })) as WorkProcess[];
        return { data: fallbackList, message: 'Fallback list', status: 200 };
      }
    }
  },

  createWorkProcess: async (data: Omit<WorkProcess, 'id'>): Promise<ApiResponse<WorkProcess>> => {
    const apiPayload = mapProcessToApi(data);
    const response = await axiosClient.post('/api/services/processes', apiPayload);
    const resData = response.data?.data || response.data;
    return { data: mapProcessFromApi(resData), message: 'Success', status: 201 };
  },

  updateWorkProcess: async (id: number, data: WorkProcess): Promise<ApiResponse<WorkProcess>> => {
    const apiPayload = mapProcessToApi(data);
    const response = await axiosClient.put(`/api/services/processes/${id}`, apiPayload);
    const resData = response.data?.data || response.data;
    return { data: mapProcessFromApi(resData), message: 'Success', status: 200 };
  },

  deleteWorkProcess: async (id: number): Promise<ApiResponse<null>> => {
    await axiosClient.delete(`/api/services/processes/${id}`);
    return { data: null, message: 'Success', status: 200 };
  }
};
