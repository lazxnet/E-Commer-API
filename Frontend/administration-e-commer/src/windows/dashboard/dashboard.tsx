"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Product, AdminProfile, Category } from "./components/types";
import CategoryModal from "./components/CategoryModal";
import ProductModal from "./components/ProductModal";
import EditProductModal from "./components/EditProductModal";
import Sidebar from "./components/Sidebar";
import ProductCard from "./components/ProductCard";

const CATEGORIES_CACHE_KEY = "cached_categories";
const CACHE_EXPIRATION = 3600000; // 1 hora en milisegundos

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [createProductLoading, setCreateProductLoading] = useState(false);
  const [createProductError, setCreateProductError] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updateProductLoading, setUpdateProductLoading] = useState(false);
  const [updateProductError, setUpdateProductError] = useState("");
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);
  const [deleteProductError, setDeleteProductError] = useState("");

  // Cargar perfil del admin
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const userAdminId = sessionStorage.getItem("userAdminId");
        if (!userAdminId) throw new Error("No se encontró ID de administrador");

        const response = await fetch(
          `http://localhost:8080/useradmin/profile/${userAdminId}`
        );
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data: AdminProfile = await response.json();
        setAdminProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, []);

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/product/showallproducts"
        );
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setProductsError(
          err instanceof Error ? err.message : "Error al cargar productos"
        );
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Cargar categorías con caché
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError("");

      const cachedData = sessionStorage.getItem(CATEGORIES_CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
          setCategoriesList(data);
          return;
        }
      }

      const response = await fetch(
        "http://localhost:8080/category/showall_categories"
      );
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const newData = await response.json();

      sessionStorage.setItem(
        // Corregir aquí
        CATEGORIES_CACHE_KEY,
        JSON.stringify({ data: newData, timestamp: Date.now() })
      ); // <-- Añadir este paréntesis de cierre

      setCategoriesList(newData);
    } catch (err) {
      setCategoriesError(
        err instanceof Error ? err.message : "Error al cargar categorías"
      );
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (showCategoriesModal) loadCategories();
  }, [showCategoriesModal]);

  // Filtrar productos
  useEffect(() => {
    setFilteredProducts(
      selectedCategory === "Todas"
        ? products
        : products.filter(
            (product) => product.category.name === selectedCategory
          )
    );
  }, [selectedCategory, products]);

  const selectCategories = [
    "Todas",
    ...Array.from(
      new Set([
        ...products.map((p) => p.category.name),
        ...categoriesList.map((c) => c.name),
      ])
    ),
  ];

  // Crear producto
  const handleCreateProduct = async (productData: any) => {
    try {
      setCreateProductLoading(true);
      setCreateProductError("");

      const userAdminId = sessionStorage.getItem("userAdminId");
      if (!userAdminId) throw new Error("No se encontró ID de administrador");

      const response = await fetch(
        "http://localhost:8080/product/createproduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            UserAdminId: userAdminId,
          },
          body: JSON.stringify({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            quantity: productData.quantity,
            imageBase64: productData.imageBase64,
            categoryId: productData.categoryId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear producto");
      }

      const newProduct = await response.json();
      setProducts((prev) => [...prev, newProduct]);
      setShowProductModal(false);
    } catch (err) {
      setCreateProductError(
        err instanceof Error ? err.message : "Error desconocido"
      );
    } finally {
      setCreateProductLoading(false);
    }
  };

  // Actualizar producto
  const handleUpdateProduct = async (productData: any) => {
    try {
      setUpdateProductLoading(true);
      setUpdateProductError("");

      const userAdminId = sessionStorage.getItem("userAdminId");
      if (!userAdminId || !editingProduct) throw new Error("Datos incompletos");

      const response = await fetch(
        `http://localhost:8080/product/update_product/${editingProduct.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            UserAdminId: userAdminId,
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar producto");
      }

      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((p) =>
          p.productId === updatedProduct.productId ? updatedProduct : p
        )
      );
      setShowEditModal(false);
    } catch (err) {
      setUpdateProductError(
        err instanceof Error ? err.message : "Error desconocido"
      );
    } finally {
      setUpdateProductLoading(false);
    }
  };

  // Función para eliminar producto
  const handleDeleteProduct = async (productId: string) => {
    try {
      setDeleteProductLoading(true);
      setDeleteProductError("");

      const userAdminId = sessionStorage.getItem("userAdminId");
      if (!userAdminId) throw new Error("No se encontró ID de administrador");

      const response = await fetch(
        `http://localhost:8080/product/delete_product/${productId}`,
        {
          method: "DELETE",
          headers: {
            UserAdminId: userAdminId,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar producto");
      }

      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } catch (err) {
      setDeleteProductError(
        err instanceof Error ? err.message : "Error desconocido"
      );
    } finally {
      setDeleteProductLoading(false);
    }
  };

  // Obtener categorías cacheadas
  const cachedCategories = useMemo(() => {
    const cachedData = sessionStorage.getItem(CATEGORIES_CACHE_KEY);
    return cachedData ? JSON.parse(cachedData).data : [];
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <CategoryModal
        show={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        categoriesList={categoriesList}
        loading={categoriesLoading}
        error={categoriesError}
        loadCategories={loadCategories}
      />

      <ProductModal
        show={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSubmit={handleCreateProduct}
        categories={cachedCategories}
        loading={createProductLoading}
        error={createProductError}
      />

      <EditProductModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateProduct}
        categories={cachedCategories}
        product={editingProduct}
        loading={updateProductLoading}
        error={updateProductError}
      />

      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm max-w-[200px]">
                Error cargando perfil: {error}
              </div>
            ) : (
              <>
                <p className="font-medium">
                  {adminProfile?.fullName || "Administrador"}
                </p>
                <p className="text-sm text-gray-500 break-all">
                  {adminProfile?.email || "admin@example.com"}
                </p>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={selectCategories}
          setShowCategoriesModal={setShowCategoriesModal}
          setShowProductModal={setShowProductModal}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {productsLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4">Cargando productos...</p>
            </div>
          ) : productsError ? (
            <div className="text-red-500 text-center py-10">
              Error: {productsError}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    onEdit={() => {
                      setEditingProduct(product);
                      setShowEditModal(true);
                    }}
                    onDelete={() => {
                      if (confirm("¿Estás seguro de eliminar este producto?")) {
                        handleDeleteProduct(product.productId);
                      }
                    }}
                  />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No hay productos en esta categoría
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
