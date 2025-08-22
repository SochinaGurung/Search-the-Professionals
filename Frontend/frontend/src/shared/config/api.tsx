import type { User } from "../Interface/User";
import axiosInstance from "./axiosInstance";

export const loginApi = (data: { username: string; password: string }) => {
  return axiosInstance.post('/auth/login', data);
};

export const registerApi = (data: { username: string; password: string; email: string }) => {
  return axiosInstance.post('/auth/register', data);
};

export const getUserListApi = () => {
  return axiosInstance.get('/user/getUserList'); 
};

export const getUserSearchApi = (username: string) => {
  return axiosInstance.get(`/user/searchUsers?q=${username}`);
};

export const getProfileById = (id: string) => {
    return axiosInstance.get(`/user/profile/${id}`);
};

export const profileForm = (data: {fullName: string;  profession: string; specialization: string; skills: string[] }) => {
  return axiosInstance.post('/user/profileForm', data);
};

export const updateProfile = (id: string, updateData: Partial<User>) => {
  return axiosInstance.put(`/user/profile/${id}`, updateData);
};





