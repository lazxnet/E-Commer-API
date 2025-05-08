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
    <div className="overflow-hidden border-2 rounded-md bg-white relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <button 
          onClick={onEdit}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Editar producto"
        >
          <FiEdit className="text-blue-500 text-xl" />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Eliminar producto"
        >
          <FiTrash2 className="text-red-500 text-xl" />
        </button>
      </div>
      
      <div className="p-4 flex justify-center">
        <img
          src={`data:image/png;base64,${product.imageBase64}`}
          alt={product.name}
          className="object-contain h-[150px] w-[150px]"
        />
      </div>
      
      <div className="border-t-2 p-4">
        <div className="space-y-1">
          <p><span className="font-medium">Nombre:</span> {product.name}</p>
          <p><span className="font-medium">Descripción:</span> {product.description}</p>
          <p><span className="font-medium">Precio:</span> ${product.price.toFixed(2)}</p>
          <p><span className="font-medium">Cantidad:</span> {product.quantity}</p>
          <p><span className="font-medium">Categoría:</span> {product.category.name}</p>
        </div>
      </div>
      
      <div className="border-t-2 p-4">
        <p><span className="font-medium">Administrador:</span> {product.userAdmin.fullName}</p>
        <p><span className="font-medium">Email:</span> {product.userAdmin.email}</p>
      </div>
    </div>
  )
}