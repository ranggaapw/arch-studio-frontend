import type { JobApplication, ApiResponse } from '../types';

const defaultMockApplications: JobApplication[] = [
  {
    id: 1,
    jobTitle: 'Tukang Kayu / Woodworker Senior',
    name: 'Supriadi',
    email: 'supriadi.kayu@gmail.com',
    phone: '0812-3456-7890',
    cvFileName: 'CV_Supriadi_Woodworker.pdf',
    cvFileData: 'data:application/pdf;base64,JVBERi0xLjQK...', // mock base64
    coverLetter: 'Saya memiliki pengalaman 5 tahun bekerja di industri permebelan dan pembuatan lemari dapur. Saya ahli menggunakan gergaji sirkular, router, dan pengeleman presisi.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: false
  },
  {
    id: 2,
    jobTitle: 'Drafter & Estimator Furniture',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@outlook.com',
    phone: '0857-9876-5432',
    cvFileName: 'CV_Dewi_Drafter.pdf',
    cvFileData: 'data:application/pdf;base64,JVBERi0xLjQK...', // mock base64
    coverLetter: 'Dengan latar belakang D3 Desain Interior, saya menguasai AutoCAD, SketchUp, dan pembuatan Rencana Anggaran Biaya untuk furniture custom perumahan.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: true
  }
];

const getMockApplications = (): JobApplication[] => {
  const stored = localStorage.getItem('mockJobApplications');
  if (stored) {
    try {
      return JSON.parse(stored) as JobApplication[];
    } catch (e) {
      console.error('Failed to parse mock job applications', e);
    }
  }
  // If not in localstorage, save defaults
  localStorage.setItem('mockJobApplications', JSON.stringify(defaultMockApplications));
  return defaultMockApplications;
};

const saveMockApplications = (data: JobApplication[]) => {
  localStorage.setItem('mockJobApplications', JSON.stringify(data));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const jobApplicationService = {
  getApplications: async (): Promise<ApiResponse<JobApplication[]>> => {
    await delay(400);
    return { data: getMockApplications(), message: 'Success', status: 200 };
  },

  createApplication: async (data: Omit<JobApplication, 'id' | 'createdAt' | 'isRead'>): Promise<ApiResponse<JobApplication>> => {
    await delay(500);
    const newApp: JobApplication = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    const current = getMockApplications();
    current.push(newApp);
    saveMockApplications(current);
    return { data: newApp, message: 'Application submitted successfully', status: 201 };
  },

  deleteApplication: async (id: number): Promise<ApiResponse<null>> => {
    await delay(300);
    const filtered = getMockApplications().filter(app => app.id !== id);
    saveMockApplications(filtered);
    return { data: null, message: 'Deleted successfully', status: 200 };
  },

  markAsRead: async (id: number): Promise<ApiResponse<JobApplication>> => {
    await delay(300);
    const current = getMockApplications();
    let updatedApp: JobApplication | null = null;
    const updatedList = current.map(app => {
      if (app.id === id) {
        updatedApp = { ...app, isRead: true };
        return updatedApp;
      }
      return app;
    });
    if (updatedApp) {
      saveMockApplications(updatedList);
      return { data: updatedApp, message: 'Marked as read', status: 200 };
    }
    throw new Error('Application not found');
  }
};
