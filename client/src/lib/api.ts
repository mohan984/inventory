import { apiRequest } from "./queryClient";
import type { Product, InsertProduct, UpdateProduct } from "@shared/schema";

export interface ProductStats {
  totalProducts: number;
  totalSales: string;
  lowStock: number;
  suppliers: number;
}

export const productApi = {
  getProducts: async (search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    
    const response = await apiRequest('GET', `/api/products?${params}`);
    return response.json();
  },

  getProductStats: async (): Promise<ProductStats> => {
    const response = await apiRequest('GET', '/api/products/stats');
    return response.json();
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await apiRequest('GET', `/api/products/${id}`);
    return response.json();
  },

  createProduct: async (product: InsertProduct): Promise<Product> => {
    const response = await apiRequest('POST', '/api/products', product);
    return response.json();
  },

  updateProduct: async (id: number, product: UpdateProduct): Promise<Product> => {
    const response = await apiRequest('PUT', `/api/products/${id}`, product);
    return response.json();
  },

  deleteProduct: async (id: number): Promise<void> => {
    await apiRequest('DELETE', `/api/products/${id}`);
  },
};
