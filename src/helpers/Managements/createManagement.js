import { apiPost } from "../apiClient";

export default async function createManagement({ data_management }) {
    try {
        return await apiPost('/managements', data_management, true);
    } catch (error) {
        return { state: 400, error };
    }
}
