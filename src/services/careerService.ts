import type { JobOpening, CareerPageContent, ApiResponse } from '../types';
import axiosClient from '../features/client/api/axiosClient';

const defaultJobOpenings: Omit<JobOpening, 'id'>[] = [
  {
    title: 'Tukang Kayu / Woodworker Senior',
    type: 'Full-Time',
    loc: 'Bogor, ID',
    desc: 'Berpengalaman dalam pembuatan furniture custom minimalis dan klasik (Multiplex, HPL, Solid Wood).'
  },
  {
    title: 'Drafter & Estimator Furniture',
    type: 'Full-Time',
    loc: 'Bogor, ID',
    desc: 'Mampu memproses desain 3D menjadi gambar kerja CAD (2D) detail dan menyusun RAB produksi.'
  },
  {
    title: 'Helper Workshop / Finishing Operator',
    type: 'Full-Time',
    loc: 'Bogor, ID',
    desc: 'Membantu pengamplasan, pendempulan, dan aplikasi spray melamine/duco berkualitas tinggi.'
  },
  {
    title: 'Desainer Interior & 3D Visualizer',
    type: 'Full-Time',
    loc: 'Bogor, ID',
    desc: 'Membuat konsep layout interior dan memvisualisasikan rancangan furniture custom dalam bentuk 3D Render fotorealistik menggunakan SketchUp/Vray.'
  },
  {
    title: 'Quality Control (QC) & Supervisor Workshop',
    type: 'Full-Time',
    loc: 'Bogor, ID',
    desc: 'Mengawasi jalannya proses perakitan, memastikan kualitas finishing kayu sesuai standar, serta mengontrol ketepatan dimensi furniture sebelum kirim.'
  }
];

const defaultCareerContent: CareerPageContent = {
  heroTitle: 'Become Part of #MDKteam',
  heroSubtitle: 'Bergabung dan Menjadi Inovator',
  heroBgUrl: 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?auto=format&fit=crop&w=1600&q=80',
  potentials: [
    {
      title: 'Growth Opportunities',
      desc: 'Kesempatan belajar langsung dari pengrajin senior dan desainer interior profesional untuk meningkatkan keahlian Anda.',
      imgUrl: 'https://images.unsplash.com/photo-1531535934027-689615776d68?w=500'
    },
    {
      title: 'People First',
      desc: 'Lingkungan kerja kekeluargaan yang suportif, aman, dan saling menghargai kontribusi setiap anggota tim.',
      imgUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500'
    },
    {
      title: 'Inspiring Community',
      desc: 'Berkolaborasi bersama tim desainer kreatif dan produsen guna melahirkan produk furniture berkualitas tinggi.',
      imgUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500'
    }
  ],
  cultures: [
    {
      title: 'Teamwork',
      desc: 'Menyatukan keahlian desain dan presisi pengerjaan kayu guna menghadirkan kualitas produk furniture terbaik bagi klien.'
    },
    {
      title: 'Integrity',
      desc: 'Membangun kepercayaan melalui kejujuran bahan kayu asli, ketepatan waktu pengiriman, dan transparansi proses workshop.'
    },
    {
      title: 'Innovation',
      desc: 'Terus bereksperimen dengan metode perakitan modern, efisiensi bahan baku, serta detail konstruksi tahan lama.'
    }
  ]
};

const mapJobOpeningFromApi = (j: any): JobOpening => {
  if (!j) return {} as JobOpening;
  return {
    id: j.id,
    title: j.title || j.judul || j.jobTitle || '',
    type: j.type || j.tipe || j.jobType || '',
    loc: j.loc || j.lokasi || j.location || '',
    desc: j.desc || j.deskripsi || j.description || ''
  };
};

const mapJobOpeningToApi = (j: any) => {
  return {
    id: j.id,
    title: j.title,
    judul: j.title,
    jobTitle: j.title,
    type: j.type,
    tipe: j.type,
    jobType: j.type,
    loc: j.loc,
    lokasi: j.loc,
    location: j.loc,
    desc: j.desc,
    deskripsi: j.desc,
    description: j.desc
  };
};

