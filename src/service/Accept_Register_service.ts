import axiosInstance from "../api/api";

// Types for API responses
export interface BusinessData {
  id: string;
  businessName: string;
  email: string;
  address: string;
  phoneNumber: string;
  bankAccountNumber: string;
  image: string;
  idImage: string;
  role: string;
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

export interface DeliveryData {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  vehicleType: string;
  active: boolean;
  image: string;
  idImage: string;
  email?: string; // Adding email as it's shown in the component but not in API docs
  phoneNumber?: string; // Adding phone as it's shown in the component but not in API docs
}

export interface ReviewRequest {
  approved: boolean;
}

// Function to get inactive businesses
export const getInactiveBusinesses = async () => {
  try {
    const response = await axiosInstance.get<BusinessData[]>(
      "/api/Admin/Business",
      {
        params: {
          skip: 0,
          active: false,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inactive businesses:", error);
    throw error;
  }
};

// Function to get inactive delivery personnel
export const getInactiveDelivery = async () => {
  try {
    const response = await axiosInstance.get<DeliveryData[]>(
      "/api/Admin/Delivery",
      {
        params: {
          skip: 0,
          take: 20,
        },
      }
    );
    // Filter inactive only if needed (assuming API returns both active and inactive)
    return response.data.filter((delivery) => !delivery.active);
  } catch (error) {
    console.error("Error fetching inactive delivery personnel:", error);
    throw error;
  }
};

// Function to approve/reject business registration
export const reviewBusiness = async (businessId: string, approved: boolean) => {
  try {
    const response = await axiosInstance.put(
      `/api/Admin/Business/${businessId}/Review`,
      {
        approved,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewing business:", error);
    throw error;
  }
};

// Function to approve/reject delivery person registration
export const reviewDelivery = async (deliveryId: string, approved: boolean) => {
  try {
    const response = await axiosInstance.put(
      `/api/Admin/${deliveryId}/review`,
      {
        approved,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewing delivery person:", error);
    throw error;
  }
};

// Function to delete a business registration
export const deleteBusiness = async (businessId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/Admin/Business/${businessId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting business:", error);
    throw error;
  }
};

// Function to delete a delivery person registration
export const deleteDelivery = async (deliveryId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/Admin/Delivery/${deliveryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting delivery person:", error);
    throw error;
  }
};
