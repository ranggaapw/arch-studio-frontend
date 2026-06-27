import axiosClient from '../features/client/api/axiosClient';
import type { ApiResponse, Message } from '../types';

export const messageService = {
  getMessages: async (): Promise<ApiResponse<Message[]>> => {
    try {
      const response = await axiosClient.get('/api/messages');
      const arrayData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      return { data: arrayData, message: 'Success', status: 200 };
    } catch (e) {
      console.error("Failed to fetch messages", e);
      return { data: [], message: 'Error', status: 500 };
    }
  },

  sendMessage: async (message: Omit<Message, 'id' | 'createdAt'>): Promise<ApiResponse<Message>> => {
    const response = await axiosClient.post('/api/messages', message);
    const data = response.data?.data || response.data;
    return { data, message: 'Success', status: 201 };
  },

  deleteMessage: async (id: number): Promise<ApiResponse<void>> => {
    await axiosClient.delete(`/api/messages/${id}`);
    return { data: undefined, message: 'Success', status: 200 };
  },

  markAsRead: async (id: number): Promise<ApiResponse<Message>> => {
    // Some backend implementations use PUT or PATCH for read status, let's fallback if one fails
    try {
      const response = await axiosClient.patch(`/api/messages/${id}/read`);
      const data = response.data?.data || response.data;
      return { data, message: 'Success', status: 200 };
    } catch (err) {
      const response = await axiosClient.put(`/api/messages/${id}/read`);
      const data = response.data?.data || response.data;
      return { data, message: 'Success', status: 200 };
    }
  }
};
