import type { Project, ApiResponse } from '../types';
import axiosClient from '../features/client/api/axiosClient';

const defaultProjects: Omit<Project, 'id'>[] = [
  { 
    title: 'Modern Minimalist House', 
    description: 'Desain rumah arsitektur minimalis yang memaksimalkan sirkulasi cahaya alami dan fungsionalitas ruang di pusat perkotaan padat. Menggunakan tata ruang terbuka (open plan) untuk memberikan kesan lapang dan koneksi antar ruang yang harmonis.', 
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 
    isFeatured: true, 
    categories: ['minimalis modern'],
    materials: 'Beton Ekspos, Kaca Tempered, Kayu Jati Solid, Baja Hitam, Cat Anti-UV Premium',
    location: 'Jakarta Selatan, DKI Jakarta',
    year: 2024,
    clientName: 'Bapak Ronald Sitorus',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'
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
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
    ]
  },
  { 
    title: 'Luxury Villa Bali', 
    description: 'Desain villa peristirahatan tropis modern yang terintegrasi langsung dengan keindahan alam sekitarnya. Dilengkapi infinity pool luas dengan dek kayu ulin berkualitas tinggi, dinding batu paras Jogja yang elegan, serta sirkulasi udara silang maksimal.', 
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 
    isFeatured: true, 
    categories: ['rumah tropis modern'],
    materials: 'Batu Paras Jogja, Kayu Ulin Kalimantan, Atap Alang-alang Premium, Kaca Frameless Tempered, Lantai Teraso',
    location: 'Ubud, Bali',
    year: 2025,
    clientName: 'Mrs. Sarah Jenkins',
    galleryImages: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
    ]
  },
  { 
    title: 'Scandinavian Penthouse', 
    description: 'Penthouse elegan dengan desain interior khas Skandinavia yang mengutamakan kesederhanaan, kehangatan, dan efisiensi ruang. Menampilkan lantai kayu oak alami, furnitur minimalis fungsional, dan pencahayaan hangat.', 
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', 
    isFeatured: true, 
    categories: ['minimalis modern'],
    materials: 'Kayu Oak Putih, Kain Linen Premium, Baja Ringan Putih, Cat Eco-Friendly',
    location: 'Kemang, Jakarta Selatan',
    year: 2024,
    clientName: 'Ibu Natalia Wijaya',
    galleryImages: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ]
  },
  { 
    title: 'Classic European Residence', 
    description: 'Desain tempat tinggal bergaya klasik Eropa dengan pilar-pilar megah, molding dinding detail, dan dekorasi lampu kristal mewah. Menghadirkan atmosfer klasik yang anggun, berwibawa, dan tak lekang oleh waktu.', 
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 
    isFeatured: true, 
    categories: ['klasik'],
    materials: 'Marmer Carrara, Molding Gypsum Custom, Kuningan Asli, Kayu Mahoni Ukir, Cat Beludru Premium',
    location: 'Menteng, Jakarta Pusat',
    year: 2023,
    clientName: 'Bapak Haryanto Prabowo',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'
    ]
  }
];

const getValidImageUrl = (url?: string) => {
  if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800';
  const cleanUrl = url.trim();
  // Support Base64 data URIs
  if (cleanUrl.startsWith('data:image/')) {
    return cleanUrl;
  }
  // If it's not from Unsplash, fall back to our working Unsplash image to avoid broken remote paths in DB
  if (!cleanUrl.includes('unsplash.com')) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800';
  }
  return cleanUrl;
};

