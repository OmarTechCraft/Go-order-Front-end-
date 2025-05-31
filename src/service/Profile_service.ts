import axiosInstance from "../api/api";

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  role: string;
  image: string;
}

interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  image?: File;
}

/**
 * Fetch the user profile from the API
 * @returns Promise containing the user profile data
 */
export const getUserProfile = async (): Promise<ProfileData> => {
  try {
    const response = await axiosInstance.get("/api/Admin/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
};

/**
 * Update the user profile with new data
 * @param profileData The profile data to update
 * @returns Promise containing the updated profile data
 */
export const updateUserProfile = async (
  profileData: ProfileUpdateData
): Promise<ProfileData> => {
  try {
    // Create FormData object for multipart/form-data submission (needed for file upload)
    const formData = new FormData();

    // Append text fields to form data if they exist
    if (profileData.firstName)
      formData.append("FirstName", profileData.firstName);
    if (profileData.lastName) formData.append("LastName", profileData.lastName);
    if (profileData.phoneNumber)
      formData.append("PhoneNumber", profileData.phoneNumber);
    if (profileData.address) formData.append("Address", profileData.address);

    // Append image file if it exists
    if (profileData.image) formData.append("Image", profileData.image);

    const response = await axiosInstance.put("/api/Admin/Profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};
