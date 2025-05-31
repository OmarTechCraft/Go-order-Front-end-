import api from "../api/api.ts";

export const login = async (email: string, password: string) => {
  const response = await api.post("/api/Auth/login", {
    email: email,
    password: password,
  });

  // Return the data directly
  const userData = response.data;

  if (userData && userData.token) {
    localStorage.setItem("token", userData.token);
  }

  if (userData && userData.id) {
    localStorage.setItem("id", userData.id);
  }

  return userData;
};

export const register = async (registerData: {
  email: string;
  password: string;
  Name: string;
  phoneNumber: string;
  gender: string;
  businessAccount: boolean;
  businessName: string;
  globalCategoryId: number;
}) => {
  const response = await api.post("/api/Auth/register", registerData);
  return response.data;
};
