const getAgreements = async ({credit_id}) => {
    const url = `${import.meta.env.VITE_URL_BASE}/agreements?credit_id=${credit_id}`;
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });
    
    const data = await response.json();
    return data;
};

export default getAgreements;
