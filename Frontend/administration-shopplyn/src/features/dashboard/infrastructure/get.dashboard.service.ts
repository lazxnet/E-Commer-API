import axios from "axios";
import { Category } from "../domain";

const URL = `${import.meta.env.VITE_API_URL}/category`;


const dashboardService = axios.create({
    baseURL: URL,
    withCredentials: true,
})


export const postDashboard = async (name: string, description: string): Promise<Category[]> => {
    try {
        const response = await dashboardService.post<any>("/create_category", {
           params:{
            name,
            description
           } 
        })
        console.log("Categoria creada", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al mostrar las categorias", error);
        throw new Error("Error al mostrar las categorias");
    } finally {
        console.info("Categoria creada")
    }
}

export const deleteDashboard = async (categoryId: string): Promise<any> => {
    try {
        const response = await dashboardService.delete<any>(`/delete_category/${categoryId}`, {
            params: {
                categoryId: categoryId
            },
        })
        console.log("Categoria eliminada", response.data)
        return response.data;
    } catch (error) {
        console.error("Error al eliminar", error)
    } finally {
        console.info("Categoria eliminada")
    }
}