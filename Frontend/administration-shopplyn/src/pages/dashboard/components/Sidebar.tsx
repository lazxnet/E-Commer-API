"use client";
import React from "react";
import { Dispatch, SetStateAction } from "react";
import {
  FiPlusCircle,
  FiFolder,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";

export default function Sidebar({
  selectedCategory,
  setSelectedCategory,
  categories,
  setShowCategoriesModal,
  setShowProductModal,
}: {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  categories: string[];
  setShowCategoriesModal: Dispatch<SetStateAction<boolean>>;
  setShowProductModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <aside className="w-64 border-r p-6 flex flex-col justify-between bg-white shadow-xl">
      <div className="space-y-8">
        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Selector de categorías - Versión esencial */}
          <div className="relative w-full gap-3 p-3 text-gray-600 hover:text-blue-600 font-medium rounded-xl 
                        hover:bg-blue-50 transition-all duration-200 group">
            <label
              htmlFor="category-select"
              className="block text-xs text-gray-500/90 mb-1"
            >
              Filtrar por categoría
            </label>

            <div className="relative">
              <select
                id="category-select"
                className="w-full px-3 py-2 border rounded-md 
                bg-white text-gray-800 text-sm
                focus:outline-none focus:ring-1 focus:ring-gray-300
                transition-[border-color] duration-100"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="checked:bg-gray-100"
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              className="w-full flex items-center gap-3 p-3 text-gray-600 hover:text-blue-600 font-medium rounded-xl 
                        hover:bg-blue-50 transition-all duration-200 group"
              onClick={() => setShowProductModal(true)}
            >
              <FiPlusCircle className="text-xl text-blue-500 group-hover:text-blue-600 transition-colors" />
              <span className="text-sm">Nuevo Producto</span>
            </button>

            <button
              className="w-full flex items-center gap-3 p-3 text-gray-600 hover:text-purple-600 font-medium rounded-xl 
                        hover:bg-purple-50 transition-all duration-200 group"
              onClick={() => setShowCategoriesModal(true)}
            >
              <FiFolder className="text-xl text-purple-500 group-hover:text-purple-600 transition-colors" />
              <span className="text-sm">Categorías</span>
            </button>
          </div>
        </div>
      </div>

      {/* Botón de cierre de sesión */}
      <button
        className="w-full flex items-center justify-center gap-2 p-3 text-gray-500 hover:text-red-600 
                        rounded-xl hover:bg-red-50 transition-all duration-200 group"
      >
        <FiLogOut className="text-lg group-hover:translate-x-1 transition-transform" />
        <span className="text-sm">Cerrar Sesión</span>
      </button>
    </aside>
  );
}
