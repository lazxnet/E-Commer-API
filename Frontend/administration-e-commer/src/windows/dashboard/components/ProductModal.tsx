"use client"
import React, { useState } from "react"
import { Category } from "./types"

export default function ProductModal({
  show,
  onClose,
  onSubmit,
  categories,
  loading,
  error,
}: {
  show: boolean
  onClose: () => void
  onSubmit: (productData: any) => void
  categories: Category[]
  loading: boolean;
  error?: string;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [localError, setLocalError] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!imagePreview) {
      setLocalError("Debes subir una imagen")
      return
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      imageBase64: imagePreview?.split(",")[1] || "",
      categoryId: formData.categoryId
    }

    onSubmit(productData)
  }

  return show ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Producto</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border rounded p-2"
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-20 w-20 object-contain"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Precio</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cantidad</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {(localError || error) && (
            <p className="text-red-500 text-sm">{localError || error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null
}