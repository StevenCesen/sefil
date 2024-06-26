export default function useUpdateCredit(cartera,credit,setCredit){
    fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/view?cartera=${cartera}&credit=${credit}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setCredit(data);
            });
}