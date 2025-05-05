"use client"
import React, { useState, useEffect } from "react"
import { Product, AdminProfile, Category } from "./components/types"
import CategoryModal from "./components/CategoryModal"
import Sidebar from "./components/Sidebar"
import ProductCard from "./components/ProductCard"

const CATEGORIES_CACHE_KEY = "cached_categories"
const CACHE_EXPIRATION = 3600000 // 1 hora en milisegundos

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [categoriesList, setCategoriesList] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesError, setCategoriesError] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState("")

  // Cargar perfil del admin
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const userAdminId = sessionStorage.getItem("userAdminId")
        if (!userAdminId) throw new Error("No se encontró ID de administrador")
        
        const response = await fetch(`http://localhost:8080/useradmin/profile/${userAdminId}`)
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
        
        const data: AdminProfile = await response.json()
        setAdminProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }
    fetchAdminProfile()
  }, [])

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/product/showallproducts")
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setProductsError(err instanceof Error ? err.message : "Error al cargar productos")
      } finally {
        setProductsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Cargar categorías con caché
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true)
      setCategoriesError("")

      const cachedData = sessionStorage.getItem(CATEGORIES_CACHE_KEY)
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData)
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
          setCategoriesList(data)
          return
        }
      }

      const response = await fetch("http://localhost:8080/category/showall_categories")
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
      
      const newData = await response.json()
      
      sessionStorage.setItem(
        CATEGORIES_CACHE_KEY, 
        JSON.stringify({ data: newData, timestamp: Date.now() })
      )
      
      setCategoriesList(newData)
    } catch (err) {
      setCategoriesError(err instanceof Error ? err.message : "Error al cargar categorías")
    } finally {
      setCategoriesLoading(false)
    }
  }

  useEffect(() => {
    if (showCategoriesModal) loadCategories()
  }, [showCategoriesModal])

  // Filtrar productos
  useEffect(() => {
    setFilteredProducts(
      selectedCategory === "Todas" 
        ? products 
        : products.filter(product => product.category.name === selectedCategory)
    )
  }, [selectedCategory, products])

  const selectCategories = [
    "Todas",
    ...Array.from(new Set([
      ...products.map(p => p.category.name),
      ...categoriesList.map(c => c.name)
    ]))
  ]

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
                <p className="font-medium">{adminProfile?.fullName || "Administrador"}</p>
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
                {filteredProducts.map(product => (
                  <ProductCard key={product.productId} product={product} />
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
  )
}