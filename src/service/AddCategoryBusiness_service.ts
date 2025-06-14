import axiosInstance from "../api/api";

export interface CategoryResponse {
  id: number;
  name: string;
  businessId: string;
  parentCategoryId: number;
  image: string;
  subCategories: string[];
}

/**
 * Service for handling Category-related API calls
 */
export const CategoryService = {
  /**
   * Get all categories for a business
   * @param businessId - The business ID
   * @returns Promise with the categories
   */
  getCategories: async (businessId: string): Promise<CategoryResponse[]> => {
    try {
      const response = await axiosInstance.get("/api/Category", {
        params: { businessId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  /**
   * Add a new category
   * @param name - Category name
   * @param image - Category image file
   * @returns Promise with the created category
   */
  addCategory: async (
    name: string,
    image?: File
  ): Promise<CategoryResponse> => {
    try {
      // Create form data
      const formData = new FormData();
      formData.append("Name", name);

      // Only append image if it exists
      if (image) {
        formData.append("Image", image);
      }

      const response = await axiosInstance.post("/api/Category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  },

  /**
   * Update an existing category
   * @param categoryId - The ID of the category to update
   * @param name - The new category name
   * @param image - The new category image file (optional)
   * @returns Promise with the updated category
   */
  updateCategory: async (
    categoryId: number,
    name: string,
    image?: File
  ): Promise<CategoryResponse> => {
    try {
      const formData = new FormData();
      formData.append("Name", name);
      if (image) {
        formData.append("Image", image);
      }

      const response = await axiosInstance.put(
        `/api/Category/${categoryId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating category with ID ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a category
   * @param categoryId - The category ID to delete
   * @returns Promise with the result
   */
  deleteCategory: async (categoryId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/Category/${categoryId}`);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  /**
   * Get subcategories for a parent category
   * @param parentId - The parent category ID
   * @returns Promise with the subcategories
   */
  getSubCategories: async (parentId: number): Promise<CategoryResponse[]> => {
    try {
      const response = await axiosInstance.get(
        `/api/Category/subCategories/${parentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }
  },
};

export default CategoryService;
