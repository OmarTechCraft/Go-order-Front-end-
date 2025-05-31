import axiosInstance from "../api/api";

// Define interfaces based on the API schema
export interface SubCategory {
  id: number;
  name: string;
  image: string;
  parentCategoryId: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  subCategories: SubCategory[];
}

// Service functions for managing categories
export const CategoryService = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get("/api/GlobalCategory");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Add a new category with image
  addCategory: async (name: string, imageFile: File): Promise<Category[]> => {
    try {
      const formData = new FormData();
      formData.append("Image", imageFile);

      // Send the name as a query parameter
      const response = await axiosInstance.post(
        `/api/GlobalCategory?Name=${encodeURIComponent(name)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  },

  // Delete a category
  deleteCategory: async (categoryId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/GlobalCategory/${categoryId}`);
    } catch (error) {
      console.error(`Error deleting category with ID ${categoryId}:`, error);
      throw error;
    }
  },

  // Update a category (This is not directly provided in the API, but we can implement it)
  updateCategory: async (
    categoryId: number,
    name: string,
    imageFile?: File
  ): Promise<Category[]> => {
    try {
      // For updating, we would typically use a PUT or PATCH request
      // However, since it's not specified in the API, we'll have to delete and recreate
      // This is a workaround solution
      await CategoryService.deleteCategory(categoryId);

      // Then create a new one with the updated information
      if (imageFile) {
        return await CategoryService.addCategory(name, imageFile);
      } else {
        throw new Error("Image file is required for updating category");
      }
    } catch (error) {
      console.error(`Error updating category with ID ${categoryId}:`, error);
      throw error;
    }
  },
};

export default CategoryService;
