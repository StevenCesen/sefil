import { apiGet } from "../apiClient";

export default async function getCondonations({ credit_id }) {
    try {
        return await apiGet(`/condonations?credit_id=${credit_id}`);
    } catch (error) {
        console.error('Error al obtener condonaciones:', error);
        return { code: -1, message: 'Error al obtener condonaciones', result: [] };
    }
}
