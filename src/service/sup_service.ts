import axiosInstance from "../api/api";

// Interface for Global Category from API
interface GlobalCategory {
  id: number;
  name: string;
  image: string;
  subCategories: SpecificCategory[];
}

// Interface for Specific Category from API
interface SpecificCategory {
  id: number;
  name: string;
  image: string;
  parentCategoryId: number;
}

/**
 * Fetch all global categories from the API
 */
export const fetchGlobalCategories = async (): Promise<GlobalCategory[]> => {
  try {
    const response = await axiosInstance.get("/api/GlobalCategory");
    return response.data;
  } catch (error) {
    console.error("Error fetching global categories:", error);
    throw error;
  }
};

/**
 * Fetch specific categories for a given parent category ID
 * @param parentCategoryId - The ID of the parent global category
 */
export const fetchSpecificCategories = async (
  parentCategoryId: number
): Promise<SpecificCategory[]> => {
  try {
    const response = await axiosInstance.get("/api/SpecificCategory", {
      params: { parentCategoryId },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching specific categories for parentId ${parentCategoryId}:`,
      error
    );
    throw error;
  }
};

/**
 * Add a new specific category
 * @param name - The name of the new specific category
 * @param parentCategoryId - The ID of the parent global category
 * @param formData - FormData containing the image file
 */
export const addSpecificCategory = async (
  name: string,
  parentCategoryId: number,
  formData: FormData
): Promise<SpecificCategory> => {
  try {
    const response = await axiosInstance.post(
      "/api/SpecificCategory",
      formData,
      {
        params: {
          Name: name,
          ParentCategoryId: parentCategoryId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding specific category:", error);
    throw error;
  }
};

/**
 * Delete a specific category by ID
 * @param specificCategoryId - The ID of the specific category to delete
 */
export const deleteSpecificCategory = async (
  specificCategoryId: number
): Promise<SpecificCategory> => {
  try {
    const response = await axiosInstance.delete(
      `/api/SpecificCategory/${specificCategoryId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting specific category with ID ${specificCategoryId}:`,
      error
    );
    throw error;
  }
};
