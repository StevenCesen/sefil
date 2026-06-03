import { apiPost } from "./apiClient";

export default async function createPayment({ data }) {
    try {
        return await apiPost('/payments', data);
    } catch (error) {
        return { state: 400, error };
    }
}
