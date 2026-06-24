import axiosClient from './axiosClient';

export const loginApi = async (username: string, password: string) => {
  const response = await axiosClient.post('/api/auth/login', {
    username,
    password,
  });

  // Log ini untuk memastikan struktur JSON yang diterima
  console.log("Response dari Backend:", response.data);

  // Sesuaikan dengan struktur JSON dari WebResponse Spring Boot kamu
  // Biasanya jika menggunakan WebResponse: data.data.token
  const token = response.data.data?.token || response.data.token;

  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    console.error("Token tidak ditemukan dalam response!");
  }

  return response.data;
};