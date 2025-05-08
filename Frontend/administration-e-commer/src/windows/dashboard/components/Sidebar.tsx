"use client"
import React from "react"
import { Dispatch, SetStateAction } from "react"

export default function Sidebar({
  selectedCategory,
  setSelectedCategory,
  categories,
  setShowCategoriesModal,
  setShowProductModal
}: {
  selectedCategory: string
  setSelectedCategory: Dispatch<SetStateAction<string>>
  categories: string[]
  setShowCategoriesModal: Dispatch<SetStateAction<boolean>>
  setShowProductModal: Dispatch<SetStateAction<boolean>>
}) {
  return (
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
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <button 
          className="w-full bg-green-200 hover:bg-green-300 text-black rounded-md px-4 py-2"
          onClick={() => setShowProductModal(true)}
        >
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
  )
}