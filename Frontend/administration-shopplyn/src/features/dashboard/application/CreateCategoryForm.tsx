import React from "react"
import { useState } from "react"
import { postDashboard } from './../infrastructure/get.dashboard.service'

interface CategoryProps {
  value: string;
  fetchData: () => Promise<void>;
}

export const CreateCategory: React.FC<CategoryProps> = ({ fetchData, value }) => {
  const [inputValue, setInputValue] = useState(value);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const handleClose = () => setVisible(false);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postDashboard(inputValue, description);
      fetchData();
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error en el servidor");
    } finally {
      setLoading(false);
      console.log("Categoría creada:", inputValue);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  const textChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  return (
    <>
      {visible && (
        <> 
        <h2 className="text-lg font-semibold">Crear Categoría</h2>
          {error && <div className="text-red-500">{error}</div>}
          <form onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={inputValue}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                required
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={description}
                onChange={textChange}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Creando..." : "Crear categoría"}
              </button>
            </div>
          </form> 
        </>
      )}
    </>
  );
};
export default CreateCategory;


