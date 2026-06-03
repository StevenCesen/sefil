import { apiGet } from "../apiClient";

export default async function getListPhones({ client_identification }) {
    try {
        return await apiGet(`/contacts?client_identification=${encodeURIComponent(client_identification)}`);
    } catch (error) {
        console.error('Error al obtener teléfonos:', error);
        return null;
    }
}
