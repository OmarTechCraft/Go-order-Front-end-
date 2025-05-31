import axiosInstance from "../api/api.ts";

export interface AdminCreateDTO {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface AdminDTO {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAdmins = async (): Promise<AdminDTO[]> => {
  try {
    const response = await axiosInstance.get("/api/Admin", {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};

export const createAdmin = async (admin: AdminCreateDTO): Promise<AdminDTO> => {
  try {
    const response = await axiosInstance.post("/api/Admin", admin, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};

export const updateAdmin = async (
  adminId: string,
  formData: FormData
): Promise<AdminDTO> => {
  try {
    const response = await axiosInstance.put(
      `/api/Admin/${adminId}`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating admin:", error);
    throw error;
  }
};

export const deleteAdmin = async (adminId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/Admin/${adminId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};
