"use client"
import React, { useState, useEffect } from "react"
import { Product, AdminProfile, Category } from "./components/types"
import CategoryModal from "./components/CategoryModal"
import Sidebar from "./components/Sidebar"
import ProductCard from "./components/ProductCard"

const CATEGORIES_CACHE_KEY = "cached_categories"
const CACHE_EXPIRATION = 3600000 // 1 hora en milisegundos

const products: Product[] = [
  {
    id: 1,
    productName: "Auriculares Pro",
    productDescription: "Auriculares inalámbricos de alta calidad",
    price: 99.99,
    quantity: 50,
    category: "Audio",
    userAdmin: "Admin",
    email: "admin@example.com",
  },
  {
    id: 2,
    productName: "Auriculares Premium",
    productDescription: "Auriculares con cancelación de ruido",
    price: 149.99,
    quantity: 30,
    category: "Audio",
    userAdmin: "Admin",
    email: "admin@example.com",
  },
  {
    id: 3,
    productName: "Auriculares Gaming",
    productDescription: "Auriculares para gaming con micrófono",
    price: 79.99,
    quantity: 45,
    category: "Gaming",
    userAdmin: "Admin",
    email: "admin@example.com",
  },
  {
    id: 4,
    productName: "Auriculares Deportivos",
    productDescription: "Auriculares resistentes al agua para deportes",
    price: 59.99,
    quantity: 60,
    category: "Deportes",
    userAdmin: "Admin",
    email: "admin@example.com",
  },
  {
    id: 5,
    productName: "Auriculares Estudio",
    productDescription: "Auriculares profesionales para estudio",
    price: 199.99,
    quantity: 15,
    category: "Profesional",
    userAdmin: "Admin",
    email: "admin@example.com",
  },
  {
    id: 6,
    productName: "Auriculares Infantiles",
    productDescription: "Auriculares seguros para niños",
    price: 39.99,
    quantity: 75,
    category: "Infantil",
    userAdmin: "Admin",
    email: "admin@example.com",
  },
  {
    id: 7,
    productName: "Auriculares Bluetooth",
    productDescription: "Auriculares con conexión Bluetooth 5.0",
    price: 89.99,
    quantity: 40,
    category: "Audio",
    userAdmin: "Admin",
    email: "admin@example.com",
  },
  {
    id: 8,
    productName: "Auriculares DJ",
    productDescription: "Auriculares profesionales para DJ",
    price: 179.99,
    quantity: 20,
    category: "Profesional",
    userAdmin: "Admin",
    email: "admin@example.com",
  },
]


export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [categoriesList, setCategoriesList] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesError, setCategoriesError] = useState("")

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

  // Cargar categorías con caché (corregido)
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
      
      // Corrección de sintaxis en sessionStorage
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

  // Filtrar productos (corregido)
  useEffect(() => {
    setFilteredProducts(
      selectedCategory === "Todas" 
        ? products 
        : products.filter(product => product.category === selectedCategory)
    ) // Paréntesis de cierre añadido
  }, [selectedCategory])

  const selectCategories = [
    "Todas",
    ...Array.from(new Set([
      ...products.map(p => p.category),
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No hay productos en esta categoría
            </div>
          )}
        </main>
      </div>
    </div>
  )
}