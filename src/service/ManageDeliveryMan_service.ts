import axiosInstance from "../api/api.ts";

// Interface for DeliveryMan response from API
export interface DeliveryManResponse {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  vehicleType: string;
  phoneNumber: string;
  active: boolean;
  image: string;
  idImage: string;
}

// Interface for creating a new delivery man
export interface CreateDeliveryManDTO {
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Address: string;
  Gender: string;
  VehicleType: string;
  Image?: File;
  IdImage?: File;
}

// Interface for updating a delivery man
export interface UpdateDeliveryManDTO {
  FirstName?: string;
  LastName?: string;
  Address?: string;
  PhoneNumber?: string;
  VehicleType?: string;
  Image?: File;
  IdImage?: File;
}

/**
 * Service for managing delivery personnel
 */
export const DeliveryManService = {
  /**
   * Fetches all delivery personnel with pagination
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @returns Promise with the list of delivery personnel
   */
  getAllDeliveryMen: async (
    skip = 0,
    take = 20
  ): Promise<DeliveryManResponse[]> => {
    try {
      const response = await axiosInstance.get("/api/Admin/Delivery", {
        params: { skip, take },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching delivery men:", error);
      throw error;
    }
  },

  /**
   * Creates a new delivery person
   * @param deliveryManData Data for the new delivery person
   * @returns Promise with the created delivery person
   */
  createDeliveryMan: async (
    deliveryManData: CreateDeliveryManDTO
  ): Promise<any> => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add all fields to the form data
      Object.entries(deliveryManData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await axiosInstance.post(
        "/api/Admin/Delivery",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating delivery man:", error);
      throw error;
    }
  },

  /**
   * Updates an existing delivery person
   * @param deliveryId ID of the delivery person to update
   * @param updateData Data to update
   * @returns Promise with the updated delivery person
   */
  updateDeliveryMan: async (
    deliveryId: string,
    updateData: UpdateDeliveryManDTO
  ): Promise<any> => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add all fields to the form data
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await axiosInstance.put(
        `/api/Admin/Delivery/${deliveryId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating delivery man with ID ${deliveryId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Deletes a delivery person
   * @param deliveryId ID of the delivery person to delete
   * @returns Promise with the deleted delivery person data
   */
  deleteDeliveryMan: async (deliveryId: string): Promise<any> => {
    try {
      const response = await axiosInstance.delete(
        `/api/Admin/Delivery/${deliveryId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error deleting delivery man with ID ${deliveryId}:`,
        error
      );
      throw error;
    }
  },
};

export default DeliveryManService;