export const careerService = {
  getJobOpenings: async (): Promise<ApiResponse<JobOpening[]>> => {
    try {
      const response = await axiosClient.get('/api/jobs');
      const resVal = response.data?.data !== undefined ? response.data.data : response.data;
      
      let rawList: any[] = [];
      if (Array.isArray(resVal)) {
        rawList = resVal;
      } else if (resVal && typeof resVal === 'object') {
        rawList = [resVal];
      }
      
      if (rawList.length === 0) {
        console.log("Seeding default job openings to DB...");
        const seededList: JobOpening[] = [];
        for (const j of defaultJobOpenings) {
          const apiPayload = mapJobOpeningToApi(j);
          const res = await axiosClient.post('/api/jobs', apiPayload);
          const resData = res.data?.data || res.data;
          seededList.push(mapJobOpeningFromApi(resData));
        }
        return { data: seededList, message: 'Seeded successfully', status: 200 };
      }
      
      const mappedList = rawList.map(mapJobOpeningFromApi);
      return { data: mappedList, message: 'Success', status: 200 };
    } catch (e) {
      console.warn("API empty, seeding default jobs...", e);
      try {
        const seededList: JobOpening[] = [];
        for (const j of defaultJobOpenings) {
          const apiPayload = mapJobOpeningToApi(j);
          const res = await axiosClient.post('/api/jobs', apiPayload);
          const resData = res.data?.data || res.data;
          seededList.push(mapJobOpeningFromApi(resData));
        }
        return { data: seededList, message: 'Seeded fallback', status: 200 };
      } catch (err) {
        const fallbackList = defaultJobOpenings.map((j, idx) => ({ ...j, id: idx + 1 }));
        return { data: fallbackList, message: 'Fallback list', status: 200 };
      }
    }
  },

  createJobOpening: async (data: Omit<JobOpening, 'id'>): Promise<ApiResponse<JobOpening>> => {
    const apiPayload = mapJobOpeningToApi(data);
    const response = await axiosClient.post('/api/jobs', apiPayload);
    const resData = response.data?.data || response.data;
    return { data: mapJobOpeningFromApi(resData), message: 'Created successfully', status: 201 };
  },

  updateJobOpening: async (id: number, data: Omit<JobOpening, 'id'>): Promise<ApiResponse<JobOpening>> => {
    const apiPayload = mapJobOpeningToApi(data);
    const response = await axiosClient.put(`/api/jobs/${id}`, apiPayload);
    const resData = response.data?.data || response.data;
    return { data: mapJobOpeningFromApi(resData), message: 'Updated successfully', status: 200 };
  },

  deleteJobOpening: async (id: number): Promise<ApiResponse<null>> => {
    await axiosClient.delete(`/api/jobs/${id}`);
    return { data: null, message: 'Deleted successfully', status: 200 };
  },

  getCareerContent: async (): Promise<ApiResponse<CareerPageContent>> => {
    try {
      const response = await axiosClient.get('/api/career/settings');
      const resData = response.data?.data || response.data;
      if (!resData || !resData.heroTitle) {
        // Seed database
        const seedRes = await axiosClient.put('/api/career/settings', defaultCareerContent);
        const seedData = seedRes.data?.data || seedRes.data;
        return { data: seedData, message: 'Seeded settings', status: 200 };
      }
      return { data: resData, message: 'Success', status: 200 };
    } catch (e) {
      console.warn("API empty, seeding default career settings...", e);
      try {
        const seedRes = await axiosClient.put('/api/career/settings', defaultCareerContent);
        const seedData = seedRes.data?.data || seedRes.data;
        return { data: seedData, message: 'Seeded fallback', status: 200 };
      } catch (err) {
        return { data: defaultCareerContent, message: 'Fallback', status: 200 };
      }
    }
  },

  updateCareerContent: async (data: CareerPageContent): Promise<ApiResponse<CareerPageContent>> => {
    const response = await axiosClient.put('/api/career/settings', data);
    const resData = response.data?.data || response.data;
    return { data: resData, message: 'Updated successfully', status: 200 };
  }
};
