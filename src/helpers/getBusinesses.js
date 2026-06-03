import { apiGet } from "./apiClient";

export default async function getBusinesses() {
    try {
        return await apiGet('/businesses');
    } catch (error) {
        console.error('Error al obtener carteras:', error);
        return null;
    }
}
