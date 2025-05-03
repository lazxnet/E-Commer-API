"use client"

import React from "react"
import { useState, useEffect } from "react"

type Product = {
  id: number
  productName: string
  productDescription: string
  price: number
  quantity: number
  category: string
  userAdmin: string
  email: string
}

type AdminProfile = {
  fullName: string
  email: string
}

type Category = {
  categoryId: string
  name: string
  description: string
  userAdmin: {
    email: string
    fullName: string
  }
}

// Datos de ejemplo con más productos y categorías
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

const CATEGORIES_CACHE_KEY = "cached_categories"
const CACHE_EXPIRATION = 3600000 // 1 hora en milisegundos

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

  // Cargar categorías con caché
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true)
      setCategoriesError("")

      // Verificar caché
      const cachedData = sessionStorage.getItem(CATEGORIES_CACHE_KEY)
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData)
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
          setCategoriesList(data)
          return
        }
      }

      // Fetch nuevas categorías
      const response = await fetch("http://localhost:8080/category/showall_categories")
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
      
      const newData = await response.json()
      
      // Actualizar caché
      sessionStorage.setItem(CATEGORIES_CACHE_KEY, 
        JSON.stringify({ data: newData, timestamp: Date.now() })
      )
      
      setCategoriesList(newData)
    } catch (err) {
      setCategoriesError(err instanceof Error ? err.message : "Error al cargar categorías")
    } finally {
      setCategoriesLoading(false)
    }
  }

  // Cargar categorías al abrir el modal
  useEffect(() => {
    if (showCategoriesModal) loadCategories()
  }, [showCategoriesModal])

  // Filtrar productos
  useEffect(() => {
    if (selectedCategory === "Todas") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory))
    }
  }, [selectedCategory])

  // Generar opciones para el select
  const selectCategories = [
    "Todas",
    ...Array.from(new Set([
      ...products.map(p => p.category),
      ...categoriesList.map(c => c.name)
    ]))
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Modal de Categorías */}
      {showCategoriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Todas las categorías</h3>
                <button 
                  onClick={() => setShowCategoriesModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              {categoriesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2">Cargando categorías...</p>
                </div>
              ) : categoriesError ? (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                  Error: {categoriesError}
                </div>
              ) : categoriesList.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No hay categorías registradas
                </div>
              ) : (
                <div className="grid gap-4">
                  {categoriesList.map(category => (
                    <div key={category.categoryId} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-lg">{category.name}</h4>
                      <p className="text-gray-600 mt-1">{category.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Creado por: {category.userAdmin.fullName}</p>
                        <p>Email: {category.userAdmin.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
        <aside className="w-64 border-r p-4 flex flex-col justify-between bg-gray-50">
          <div className="space-y-4">
            <div className="w-full">
              <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">
                Mostrar por categorías
              </label>
              <select
                id="category-select"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {selectCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <button className="w-full bg-green-200 hover:bg-green-300 text-black rounded-md px-4 py-2">
              Crear producto
            </button>
            
            <button 
              className="w-full bg-blue-200 hover:bg-blue-300 text-black rounded-md px-4 py-2"
              onClick={() => setShowCategoriesModal(true)}
            >
              Mostrar categorías
            </button>
          </div>
          
          <button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 mt-auto">
            Cerrar Sesión
          </button>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-500">No hay productos en esta categoría</div>
          )}
        </main>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden border-2 rounded-md bg-white">
      <div className="p-4 flex justify-center">
        <img
          src="/placeholder.svg?height=150&width=150"
          alt="Headphones"
          className="object-contain h-[150px] w-[150px]"
        />
      </div>
      <div className="border-t-2 p-4">
        <div className="space-y-1">
          <p><span className="font-medium">productName:</span> {product.productName}</p>
          <p><span className="font-medium">productDescription:</span> {product.productDescription}</p>
          <p><span className="font-medium">price:</span> {product.price}</p>
          <p><span className="font-medium">quantity:</span> {product.quantity}</p>
          <p><span className="font-medium">category:</span> {product.category}</p>
        </div>
      </div>
      <div className="border-t-2 p-4">
        <p><span className="font-medium">userAdmin:</span> {product.userAdmin}</p>
        <p><span className="font-medium">email:</span> {product.email}</p>
      </div>
    </div>
  )
}