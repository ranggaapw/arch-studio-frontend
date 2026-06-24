import axios from 'axios';
import type { ApiResponse, Message } from '../types';

const API_URL = 'http://localhost:8080/api/messages';

export const messageService = {
  getMessages: async (): Promise<ApiResponse<Message[]>> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  sendMessage: async (message: Omit<Message, 'id' | 'createdAt'>): Promise<ApiResponse<Message>> => {
    const response = await axios.post(API_URL, message);
    return response.data;
  },

  deleteMessage: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  markAsRead: async (id: number): Promise<ApiResponse<Message>> => {
    const response = await axios.patch(`${API_URL}/${id}/read`);
    return response.data;
  }
};
