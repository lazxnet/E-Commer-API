import { AdminProfile, Category, Product } from "../components/types";

// services/api.service.ts
const CATEGORIES_CACHE_KEY = "cached_categories";
const CACHE_EXPIRATION = 3600000; // 1 hora en milisegundos

export class ApiService {
  static async fetchAdminProfile(userAdminId: string): Promise<AdminProfile> {
    const response = await fetch(
      `http://localhost:8080/useradmin/profile/${userAdminId}`
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return response.json();
  }

  static async fetchProducts(): Promise<Product[]> {
    const response = await fetch("http://localhost:8080/product/showallproducts");
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return response.json();
  }

  static async loadCategories(): Promise<Category[]> {
    const cachedData = sessionStorage.getItem(CATEGORIES_CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_EXPIRATION) return data;
    }

    const response = await fetch("http://localhost:8080/category/showall_categories");
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    
    const newData = await response.json();
    sessionStorage.setItem(
      CATEGORIES_CACHE_KEY,
      JSON.stringify({ data: newData, timestamp: Date.now() })
    );
    
    return newData;
  }

  static async createProduct(userAdminId: string, productData: any): Promise<Product> {
    const response = await fetch("http://localhost:8080/product/createproduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        UserAdminId: userAdminId,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error(await this.getError(response));
    return response.json();
  }

  static async updateProduct(userAdminId: string, productId: string, productData: any): Promise<Product> {
    const response = await fetch(`http://localhost:8080/product/update_product/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        UserAdminId: userAdminId,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error(await this.getError(response));
    return response.json();
  }

  static async deleteProduct(userAdminId: string, productId: string): Promise<void> {
    const response = await fetch(`http://localhost:8080/product/delete_product/${productId}`, {
      method: "DELETE",
      headers: { UserAdminId: userAdminId },
    });
    if (!response.ok) throw new Error(await this.getError(response));
  }

  private static async getError(response: Response): Promise<string> {
    try {
      const errorData = await response.json();
      return errorData.message || "Error desconocido";
    } catch {
      return `Error HTTP: ${response.status}`;
    }
  }
}