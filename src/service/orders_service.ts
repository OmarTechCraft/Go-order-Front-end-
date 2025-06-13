import axiosInstance from "../api/api";

// Define interfaces for API responses
interface Address {
  id: number;
  country: string;
  city: string;
  street: string;
  note: string;
  buildingNumber: number;
  floorNumber: number;
}

interface Business {
  id: string;
  businessName: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
  businessId: string;
  parentCategoryId: number;
  image: string;
  subCategories: string[];
}

interface Image {
  url: string;
}

interface Variant {
  id: number;
  price: number;
  image: string;
  stock: number;
  color: string;
  size: string;
  weight: string;
}

interface Ingredient {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  stock: number;
  category: Category;
  businessId: string;
  images: Image[];
  variants: Variant[];
  ingredients: Ingredient[];
}

interface OrderItem {
  variantId: number;
  quantity: number;
  product: Product;
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  deliveryFee: number;
  address: Address;
  business: Business;
  items: OrderItem[];
  createdAt: string;
}

interface UpdateOrderStatusRequest {
  status: string;
}

/**
 * Fetch orders from the API
 * @param status - Optional status filter (Pending, In progress, Cooked, Out to delivery, Delivered)
 * @returns Promise<Order[]>
 */
export const getOrders = async (status?: string): Promise<Order[]> => {
  try {
    const params = status ? { status } : {};

    const response = await axiosInstance.get("/api/Business/Order", {
      params,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    } else {
      throw new Error("Failed to fetch orders: Unknown error");
    }
  }
};

/**
 * Fetch a specific order by ID
 * @param orderId - The ID of the order to fetch
 * @returns Promise<Order[]>
 */
export const getOrderById = async (orderId: number): Promise<Order[]> => {
  try {
    const response = await axiosInstance.get(`/api/Business/Order/${orderId}`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch order: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching order by ID:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    } else {
      throw new Error("Failed to fetch order: Unknown error");
    }
  }
};

/**
 * Update order status
 * @param orderId - The ID of the order to update
 * @param status - The new status (Pending, In progress, Cooked, Out to delivery, Delivered)
 * @returns Promise<void>
 */
export const updateOrderStatus = async (
  orderId: number,
  status: string
): Promise<void> => {
  try {
    const requestBody: UpdateOrderStatusRequest = {
      status,
    };

    const response = await axiosInstance.put(
      `/api/Business/Order/${orderId}/Review`,
      requestBody
    );

    if (response.status !== 200) {
      throw new Error(`Failed to update order status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating order status:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    } else {
      throw new Error("Failed to update order status: Unknown error");
    }
  }
};

/**
 * Helper function to get orders with error handling and retry logic
 * @param status - Optional status filter
 * @param retries - Number of retries (default: 3)
 * @returns Promise<Order[]>
 */
export const getOrdersWithRetry = async (
  status?: string,
  retries: number = 3
): Promise<Order[]> => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await getOrders(status);
    } catch (error) {
      if (i === retries) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, i) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Failed to fetch orders after retries");
};

/**
 * Helper function to validate status values
 * @param status - Status to validate
 * @returns boolean
 */
export const isValidStatus = (status: string): boolean => {
  const validStatuses = [
    "Pending",
    "In progress",
    "Cooked",
    "Out to delivery",
    "Delivered",
  ];

  return validStatuses.includes(status);
};

/**
 * Get available status options
 * @returns string[]
 */
export const getAvailableStatuses = (): string[] => {
  return ["Pending", "In progress", "Cooked", "Out to delivery", "Delivered"];
};
