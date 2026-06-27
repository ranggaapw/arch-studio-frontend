import type { Project, ApiResponse } from '../types';
import axiosClient from '../features/client/api/axiosClient';

const defaultProjects: Omit<Project, 'id'>[] = [
  { 
    title: 'Modern Minimalist House', 
    description: 'Desain rumah arsitektur minimalis yang memaksimalkan sirkulasi cahaya alami dan fungsionalitas ruang di pusat perkotaan padat. Menggunakan tata ruang terbuka (open plan) untuk memberikan kesan lapang dan koneksi antar ruang yang harmonis.', 
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 
    isFeatured: true, 
    categories: ['minimalis modern'],
    materials: 'Beton Ekspos, Kaca Tempered, Kayu Jati Solid, Baja Hitam, Cat Anti-UV Premium',
    location: 'Jakarta Selatan, DKI Jakarta',
    year: 2024,
    clientName: 'Bapak Ronald Sitorus',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800'
    ]
  },
  { 
    title: 'Urban Coffee Shop', 
    description: 'Renovasi interior kedai kopi modern bergaya industrial kontemporer. Memanfaatkan ekspos struktur dinding semen kasar, material besi hollow, dan aksen kayu pinus hangat untuk menciptakan suasana nyaman, santai, dan estetik bagi para pengunjung.', 
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', 
    isFeatured: true, 
    categories: ['industrial'],
    materials: 'Besi Hollow Hitam, Semen Kamprot, Bata Merah Ekspos, Kayu Pinus Vernis, Lampu Edison Filamen',
    location: 'Dago, Bandung',
    year: 2023,
    clientName: 'Kopi Nemu Group',
    galleryImages: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800'
    ]
  },
  { 
    title: 'Luxury Villa Bali', 
    description: 'Desain villa peristirahatan tropis modern yang terintegrasi langsung dengan keindahan alam sekitarnya. Dilengkapi infinity pool luas dengan dek kayu ulin berkualitas tinggi, dinding batu paras Jogja yang elegan, serta sirkulasi udara silang maksimal.', 
    imageUrl: 'https://images.unsplash.com/photo-1613490908578-83141f6cb65f?w=800', 
    isFeatured: true, 
    categories: ['rumah tropis modern'],
    materials: 'Batu Paras Jogja, Kayu Ulin Kalimantan, Atap Alang-alang Premium, Kaca Frameless Tempered, Lantai Teraso',
    location: 'Ubud, Bali',
    year: 2025,
    clientName: 'Mrs. Sarah Jenkins',
    galleryImages: [
      'https://images.unsplash.com/photo-1613490908578-83141f6cb65f?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'
    ]
  },
];

const mapProjectFromApi = (apiProj: any): Project => {
  if (!apiProj) return {} as Project;
  return {
    id: apiProj.id,
    title: apiProj.judul || apiProj.title || '',
    description: apiProj.deskripsi || apiProj.description || '',
    imageUrl: apiProj.image_url || apiProj.imageUrl || '',
    isFeatured: apiProj.is_recommended !== undefined ? apiProj.is_recommended : (apiProj.isFeatured !== undefined ? apiProj.isFeatured : false),
    categories: apiProj.categories || [],
    materials: apiProj.materials || '',
    location: apiProj.location || '',
    year: apiProj.year || 2024,
    clientName: apiProj.clientName || '',
    galleryImages: apiProj.galleryImages || []
  };
};

const mapProjectToApi = (p: any) => {
  return {
    id: p.id,
    judul: p.title,
    deskripsi: p.description,
    image_url: p.imageUrl,
    is_recommended: p.isFeatured,
    categories: p.categories || [],
    materials: p.materials || '',
    location: p.location || '',
    year: p.year || 2024,
    clientName: p.clientName || '',
    galleryImages: p.galleryImages || []
  };
};

export const projectService = {
  getProjects: async (): Promise<ApiResponse<Project[]>> => {
    try {
      const response = await axiosClient.get('/api/projects');
      const rawList = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      
      if (rawList.length === 0) {
        console.log("Seeding default projects to DB...");
        const seededList: Project[] = [];
        for (const p of defaultProjects) {
          const apiPayload = mapProjectToApi(p);
          const res = await axiosClient.post('/api/projects', apiPayload);
          const resData = res.data?.data || res.data;
          seededList.push(mapProjectFromApi(resData));
        }
        return { data: seededList, message: 'Seeded successfully', status: 200 };
      }
      
      const mappedList = rawList.map(mapProjectFromApi);
      return { data: mappedList, message: 'Success', status: 200 };
    } catch (e) {
      console.warn("API empty, seeding default projects...", e);
      try {
        const seededList: Project[] = [];
        for (const p of defaultProjects) {
          const apiPayload = mapProjectToApi(p);
          const res = await axiosClient.post('/api/projects', apiPayload);
          const resData = res.data?.data || res.data;
          seededList.push(mapProjectFromApi(resData));
        }
        return { data: seededList, message: 'Seeded fallback', status: 200 };
      } catch (err) {
        const fallbackList = defaultProjects.map((p, idx) => ({ ...p, id: idx + 1 }));
        return { data: fallbackList, message: 'Fallback list', status: 200 };
      }
    }
  },

  createProject: async (data: Omit<Project, 'id'>): Promise<ApiResponse<Project>> => {
    const apiPayload = mapProjectToApi(data);
    const response = await axiosClient.post('/api/projects', apiPayload);
    const resData = response.data?.data || response.data;
    return { data: mapProjectFromApi(resData), message: 'Created successfully', status: 201 };
  },

  updateProject: async (id: number, data: Project): Promise<ApiResponse<Project>> => {
    const apiPayload = mapProjectToApi(data);
    const response = await axiosClient.put(`/api/projects/${id}`, apiPayload);
    const resData = response.data?.data || response.data;
    return { data: mapProjectFromApi(resData), message: 'Updated successfully', status: 200 };
  },

  deleteProject: async (id: number): Promise<ApiResponse<null>> => {
    await axiosClient.delete(`/api/projects/${id}`);
    return { data: null, message: 'Deleted successfully', status: 200 };
  }
};
