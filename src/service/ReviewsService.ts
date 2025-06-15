import axiosInstance from "../api/api"; // Adjust the path as per your project structure

// Define TypeScript interfaces to accurately match the structure of your API response.
// This improves type safety and makes your code more robust.

// Interface for Category details within the Product object
export interface Category {
  id: number;
  name: string;
  businessId: string;
  parentCategoryId: number;
  image: string;
  subCategories: string[];
}

// Interface for Product details within the ReviewRating object
export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number; // This 'rating' is the product's overall rating, not the individual review's 'value'
  stock: number;
  category: Category;
  businessId: string;
  images: { url: string }[]; // Array of image objects, each with a 'url'
  variants: any[]; // Using 'any' as the detailed schema for 'variants' is not provided
  ingredients: any[]; // Using 'any' as the detailed schema for 'ingredients' is not provided
}

// The main interface for a single review/rating object returned by the API
export interface ReviewRating {
  userId: string; // The unique ID of the user who submitted the review
  value: number; // The star rating given in this specific review (e.g., 1 to 5)
  text: string; // The textual content of the review
  product: Product; // The product associated with this review
}

/**
 * Service for handling API calls related to fetching business reviews/ratings.
 */
export const ReviewsService = {
  /**
   * Fetches ratings and reviews for a business from the API.
   * @param skip The number of records to skip, useful for pagination. Defaults to 0.
   * @returns A Promise that resolves to an array of ReviewRating objects.
   */
  getBusinessRatings: async (skip: number = 0): Promise<ReviewRating[]> => {
    try {
      const response = await axiosInstance.get(`/api/Business/Ratings`, {
        params: { skip }, // Pass the 'skip' parameter to the API request
      });
      return response.data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching business ratings:", error);
      throw error; // Re-throw the error to be handled by the calling component
    }
  },
};
