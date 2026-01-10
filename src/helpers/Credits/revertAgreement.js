const revertAgreement = async (id) => {
    const url = `${import.meta.env.VITE_URL_BASE}/agreements/revert/${id}`;
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    
    const data = await response.json();
    return data;
};

export default revertAgreement;
