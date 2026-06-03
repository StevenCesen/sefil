import { apiDelete } from "../apiClient";

export default async function deleteContact({ id, client_identification }) {
    const qs = client_identification ? `?client_identification=${encodeURIComponent(client_identification)}` : '';
    try {
        return await apiDelete(`/contacts/${id}${qs}`);
    } catch (error) {
        console.error('Error al eliminar contacto:', error);
        return null;
    }
}
