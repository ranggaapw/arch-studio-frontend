import type { JobOpening, ApiResponse } from '../types';

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const careerService = {
  getJobOpenings: async (): Promise<ApiResponse<JobOpening[]>> => {
    await delay(300);
    return { data: getMockJobOpenings(), message: 'Success', status: 200 };
  },

  createJobOpening: async (data: Omit<JobOpening, 'id'>): Promise<ApiResponse<JobOpening>> => {
    await delay(400);
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
    await delay(400);
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
    await delay(300);
    const filtered = getMockJobOpenings().filter(job => job.id !== id);
    saveMockJobOpenings(filtered);
    return { data: null, message: 'Deleted successfully', status: 200 };
  }
};
