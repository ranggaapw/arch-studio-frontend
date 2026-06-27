import type { JobApplication, ApiResponse } from '../types';
import axiosClient from '../features/client/api/axiosClient';

export const jobApplicationService = {
  getApplications: async (): Promise<ApiResponse<JobApplication[]>> => {
    try {
      const response = await axiosClient.get('/api/applications');
      const arrayData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      return { data: arrayData, message: 'Success', status: 200 };
    } catch (e) {
      console.error("Failed to fetch applications", e);
      return { data: [], message: 'Error', status: 500 };
    }
  },

  createApplication: async (data: Omit<JobApplication, 'id' | 'createdAt' | 'isRead'>): Promise<ApiResponse<JobApplication>> => {
    const response = await axiosClient.post('/api/applications', data);
    const appData = response.data?.data || response.data;
    return { data: appData, message: 'Success', status: 201 };
  },

  deleteApplication: async (id: number): Promise<ApiResponse<null>> => {
    await axiosClient.delete(`/api/applications/${id}`);
    return { data: null, message: 'Deleted successfully', status: 200 };
  },

  markAsRead: async (id: number): Promise<ApiResponse<JobApplication>> => {
    try {
      const response = await axiosClient.put(`/api/applications/${id}/read`);
      const appData = response.data?.data || response.data;
      return { data: appData, message: 'Success', status: 200 };
    } catch (err) {
      const response = await axiosClient.patch(`/api/applications/${id}/read`);
      const appData = response.data?.data || response.data;
      return { data: appData, message: 'Success', status: 200 };
    }
  }
};
