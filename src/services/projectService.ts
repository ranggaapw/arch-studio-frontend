import type { Project, ApiResponse } from '../types';
// import axiosClient from '../features/client/api/axiosClient';

const defaultMockProjects: Project[] = [
  { id: 1, title: 'Modern Minimalist House', description: 'Desain rumah minimalis di pusat kota.', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500' },
  { id: 2, title: 'Urban Coffee Shop', description: 'Renovasi interior kedai kopi bergaya industrial.', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500' },
  { id: 3, title: 'Luxury Villa Bali', description: 'Desain villa tropis modern dengan pemandangan laut.', imageUrl: 'https://images.unsplash.com/photo-1613490908578-83141f6cb65f?w=500' },
];

const getMockProjects = (): Project[] => {
  const stored = localStorage.getItem('mockProjects');
  return stored ? JSON.parse(stored) : defaultMockProjects;
};

const saveMockProjects = (data: Project[]) => {
  localStorage.setItem('mockProjects', JSON.stringify(data));
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  getProjects: async (): Promise<ApiResponse<Project[]>> => {
    // const response = await axiosClient.get<ApiResponse<Project[]>>('/api/projects');
    // return response.data;
    await delay(500);
    return { data: getMockProjects(), message: 'Success', status: 200 };
  },

  createProject: async (data: Omit<Project, 'id'>): Promise<ApiResponse<Project>> => {
    // const response = await axiosClient.post<ApiResponse<Project>>('/api/projects', data);
    // return response.data;
    await delay(500);
    const newProject = { ...data, id: Date.now() };
    const current = getMockProjects();
    current.push(newProject);
    saveMockProjects(current);
    return { data: newProject, message: 'Created successfully', status: 201 };
  },

  updateProject: async (id: number, data: Project): Promise<ApiResponse<Project>> => {
    // const response = await axiosClient.put<ApiResponse<Project>>(`/api/projects/${id}`, data);
    // return response.data;
    await delay(500);
    const updated = getMockProjects().map(p => p.id === id ? data : p);
    saveMockProjects(updated);
    return { data, message: 'Updated successfully', status: 200 };
  },

  deleteProject: async (id: number): Promise<ApiResponse<null>> => {
    // const response = await axiosClient.delete<ApiResponse<null>>(`/api/projects/${id}`);
    // return response.data;
    await delay(500);
    const filtered = getMockProjects().filter(p => p.id !== id);
    saveMockProjects(filtered);
    return { data: null, message: 'Deleted successfully', status: 200 };
  }
};
