import { apiPost } from "./apiClient";

export default async function revertPayment({ paymentId }) {
    try {
        return await apiPost(`/payments/revert/${paymentId}`);
    } catch (error) {
        return { state: 400, error };
    }
}
