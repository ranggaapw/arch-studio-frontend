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

export const careerService = {
  getJobOpenings: async (): Promise<ApiResponse<JobOpening[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<JobOpening[]>>('/api/jobs');
      if (!response.data || !response.data.data || response.data.data.length === 0) {
        console.log("Seeding default job openings to DB...");
        const seededList: JobOpening[] = [];
        for (const j of defaultJobOpenings) {
          const res = await axiosClient.post<ApiResponse<JobOpening>>('/api/jobs', j);
          seededList.push(res.data.data);
        }
        return { data: seededList, message: 'Seeded successfully', status: 200 };
      }
      return response.data;
    } catch (e) {
      console.warn("API empty, seeding default jobs...", e);
      try {
        const seededList: JobOpening[] = [];
        for (const j of defaultJobOpenings) {
          const res = await axiosClient.post<ApiResponse<JobOpening>>('/api/jobs', j);
          seededList.push(res.data.data);
        }
        return { data: seededList, message: 'Seeded fallback', status: 200 };
      } catch (err) {
        const fallbackList = defaultJobOpenings.map((j, idx) => ({ ...j, id: idx + 1 }));
        return { data: fallbackList, message: 'Fallback list', status: 200 };
      }
    }
  },

  createJobOpening: async (data: Omit<JobOpening, 'id'>): Promise<ApiResponse<JobOpening>> => {
    const response = await axiosClient.post<ApiResponse<JobOpening>>('/api/jobs', data);
    return response.data;
  },

  updateJobOpening: async (id: number, data: Omit<JobOpening, 'id'>): Promise<ApiResponse<JobOpening>> => {
    const response = await axiosClient.put<ApiResponse<JobOpening>>(`/api/jobs/${id}`, data);
    return response.data;
  },

  deleteJobOpening: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(`/api/jobs/${id}`);
    return response.data;
  },

  getCareerContent: async (): Promise<ApiResponse<CareerPageContent>> => {
    try {
      const response = await axiosClient.get<ApiResponse<CareerPageContent>>('/api/career/settings');
      if (!response.data || !response.data.data || !response.data.data.heroTitle) {
        // Seed database
        const seedRes = await axiosClient.put<ApiResponse<CareerPageContent>>('/api/career/settings', defaultCareerContent);
        return seedRes.data;
      }
      return response.data;
    } catch (e) {
      console.warn("API empty, seeding default career settings...", e);
      try {
        const seedRes = await axiosClient.put<ApiResponse<CareerPageContent>>('/api/career/settings', defaultCareerContent);
        return seedRes.data;
      } catch (err) {
        return { data: defaultCareerContent, message: 'Fallback', status: 200 };
      }
    }
  },

  updateCareerContent: async (data: CareerPageContent): Promise<ApiResponse<CareerPageContent>> => {
    const response = await axiosClient.put<ApiResponse<CareerPageContent>>('/api/career/settings', data);
    return response.data;
  }
};
