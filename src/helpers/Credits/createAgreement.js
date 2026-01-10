const createAgreement = async (data) => {
    const url = `${import.meta.env.VITE_URL_BASE}/agreements`;
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    
    const result = await response.json();
    return result;
};

export default createAgreement;
