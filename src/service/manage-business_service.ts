import axiosInstance from "../api/api";

// Business API service

export interface Business {
  id: string;
  businessName: string;
  email: string;
  address: string;
  phoneNumber: string;
  bankAccountNumber: string;
  image: string;
  idImage: string;
  active: string;
  globalCategory: {
    id: number;
    name: string;
    image: string;
    subCategories: {
      id: number;
      name: string;
      image: string;
      parentCategoryId: number;
    }[];
  };
  specificCategory: {
    id: number;
    name: string;
    image: string;
    parentCategoryId: number;
  };
}

export interface GlobalCategory {
  id: number;
  name: string;
  image: string;
  subCategories: {
    id: number;
    name: string;
    image: string;
    parentCategoryId: number;
  }[];
}

export interface SpecificCategory {
  id: number;
  name: string;
  image: string;
  parentCategoryId: number;
}

export const BusinessService = {
  // Get all businesses with active filter
  getBusinesses: async (active: boolean = true) => {
    try {
      const response = await axiosInstance.get(
        `/api/Admin/Business?active=${active}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching businesses:", error);
      throw error;
    }
  },

  // Create a new business
  createBusiness: async (
    name: string,
    phoneNumber: string,
    address: string,
    email: string,
    bankAccountNumber: string,
    password: string,
    globalCategoryId: number,
    specificCategoryId: number,
    image: File,
    idImage: File
  ) => {
    try {
      const formData = new FormData();

      // Append files to form data
      formData.append("Image", image);
      formData.append("IdImage", idImage);

      // Build the URL with query parameters
      const url =
        `/api/Admin/Business?Name=${encodeURIComponent(name)}` +
        `&PhoneNumber=${encodeURIComponent(phoneNumber)}` +
        `&Address=${encodeURIComponent(address)}` +
        `&Email=${encodeURIComponent(email)}` +
        `&BankAccountNumber=${encodeURIComponent(bankAccountNumber)}` +
        `&Password=${encodeURIComponent(password)}` +
        `&GlobalCategoryId=${globalCategoryId}` +
        `&SpecificCategoryId=${specificCategoryId}`;

      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating business:", error);
      throw error;
    }
  },

  // Update an existing business
  updateBusiness: async (
    businessId: string,
    businessName: string,
    address: string,
    phoneNumber: string,
    bankAccountNumber: string,
    globalCategoryId: number,
    specificCategoryId: number,
    image?: File,
    idImage?: File
  ) => {
    try {
      const formData = new FormData();

      // Only append files if they exist
      if (image) formData.append("Image", image);
      if (idImage) formData.append("IdImage", idImage);

      // Append text fields to form data
      formData.append("BusinessName", businessName);
      formData.append("Address", address);
      formData.append("PhoneNumber", phoneNumber);
      formData.append("BankAccountNumber", bankAccountNumber);
      formData.append("GlobalCategoryId", globalCategoryId.toString());
      formData.append("SpecificCategoryId", specificCategoryId.toString());

      const response = await axiosInstance.put(
        `/api/Admin/Business/${businessId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating business:", error);
      throw error;
    }
  },

  // Delete a business
  deleteBusiness: async (businessId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/api/Admin/Business/${businessId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting business:", error);
      throw error;
    }
  },

  // Get global categories
  getGlobalCategories: async () => {
    try {
      const response = await axiosInstance.get("/api/GlobalCategory");
      return response.data;
    } catch (error) {
      console.error("Error fetching global categories:", error);
      throw error;
    }
  },

  // Get specific categories by parent category ID
  getSpecificCategories: async (parentCategoryId: number) => {
    try {
      const response = await axiosInstance.get(
        `/api/SpecificCategory?parentCategoryId=${parentCategoryId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching specific categories:", error);
      throw error;
    }
  },
};

export default BusinessService;
