import axiosClient from '../features/client/api/axiosClient';
import type { AhpRequestType, ApiResponse, AhpResult } from '../types';

export const calculateAhp = async (payload: AhpRequestType): Promise<ApiResponse<AhpResult>> => {
  const { data } = await axiosClient.post<ApiResponse<AhpResult>>('/api/ahp/calculate', payload);
  return data;
};
