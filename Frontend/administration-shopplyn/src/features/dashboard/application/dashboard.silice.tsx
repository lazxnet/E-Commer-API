"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Product, AdminProfile, Category,  } from "../domain";
import CategoryModal from "./CategoryModal";
import ProductModal from "./ProductModal";
import EditProductModal from "./EditProductModal";
import Sidebar from "./Sidebar";
import ProductCard from "./ProductCard";
import { ApiService } from "../infrastructure";

export default function dashboardSlice() {
  // Estados
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Estados de modales
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  // Estados de categorías
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  // Estados de productos
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  // Estados de operaciones
  const [createProductLoading, setCreateProductLoading] = useState(false);
  const [createProductError, setCreateProductError] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updateProductLoading, setUpdateProductLoading] = useState(false);
  const [updateProductError, setUpdateProductError] = useState("");
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);
  const [deleteProductError, setDeleteProductError] = useState("");
  // Cargar perfil del admin
  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        const userAdminId = sessionStorage.getItem("userAdminId");
        if (!userAdminId) throw new Error("No se encontró ID de administrador");  
        const profile = await ApiService.fetchAdminProfile(userAdminId);
        setAdminProfile(profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    loadAdminProfile();
  }, []);
  // Cargar productos iniciales
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await ApiService.fetchProducts();
        setProducts(productsData);
      } catch (err) {
        setProductsError(err instanceof Error ? err.message : "Error al cargar productos");
      } finally {
        setProductsLoading(false);
      }
    };
    loadProducts();
  }, []);
  // Cargar categorías
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const categories = await ApiService.loadCategories();
      setCategoriesList(categories);
    } catch (err) {
      setCategoriesError(err instanceof Error ? err.message : "Error al cargar categorías");
    } finally {
      setCategoriesLoading(false);
    }
  };
  // Filtrar productos por categoría
  useEffect(() => {
    setFilteredProducts(
      selectedCategory === "Todas"
        ? products
        : products.filter(product => product.category.name === selectedCategory)
    );
  }, [selectedCategory, products]);
  // Lista de categorías para el selector
  const selectCategories = useMemo(() => [
    "Todas",
    ...Array.from(new Set([
      ...products.map(p => p.category.name),
      ...categoriesList.map(c => c.name)
    ]))
  ], [products, categoriesList]);
  // Manejar creación de producto
  const handleCreateProduct = async (productData: any) => {
    try {
      setCreateProductLoading(true);
      const userAdminId = sessionStorage.getItem("userAdminId") || "";
      const newProduct = await ApiService.createProduct(userAdminId, productData);
      setProducts(prev => [...prev, newProduct]);
      setShowProductModal(false);
    } catch (err) {
      setCreateProductError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setCreateProductLoading(false);
    }
  };
  // Manejar actualización de producto
  const handleUpdateProduct = async (productData: any) => {
    try {
      setUpdateProductLoading(true);
      const userAdminId = sessionStorage.getItem("userAdminId") || "";
      if (!editingProduct) throw new Error("Producto no seleccionado");
      const updatedProduct = await ApiService.updateProduct(
        userAdminId,
        editingProduct.productId,
        productData
      );
      setProducts(prev => prev.map(p => 
        p.productId === updatedProduct.productId ? updatedProduct : p
      ));
      setShowEditModal(false);
    } catch (err) {
      setUpdateProductError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setUpdateProductLoading(false);
    }
  };
  // Manejar eliminación de producto
  const handleDeleteProduct = async (productId: string) => {
    try {
      setDeleteProductLoading(true);
      const userAdminId = sessionStorage.getItem("userAdminId") || "";
      await ApiService.deleteProduct(userAdminId, productId);
      setProducts(prev => prev.filter(p => p.productId !== productId));
    } catch (err) {
      setDeleteProductError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setDeleteProductLoading(false);
    }
  };
  // Obtener categorías cacheadas
  const cachedCategories = useMemo(() => {
    return categoriesList;
  }, [categoriesList]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Modales */}
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
      {/* Header */}
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
      {/* Contenido principal */}
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
      {/* Notificaciones */}
      {deleteProductError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {deleteProductError}
        </div>
      )}
      {deleteProductLoading && (
        <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Eliminando producto...
        </div>
      )}
    </div>
  );
}