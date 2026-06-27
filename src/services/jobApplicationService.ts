import type { JobApplication, ApiResponse } from '../types';
import axiosClient from '../features/client/api/axiosClient';

const mapJobApplicationFromApi = (app: any): JobApplication => {
  if (!app) return {} as JobApplication;
  return {
    id: app.id,
    jobTitle: app.jobTitle || app.job_title || app.job || '',
    name: app.name || app.nama || '',
    email: app.email || '',
    phone: app.phone || app.phone_number || app.phone_no || app.no_telp || app.telp || '',
    cvFileName: app.cvFileName || app.cv_file_name || app.fileName || app.file_name || '',
    cvFileData: app.cvFileData || app.cv_file_data || app.fileData || app.file_data || '',
    coverLetter: app.coverLetter || app.cover_letter || app.message || app.pesan || '',
    createdAt: app.createdAt || app.created_at || new Date().toISOString(),
    isRead: app.isRead !== undefined ? app.isRead : (app.is_read !== undefined ? app.is_read : false)
  };
};

export const jobApplicationService = {
  getApplications: async (): Promise<ApiResponse<JobApplication[]>> => {
    try {
      const response = await axiosClient.get('/api/applications');
      const resVal = response.data?.data !== undefined ? response.data.data : response.data;
      
      let rawList: any[] = [];
      if (Array.isArray(resVal)) {
        rawList = resVal;
      } else if (resVal && typeof resVal === 'object') {
        rawList = [resVal];
      }

      const mappedList = rawList.map(mapJobApplicationFromApi);
      return { data: mappedList, message: 'Success', status: 200 };
    } catch (e) {
      console.error("Failed to fetch applications", e);
      return { data: [], message: 'Error', status: 500 };
    }
  },

  createApplication: async (data: Omit<JobApplication, 'id' | 'createdAt' | 'isRead'>): Promise<ApiResponse<JobApplication>> => {
    const payload = {
      ...data,
      jobTitle: data.jobTitle,
      job_title: data.jobTitle,
      name: data.name,
      nama: data.name,
      phone: data.phone,
      no_telp: data.phone,
      cvFileName: data.cvFileName,
      cv_file_name: data.cvFileName,
      cvFileData: data.cvFileData,
      cv_file_data: data.cvFileData,
      coverLetter: data.coverLetter,
      cover_letter: data.coverLetter
    };
    const response = await axiosClient.post('/api/applications', payload);
    const appData = response.data?.data || response.data;
    return { data: mapJobApplicationFromApi(appData), message: 'Success', status: 201 };
  },

  deleteApplication: async (id: number): Promise<ApiResponse<null>> => {
    await axiosClient.delete(`/api/applications/${id}`);
    return { data: null, message: 'Deleted successfully', status: 200 };
  },

  markAsRead: async (id: number): Promise<ApiResponse<JobApplication>> => {
    try {
      const response = await axiosClient.put(`/api/applications/${id}/read`);
      const appData = response.data?.data || response.data;
      return { data: mapJobApplicationFromApi(appData), message: 'Success', status: 200 };
    } catch (err) {
      const response = await axiosClient.patch(`/api/applications/${id}/read`);
      const appData = response.data?.data || response.data;
      return { data: mapJobApplicationFromApi(appData), message: 'Success', status: 200 };
    }
  }
};
