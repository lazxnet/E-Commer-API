import React from 'react';
import { useState } from "react"
import { deleteDashboard } from './../infrastructure/get.dashboard.service'
import { Category,  } from '../domain';

interface DeleteCategoryProps {
  error: string;
  categoriesList: Category[];
  fetchData: () => Promise<void>;
  categoryId: string;
}

export const CategoryModal: React.FC<DeleteCategoryProps> = ({ categoryId, fetchData, categoriesList, error }) => {
  const [showForm, setShowForm] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const handleClose = () => setVisible(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      setDeleteError("");
      setDeletingId(categoryId);
      await deleteDashboard(categoryId);
      await fetchData();
      handleClose();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {visible && (
        <>
          <div className="flex-1 overflow-y-auto p-6">
            <button
              className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
              onClick={() => setShowForm(true)}
            >
              Abrir formulario
            </button>
            {showForm ? (
              <div>
                <button
                  className="mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  onClick={() => setShowForm(true)}
                >
                  Cerrar formulario
                </button>
              </div>
            ) : (
              <>
                {deleteError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{deleteError}</span>
                  </div>
                )}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Cargando categorías...</p>
                  </div>
                ) : error ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                ) : categoriesList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No se encontraron categorías</p>
                    <p className="text-gray-400 mt-2">Presiona el botón para crear una nueva</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {categoriesList.map(category => (
                      <div 
                        key={category.categoryId} 
                        className="group border rounded-xl p-5 relative transition-all hover:border-indigo-100 hover:bg-indigo-50/30"
                      >
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={handleDelete}
                            disabled={deletingId === category.categoryId}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed p-1.5 rounded-md hover:bg-red-50 transition-colors"
                            aria-label="Eliminar categoría"
                          >
                            {deletingId === category.categoryId ? (
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            )}
                          </button>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-100 text-blue-600 rounded-lg p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-800">{category.name}</h4>
                            <p className="text-gray-600 mt-1 text-sm">{category.description}</p>
                            <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5">
                              <p className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span>{category.delete.fullName}</span>
                              </p>
                              <p className="flex items-center gap-2 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span>{category.delete.email}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default CategoryModal;


