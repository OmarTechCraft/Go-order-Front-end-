import axiosInstance from "../api/api";

// Category interface for main categories
export interface Category {
  id: number;
  name: string;
  businessId: string;
  parentCategoryId: number | null;
  image: string;
  subCategories: string[];
}

// SubCategory interface for subcategories (aligned with Category for reusability where possible)
export interface SubCategory {
  categoryId: number; // Renamed to categoryId for consistency with backend SubCategory model
  categoryName: string; // Renamed to categoryName for consistency
  categoryImage: string; // Renamed to categoryImage for consistency
  businessId: string;
  parentCategoryId: number;
  products: Product[];
  subCategories: string[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  views: number;
  bounceTime: number;
  bounceRate: number;
}

export interface CategoryFormData {
  name: string;
  parentCategoryId?: number | null; // Can be null for top-level categories
  image?: File;
}

export class CategoryService {
  // Fetch main categories
  static async fetchCategories(businessId: string): Promise<Category[]> {
    try {
      const response = await axiosInstance.get(
        `/api/Category?businessId=${businessId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // Fetch subcategories for a parent category
  static async fetchSubcategories(parentId: number): Promise<SubCategory[]> {
    try {
      const response = await axiosInstance.get(
        `/api/Category/subCategories/${parentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }
  }

  // Add new category (main or subcategory)
  static async addCategory(
    data: CategoryFormData
  ): Promise<Category | SubCategory> {
    try {
      const formData = new FormData();
      formData.append("Name", data.name);

      if (
        data.parentCategoryId !== undefined &&
        data.parentCategoryId !== null
      ) {
        formData.append("ParentCategoryId", data.parentCategoryId.toString());
      }

      if (data.image) {
        formData.append("Image", data.image);
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
  }

  // Update an existing category or subcategory
  static async updateCategory(
    id: number,
    data: CategoryFormData
  ): Promise<Category | SubCategory> {
    try {
      const formData = new FormData();
      formData.append("Name", data.name);

      if (data.image) {
        formData.append("Image", data.image);
      } else if (data.image === undefined) {
        // If image is explicitly undefined, it means no new image was selected
        // We might need a way to signal "no change to image" or "remove image"
        // For now, if image is not provided, we won't append it to formData.
        // If the API requires explicit signal for no image change, this needs adjustment.
      }

      const response = await axiosInstance.put(
        `/api/Category/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete category
  static async deleteCategory(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/api/Category/${id}`); // Changed to /api/Category/{id} as per Swagger
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}
