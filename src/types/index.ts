export interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  backgroundImageUrl: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  iconName?: string; // We'll map this to a Lucide icon string like "Home"
  imageUrl?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  clientName?: string;
  location?: string;
  year?: number;
  isFeatured?: boolean;
}

export interface AboutInfo {
  id: number;
  description: string;
  mission: string;
  vision: string;
  imageUrl?: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// Custom mock response to mimic Axios/Backend
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
