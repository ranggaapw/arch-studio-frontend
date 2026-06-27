import axiosClient from '../features/client/api/axiosClient';
import type { ApiResponse, Message } from '../types';

const mapMessageFromApi = (m: any): Message => {
  if (!m) return {} as Message;
  return {
    id: m.id,
    name: m.name || m.nama || '',
    email: m.email || '',
    subject: m.subject || m.judul || '',
    content: m.content || m.pesan || '',
    isRead: m.isRead !== undefined ? m.isRead : (m.is_read !== undefined ? m.is_read : false),
    createdAt: m.createdAt || m.created_at || new Date().toISOString()
  };
};

export const messageService = {
  getMessages: async (): Promise<ApiResponse<Message[]>> => {
    try {
      const response = await axiosClient.get('/api/messages');
      const rawList = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      const mappedList = rawList.map(mapMessageFromApi);
      return { data: mappedList, message: 'Success', status: 200 };
    } catch (e) {
      console.error("Failed to fetch messages", e);
      return { data: [], message: 'Error', status: 500 };
    }
  },

  sendMessage: async (message: Omit<Message, 'id' | 'createdAt'>): Promise<ApiResponse<Message>> => {
    const payload = {
      ...message,
      name: message.name,
      nama: message.name,
      subject: message.subject,
      judul: message.subject,
      content: message.content,
      pesan: message.content
    };
    const response = await axiosClient.post('/api/messages', payload);
    const data = response.data?.data || response.data;
    return { data: mapMessageFromApi(data), message: 'Success', status: 201 };
  },

  deleteMessage: async (id: number): Promise<ApiResponse<void>> => {
    await axiosClient.delete(`/api/messages/${id}`);
    return { data: undefined, message: 'Success', status: 200 };
  },

  markAsRead: async (id: number): Promise<ApiResponse<Message>> => {
    try {
      const response = await axiosClient.patch(`/api/messages/${id}/read`);
      const data = response.data?.data || response.data;
      return { data: mapMessageFromApi(data), message: 'Success', status: 200 };
    } catch (err) {
      const response = await axiosClient.put(`/api/messages/${id}/read`);
      const data = response.data?.data || response.data;
      return { data: mapMessageFromApi(data), message: 'Success', status: 200 };
    }
  }
};
