"use client"
import React from "react"
import { Product } from "./types"
import { FiEdit, FiTrash2 } from "react-icons/fi"

export default function ProductCard({ 
  product, 
  onEdit, 
  onDelete 
}: { 
  product: Product 
  onEdit: () => void 
  onDelete: () => void 
}) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Contenido principal */}
      <div className="p-4">
        <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50">
          <img
            src={`data:image/png;base64,${product.imageBase64}`}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">{product.name}</h3>
            <span className="flex-shrink-0 px-2.5 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          {product.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Sección unida de stock y categoría */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex gap-4 text-sm"> {/* Cambiado a flex y gap reducido */}
          <div className="flex items-center">
            <span className="font-medium text-gray-600 mr-1">Stock:</span>
            <span className={product.quantity > 0 ? "text-green-600" : "text-red-600"}>
              {product.quantity}
            </span>
          </div>
          <div className="flex items-center truncate">
            <span className="font-medium text-gray-600 mr-1">Categoría:</span>
            <span className="truncate">{product.category.name}</span>
          </div>
        </div>
      </div>

      {/* Sección del administrador con botones */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-800">
                {product.userAdmin.fullName[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{product.userAdmin.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{product.userAdmin.email}</p>
            </div>
          </div>

          <div className="flex gap-2 ml-2">
            <button 
              onClick={onEdit}
              className="p-1.5 bg-white border border-gray-200 shadow-sm rounded-md hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
              aria-label="Editar producto"
            >
              <FiEdit className="text-lg" />
            </button>
            <button 
              onClick={onDelete}
              className="p-1.5 bg-white border border-gray-200 shadow-sm rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
              aria-label="Eliminar producto"
            >
              <FiTrash2 className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}