export default async function useCondonation(data, btn, setPDF, updateId = null) {
    try {
        const isUpdate = updateId !== null && updateId !== '';
        const url = isUpdate 
            ? `${import.meta.env.VITE_URL_BASE}/condonations/${updateId}`
            : `${import.meta.env.VITE_URL_BASE}/condonations`;
        
        const request = await fetch(url, {
            method: isUpdate ? 'PUT' : 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const response = await request.json();

        if (response.code === 1 && response.result) {
            console.log(response);
            setPDF(response.result);
            btn.textContent = isUpdate ? 'Cambios guardados' : 'Condonación guardada';
            btn.setAttribute('disabled', '');
            return response;
        } else {
            btn.textContent = 'Inténtalo de nuevo';
            btn.removeAttribute('disabled');
            throw new Error(response.message || `Error al ${isUpdate ? 'actualizar' : 'crear'} condonación`);
        }
    } catch (error) {
        console.error(`Error ${updateId ? 'updating' : 'creating'} condonation:`, error);
        btn.textContent = 'Inténtalo de nuevo';
        btn.removeAttribute('disabled');
        throw error;
    }
}