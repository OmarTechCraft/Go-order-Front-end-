"use client";

export interface Address {
  id: number;
  country: string;
  city: string;
  street: string;
  note: string;
  buildingNumber: number;
  floorNumber: number;
}

export interface Business {
  id: string;
  businessName: string;
  image: string;
}

export interface Category {
  id: number;
  name: string;
  businessId: string;
  parentCategoryId: number;
  image: string;
  subCategories: string[];
}

export interface Image {
  url: string;
}

export interface Variant {
  id: number;
  price: number;
  image: string;
  stock: number;
  color: string;
  size: string;
  weight: string;
}

export interface Ingredient {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface Product {
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

export interface OrderItem {
  variantId: number;
  quantity: number;
  product: Product;
}

export interface ApiOrder {
  id: number;
  totalPrice: number;
  status: string;
  deliveryFee: number;
  address: Address;
  business: Business;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderReviewResponse {
  approved: boolean;
}

// Helper function to get token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token'); 
  }
  return null;
};

// API base URL - adjust as needed
const API_BASE_URL = 'https://go-order.koyeb.app/api';

// Generic fetch function with auth headers
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Fetch all orders
export const fetchOrders = async (): Promise<ApiOrder[]> => {
  return fetchWithAuth('/Business/Order');
};

// Review an order (accept or reject)
export const reviewOrder = async (orderId: number, approved: boolean): Promise<OrderReviewResponse> => {
  return fetchWithAuth(`/Business/Order/${orderId}/Review`, {
    method: 'PUT',
    body: JSON.stringify({ approved }),
  });
};

// Format date string from API to a readable format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

// Map API order status to UI status and action
export const mapOrderStatus = (status: string): { status: string, action: string } => {
  switch (status.toLowerCase()) {
    case 'pending':
      return { status: 'waiting', action: 'pending' };
    case 'approved':
    case 'preparing':
      return { status: 'preparing', action: 'in-progress' };
    case 'completed':
    case 'delivered':
      return { status: 'delivered', action: 'completed' };
    case 'rejected':
    case 'cancelled':
      return { status: 'cancelled', action: 'cancelled' };
    default:
      return { status: status, action: 'unknown' };
  }
};