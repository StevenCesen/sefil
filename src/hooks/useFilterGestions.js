export default function useFilterGestions({
    state,
    substate,
    observation,
    promise_date,
    created_by,
    days_past_due,
    paid_fees,
    pending_fees,
    client_id,
    client_name,
    client_ci,
    credit_id,
    campain_id,
    created_at,
    client_type,
    setData,
    loader,
    fetchWithAuth
}) {
    let filters = "";
    loader(true);

    // Nuevos parámetros según el backend
    if (state !== "") {
        filters += `&state=${state}`;
    }

    if (substate !== "") {
        filters += `&substate=${substate}`;
    }

    if (observation !== "") {
        filters += `&observation=${observation}`;
    }

    if (promise_date !== "") {
        filters += `&promise_date=${promise_date}`;
    }

    if (created_by !== "") {
        filters += `&created_by=${created_by}`;
    }

    if (days_past_due !== "") {
        filters += `&days_past_due=${days_past_due}`;
    }

    if (paid_fees !== "") {
        filters += `&paid_fees=${paid_fees}`;
    }

    if (pending_fees !== "") {
        filters += `&pending_fees=${pending_fees}`;
    }

    if (client_id !== "") {
        filters += `&client_id=${client_id}`;
    }

    if (client_name !== "") {
        filters += `&client_name=${client_name}`;
    }

    if (client_ci !== "") {
        filters += `&client_ci=${client_ci}`;
    }

    if (credit_id !== "" && credit_id !== undefined) {
        filters += `&credit_id=${credit_id}`;
    }

    if (campain_id !== "") {
        filters += `&campain_id=${campain_id}`;
    }

    if (created_at !== "") {
        filters += `&created_at=${created_at}`;
    }

    if (client_type !== "") {
        filters += `&client_type=${client_type}`;
    }

    filters = filters.substring(1);

    fetchWithAuth(`${import.meta.env.VITE_URL_BASE}/managements?${filters}`)
        .then((response) => {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/';
                return;
            }
            return response.json();
        })
        .then((data) => {
            if (!data) return;

            const result = data.result;

            if (result.links.next !== null) {
                result.links.next += `&${filters}`;
            }

            if (result.links.prev !== null) {
                result.links.prev += `&${filters}`;
            }

            setData(result);
            loader(false);
        })
        .catch((error) => {
            console.error('Error filtering managements:', error);
            loader(false);
        });
}