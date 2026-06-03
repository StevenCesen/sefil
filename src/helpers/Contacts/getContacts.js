import { apiGet } from "../apiClient";

export default async function getContacts(client_ci) {
    try {
        return await apiGet(`/contacts?client_ci=${encodeURIComponent(client_ci)}`);
    } catch (error) {
        console.error('Error al obtener contactos:', error);
        throw error;
    }
}
