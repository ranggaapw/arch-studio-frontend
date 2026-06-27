import type { JobOpening, CareerPageContent, ApiResponse } from '../types';

const defaultJobOpenings: JobOpening[] = [
  {
    id: 1,
    title: 'Tukang Kayu / Woodworker Senior',
    type: 'Full-Time',
    loc: 'Bogor, ID',
    desc: 'Berpengalaman dalam pembuatan furniture custom minimalis dan klasik (Multiplex, HPL, Solid Wood).'
  },
  {
    id: 2,
    title: 'Drafter & Estimator Furniture',
    type: 'Full-Time',
    loc: 'Bogor, ID',
    desc: 'Mampu memproses desain 3D menjadi gambar kerja CAD (2D) detail dan menyusun RAB produksi.'
  },
  {
    id: 3,
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

const getMockJobOpenings = (): JobOpening[] => {
  const stored = localStorage.getItem('mockJobOpenings');
  if (stored) {
    try {
      return JSON.parse(stored) as JobOpening[];
    } catch (e) {
      console.error('Failed to parse mock job openings', e);
    }
  }
  // If not in localstorage, save defaults
  localStorage.setItem('mockJobOpenings', JSON.stringify(defaultJobOpenings));
  return defaultJobOpenings;
};

const saveMockJobOpenings = (data: JobOpening[]) => {
  localStorage.setItem('mockJobOpenings', JSON.stringify(data));
};

const getMockCareerContent = (): CareerPageContent => {
  const stored = localStorage.getItem('mockCareerContent');
  if (stored) {
    try {
      return JSON.parse(stored) as CareerPageContent;
    } catch (e) {
      console.error('Failed to parse mock career content', e);
    }
  }
  localStorage.setItem('mockCareerContent', JSON.stringify(defaultCareerContent));
  return defaultCareerContent;
};

const saveMockCareerContent = (data: CareerPageContent) => {
  localStorage.setItem('mockCareerContent', JSON.stringify(data));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const careerService = {
  getJobOpenings: async (): Promise<ApiResponse<JobOpening[]>> => {
    await delay(200);
    return { data: getMockJobOpenings(), message: 'Success', status: 200 };
  },

  createJobOpening: async (data: Omit<JobOpening, 'id'>): Promise<ApiResponse<JobOpening>> => {
    await delay(300);
    const newJob: JobOpening = {
      ...data,
      id: Date.now()
    };
    const current = getMockJobOpenings();
    current.push(newJob);
    saveMockJobOpenings(current);
    return { data: newJob, message: 'Job opening posted successfully', status: 201 };
  },

  updateJobOpening: async (id: number, data: Omit<JobOpening, 'id'>): Promise<ApiResponse<JobOpening>> => {
    await delay(300);
    const current = getMockJobOpenings();
    let updatedJob: JobOpening | null = null;
    const updatedList = current.map(job => {
      if (job.id === id) {
        updatedJob = { ...job, ...data };
        return updatedJob;
      }
      return job;
    });
    if (updatedJob) {
      saveMockJobOpenings(updatedList);
      return { data: updatedJob, message: 'Job opening updated successfully', status: 200 };
    }
    throw new Error('Job opening not found');
  },

  deleteJobOpening: async (id: number): Promise<ApiResponse<null>> => {
    await delay(200);
    const filtered = getMockJobOpenings().filter(job => job.id !== id);
    saveMockJobOpenings(filtered);
    return { data: null, message: 'Deleted successfully', status: 200 };
  },

  getCareerContent: async (): Promise<ApiResponse<CareerPageContent>> => {
    await delay(200);
    return { data: getMockCareerContent(), message: 'Success', status: 200 };
  },

  updateCareerContent: async (data: CareerPageContent): Promise<ApiResponse<CareerPageContent>> => {
    await delay(300);
    saveMockCareerContent(data);
    return { data, message: 'Career page content updated successfully', status: 200 };
  }
};
