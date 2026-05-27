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

export const profileForm = (data: { fullName: string; address: string; profession: string; specialization: string; skills: string[]; contact: string; linkedIn?: string; instagram?: string }) => {
  return axiosInstance.post('/user/profileForm', data);
};

export const updateProfile = (id: string, updateData: Partial<User>) => {
  return axiosInstance.put(`/user/profile/${id}`, updateData);
};

// Conversation APIs
export const getConversation = (senderId: string, receiverId: string) => {
  return axiosInstance.post('/conversations', { senderId, receiverId });
};

export const getUserConversations = (userId: string) => {
  return axiosInstance.get(`/conversations/${userId}`);
};

// Message APIs
export const getMessagesByConversationId = (conversationId: string) => {
  return axiosInstance.get(`/messages/conversation/${conversationId}`);
};

export const getMessagesByUsers = (userId1: string, userId2: string) => {
  return axiosInstance.get(`/messages/users/${userId1}/${userId2}`);
};





