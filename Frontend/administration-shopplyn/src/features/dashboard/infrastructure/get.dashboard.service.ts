import axios from "axios";
import { Category } from "../domain";

const URL = `${import.meta.env.VITE_API_URL}/`;


const dashboardService = axios.create({
    baseURL: URL,
    withCredentials: true,
})


export const postDashboard = async (data: Category): Promise<any> => {
    try {
        const response = await dashboardService.post<any>("/category", {
            data,
        })
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
        const response = await dashboardService.delete<any>('', {
            params: {
                categoryId: categoryId
            },
        })
        return response.data;
    } catch (error) {
        console.error("Error al elimiar", error)
    } finally {
        console.info("Categoria eliminada")
    }
}