// File: src/service/BusDashboard_service.ts

import axiosInstance from "../api/api";

export interface DashboardData {
  totalOrders: number;
  orderRequests: number;
  totalRevenue: number;
  dailyRevenue: { [key: string]: number };
  monthlyRevenue: { [key: string]: number };
  yearlyRevenue: { [key: string]: number };
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await axiosInstance.get("/api/Business/Dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
