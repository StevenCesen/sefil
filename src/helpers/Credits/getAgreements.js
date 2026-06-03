import { apiGet } from "../apiClient";

export default async function getAgreements({ credit_id }) {
    try {
        return await apiGet(`/agreements?credit_id=${credit_id}`);
    } catch (error) {
        console.error('Error al obtener convenios:', error);
        return { code: -1, message: 'Error al obtener convenios', result: [] };
    }
}
