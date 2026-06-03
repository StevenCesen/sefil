import { apiGet } from "../apiClient";

export default async function getCredit({ credit_id }) {
    try {
        return await apiGet(`/credits/${credit_id}`);
    } catch (error) {
        console.error('Error al obtener crédito:', error);
        return null;
    }
}
