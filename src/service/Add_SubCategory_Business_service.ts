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

// SubCategory interface for subcategories
export interface SubCategory {
  categoryId: number;
  categoryName: string;
  categoryImage: string;
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

export interface AddCategoryData {
  name: string;
  parentCategoryId?: number;
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
  static async addCategory(data: AddCategoryData): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("Name", data.name);

      if (data.parentCategoryId) {
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

  // Delete category
  static async deleteCategory(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/api/SpecificCategory/${id}`);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}
