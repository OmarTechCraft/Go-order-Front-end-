import axiosInstance from "../api/api";

export interface BusinessProfile {
  id?: string;
  businessName: string;
  image?: string;
  phoneNumber: string;
  bankAccountNumber: string;
  address: string;
}

export interface UpdateBusinessProfileParams {
  BusinessName: string;
  Address: string;
  PhoneNumber: string;
  BankAccountNumber: string;
  Image?: File;
}

// Get business profile
export const getBusinessProfile = async (): Promise<BusinessProfile> => {
  try {
    const response = await axiosInstance.get("/api/Business");

    // Handle the response data and ensure proper structure
    const data = response.data;

    return {
      id: data.id || "",
      businessName: data.businessName || "",
      image: data.image || "",
      phoneNumber: data.phoneNumber || "",
      bankAccountNumber: data.bankAccountNumber || "",
      address: data.address || "",
    };
  } catch (error: any) {
    console.error("Error fetching business profile:", error);

    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error.response?.status === 404) {
      throw new Error("Business profile not found.");
    } else if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    } else if (error.code === "NETWORK_ERROR" || !error.response) {
      throw new Error("Network error. Please check your connection.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to fetch business profile"
    );
  }
};

// Update business profile
export const updateBusinessProfile = async (
  profileData: UpdateBusinessProfileParams
): Promise<BusinessProfile> => {
  try {
    // Validate required fields
    if (!profileData.BusinessName.trim()) {
      throw new Error("Business name is required");
    }

    const formData = new FormData();

    // Create query parameters for the PUT request
    const params = new URLSearchParams();

    // Add parameters, ensuring they're not empty strings
    if (profileData.BusinessName.trim()) {
      params.append("BusinessName", profileData.BusinessName.trim());
    }
    if (profileData.Address.trim()) {
      params.append("Address", profileData.Address.trim());
    }
    if (profileData.PhoneNumber.trim()) {
      params.append("PhoneNumber", profileData.PhoneNumber.trim());
    }
    if (profileData.BankAccountNumber.trim()) {
      params.append("BankAccountNumber", profileData.BankAccountNumber.trim());
    }

    // Add image to form data if provided
    if (profileData.Image) {
      formData.append("Image", profileData.Image);
    }

    // Make the PUT request
    const response = await axiosInstance.put(
      `/api/Business?${params.toString()}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds timeout for file upload
      }
    );

    // Handle the response
    const data = response.data;

    return {
      id: data.id || "",
      businessName: data.businessName || "",
      image: data.image || "",
      phoneNumber: data.phoneNumber || "",
      bankAccountNumber: data.bankAccountNumber || "",
      address: data.address || "",
    };
  } catch (error: any) {
    console.error("Error updating business profile:", error);

    // Handle specific error cases
    if (error.response?.status === 400) {
      const errorMessage =
        error.response.data?.message || "Invalid data provided";
      throw new Error(errorMessage);
    } else if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to update this profile.");
    } else if (error.response?.status === 413) {
      throw new Error("File too large. Please choose a smaller image.");
    } else if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    } else if (error.code === "NETWORK_ERROR" || !error.response) {
      throw new Error("Network error. Please check your connection.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    throw new Error(
      error.response?.data?.message || "Failed to update business profile"
    );
  }
};
