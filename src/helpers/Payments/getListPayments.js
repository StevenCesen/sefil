import { apiGet } from "../apiClient";

export default async function getListPayments({ credit_id, cartera }) {
    try {
        return await apiGet(`/vouchers/group/${credit_id}?cartera=${encodeURIComponent(cartera)}`);
    } catch (error) {
        console.error('Error al obtener pagos:', error);
        return null;
    }
}
