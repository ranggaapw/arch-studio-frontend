import type { Project, ApiResponse } from '../types';
// import axiosClient from '../features/client/api/axiosClient';

const defaultMockProjects: Project[] = [
  { 
    id: 1, 
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
    id: 2, 
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
    id: 3, 
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

const getMockProjects = (): Project[] => {
  const stored = localStorage.getItem('mockProjects');
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Project[];
      let migrated = false;
      const updated = parsed.map(p => {
        const defaultProj = defaultMockProjects.find(d => d.id === p.id);
        if (defaultProj && (!p.categories || !p.materials || !p.galleryImages || !p.location || !p.year || !p.clientName)) {
          migrated = true;
          return {
            ...p,
            categories: p.categories || defaultProj.categories,
            materials: p.materials || defaultProj.materials,
            location: p.location || defaultProj.location,
            year: p.year || defaultProj.year,
            clientName: p.clientName || defaultProj.clientName,
            galleryImages: p.galleryImages || defaultProj.galleryImages,
            isFeatured: p.isFeatured !== undefined ? p.isFeatured : defaultProj.isFeatured
          };
        }
        return p;
      });
      if (migrated) {
        localStorage.setItem('mockProjects', JSON.stringify(updated));
      }
      return updated;
    } catch (e) {
      console.error('Failed to parse mock projects', e);
    }
  }
  return defaultMockProjects;
};

const saveMockProjects = (data: Project[]) => {
  localStorage.setItem('mockProjects', JSON.stringify(data));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  getProjects: async (): Promise<ApiResponse<Project[]>> => {
    // const response = await axiosClient.get<ApiResponse<Project[]>>('/api/projects');
    // return response.data;
    await delay(500);
    return { data: getMockProjects(), message: 'Success', status: 200 };
  },

  createProject: async (data: Omit<Project, 'id'>): Promise<ApiResponse<Project>> => {
    // const response = await axiosClient.post<ApiResponse<Project>>('/api/projects', data);
    // return response.data;
    await delay(500);
    const newProject = { ...data, id: Date.now() };
    const current = getMockProjects();
    current.push(newProject);
    saveMockProjects(current);
    return { data: newProject, message: 'Created successfully', status: 201 };
  },

  updateProject: async (id: number, data: Project): Promise<ApiResponse<Project>> => {
    // const response = await axiosClient.put<ApiResponse<Project>>(`/api/projects/${id}`, data);
    // return response.data;
    await delay(500);
    const updated = getMockProjects().map(p => p.id === id ? data : p);
    saveMockProjects(updated);
    return { data, message: 'Updated successfully', status: 200 };
  },

  deleteProject: async (id: number): Promise<ApiResponse<null>> => {
    // const response = await axiosClient.delete<ApiResponse<null>>(`/api/projects/${id}`);
    // return response.data;
    await delay(500);
    const filtered = getMockProjects().filter(p => p.id !== id);
    saveMockProjects(filtered);
    return { data: null, message: 'Deleted successfully', status: 200 };
  }
};
