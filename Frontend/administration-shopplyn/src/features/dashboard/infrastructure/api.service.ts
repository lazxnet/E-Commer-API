import { AdminProfile, Category, Product } from "./../domain";

// services/api.service.ts
const CATEGORIES_CACHE_KEY = "cached_categories";
const CACHE_EXPIRATION = 3600000; // 1 hora en milisegundoss

//Cargar perfiles de usuarios
export class ApiService {
  static async fetchAdminProfile(userAdminId: string): Promise<AdminProfile> {
    const response = await fetch(
      `http://localhost:8080/useradmin/profile/${userAdminId}`
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return response.json();
  }

  //Mostrar todos los productos
  static async fetchProducts(): Promise<Product[]> {
    const response = await fetch(
      "http://localhost:8080/product/showallproducts"
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return response.json();
  }

  //Mostrar todos los productos de una categoría
  static async loadCategories(): Promise<Category[]> {
    const cachedData = sessionStorage.getItem(CATEGORIES_CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_EXPIRATION) return data;
    }

    //Cargar todas las categorias
    const response = await fetch(
      "http://localhost:8080/category/showall_categories"
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const newData = await response.json();
    sessionStorage.setItem(
      CATEGORIES_CACHE_KEY,
      JSON.stringify({ data: newData, timestamp: Date.now() })
    );

    return newData;
  }

  //Eliminar una categoría
  static async deleteCategory(
    userAdminId: string,
    categoryId: string
  ): Promise<void> {
    const url = new URL(
      `http://localhost:8080/category/delete_category/${categoryId}`
    );
    url.searchParams.append("UserAdminId", userAdminId);
  
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(await this.getError(response));
  }

  //Crear un nuevo producto
  static async createProduct(
    userAdminId: string,
    productData: any
  ): Promise<Product> {
    const response = await fetch(
      "http://localhost:8080/product/createproduct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          UserAdminId: userAdminId,
        },
        body: JSON.stringify(productData),
      }
    );
    if (!response.ok) throw new Error(await this.getError(response));
    return response.json();
  }

  //Actualizar un producto
  static async updateProduct(
    userAdminId: string,
    productId: string,
    productData: any
  ): Promise<Product> {
    const response = await fetch(
      `http://localhost:8080/product/update_product/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          UserAdminId: userAdminId,
        },
        body: JSON.stringify(productData),
      }
    );
    if (!response.ok) throw new Error(await this.getError(response));
    return response.json();
  }

  //Eliminar un porducto
  static async deleteProduct(
    userAdminId: string,
    productId: string
  ): Promise<void> {
    const response = await fetch(
      `http://localhost:8080/product/delete_product/${productId}`,
      {
        method: "DELETE",
        headers: { UserAdminId: userAdminId },
      }
    );
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