import { apiPatch } from "../apiClient";

export default async function toggleContactStatus(contactId, newStatus) {
    return apiPatch(`/contacts/${contactId}`, { phone_status: newStatus });
}