const mapProjectFromApi = (apiProj: any): Project => {
  if (!apiProj) return {} as Project;
  
  // Dynamic fallback category mapping if categories from DB is empty
  let fallbackCategories: string[] = [];
  const title = (apiProj.judul || apiProj.title || '').toLowerCase();
  if (title.includes('minimalist') || title.includes('penthouse')) {
    fallbackCategories = ['minimalis modern'];
  } else if (title.includes('coffee') || title.includes('shop') || title.includes('urban')) {
    fallbackCategories = ['industrial'];
  } else if (title.includes('villa') || title.includes('bali') || title.includes('tropis')) {
    fallbackCategories = ['rumah tropis modern'];
  } else if (title.includes('classic') || title.includes('europe') || title.includes('residence')) {
    fallbackCategories = ['klasik'];
  } else {
    fallbackCategories = ['minimalis modern'];
  }

  const rawImg = apiProj.image_url || apiProj.imageUrl;
  const primaryImg = getValidImageUrl(rawImg);

  let fallbackGallery = [primaryImg];
  if (title.includes('minimalist') || title.includes('penthouse') || title.includes('minimalis')) {
    fallbackGallery = [
      primaryImg,
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800'
    ];
  } else if (title.includes('coffee') || title.includes('shop') || title.includes('urban') || title.includes('industrial') || title.includes('workshop')) {
    fallbackGallery = [
      primaryImg,
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800'
    ];
  } else if (title.includes('villa') || title.includes('bali') || title.includes('tropis') || title.includes('bogor') || title.includes('house')) {
    fallbackGallery = [
      primaryImg,
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'
    ];
  } else if (title.includes('classic') || title.includes('europe') || title.includes('residence') || title.includes('klasik')) {
    fallbackGallery = [
      primaryImg,
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ];
  } else {
    fallbackGallery = [
      primaryImg,
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800'
    ];
  }

  let parsedGallery: any = null;
  if (typeof apiProj.galleryImages === 'string') {
    try {
      parsedGallery = JSON.parse(apiProj.galleryImages);
    } catch (e) {
      parsedGallery = null;
    }
  } else if (Array.isArray(apiProj.galleryImages)) {
    parsedGallery = apiProj.galleryImages;
  }

  const finalGallery = (Array.isArray(parsedGallery) && parsedGallery.length > 1)
    ? parsedGallery.map(getValidImageUrl)
    : fallbackGallery;

  return {
    id: apiProj.id,
    title: apiProj.judul || apiProj.title || '',
    description: apiProj.deskripsi || apiProj.description || '',
    imageUrl: primaryImg,
    isFeatured: apiProj.is_recommended !== undefined ? apiProj.is_recommended : (apiProj.isFeatured !== undefined ? apiProj.isFeatured : true),
    categories: apiProj.categories && apiProj.categories.length > 0 ? apiProj.categories : fallbackCategories,
    materials: apiProj.materials || 'Bahan kayu lapis premium, finishing melamine halus.',
    location: apiProj.location || 'Bogor, Jawa Barat',
    year: apiProj.year || 2024,
    clientName: apiProj.clientName || 'Mitra Daya Kreasi Client',
    galleryImages: finalGallery
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
      const resVal = response.data?.data !== undefined ? response.data.data : response.data;
      
      let rawList: any[] = [];
      if (Array.isArray(resVal)) {
        rawList = resVal;
      } else if (resVal && typeof resVal === 'object') {
        rawList = [resVal];
      }
      
      const mappedList = rawList.map(mapProjectFromApi);

      if (mappedList.length < 5) {
        console.log("Database contains less than 5 projects, seeding additional defaults...");
        const seededList = [...mappedList];
        
        for (let i = 0; i < defaultProjects.length; i++) {
          const defaultProj = defaultProjects[i];
          const exists = seededList.some(p => p.title.toLowerCase().trim() === defaultProj.title.toLowerCase().trim());
          if (exists) continue;

          try {
            const apiPayload = mapProjectToApi(defaultProj);
            const res = await axiosClient.post('/api/projects', apiPayload);
            const resData = res.data?.data || res.data;
            seededList.push(mapProjectFromApi(resData));
          } catch (postErr) {
            console.error("Failed to post seeded project", postErr);
            // Fallback locally
            seededList.push({
              ...defaultProj,
              id: Date.now() + i,
              imageUrl: getValidImageUrl(defaultProj.imageUrl),
              galleryImages: defaultProj.galleryImages ? defaultProj.galleryImages.map(getValidImageUrl) : [getValidImageUrl(defaultProj.imageUrl)]
            } as Project);
          }
        }
        return { data: seededList, message: 'Seeded up to 5 successfully', status: 200 };
      }
      
      return { data: mappedList, message: 'Success', status: 200 };
    } catch (e) {
      console.warn("API error, using full local fallback defaults...", e);
      const fallbackList = defaultProjects.map((p, idx) => ({
        ...p,
        id: idx + 1,
        imageUrl: getValidImageUrl(p.imageUrl),
        galleryImages: p.galleryImages ? p.galleryImages.map(getValidImageUrl) : [getValidImageUrl(p.imageUrl)]
      })) as Project[];
      return { data: fallbackList, message: 'Fallback list', status: 200 };
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
