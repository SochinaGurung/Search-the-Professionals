import axiosInstance from "./axiosInstance";

export const loginApi = (data: { username: string; password: string }) => {
  return axiosInstance.post('/auth/login', data);
};

export const registerApi = (data: { email: string; username: string; password: string }) => {
  return axiosInstance.post('/auth/register', data);
};

export const getUserListApi = () => {
  return axiosInstance.get('/user/getUserList'); 
};

export const getUserSearchApi = (username: string) => {
  return axiosInstance.get(`/user/searchUsers?q=${username}`);
};
