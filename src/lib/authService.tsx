import api from "./axios";
import { endpoints } from "./endpoints";

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post(endpoints.AUTH.LOGIN, credentials);
    console.log(response, 'login')
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post(endpoints.AUTH.REGISTER, userData);
    console.log(response, 'register')
    return response.data;
  },
};