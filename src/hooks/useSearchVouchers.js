export default function useSearchVouchers(string,cartera,setData){
    fetch(`${import.meta.env.VITE_URL_BASE}/vouchers/group/${string}?cartera=${cartera}`,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => response.json())  
        .then((data) => {
            if(data.length>0){
                setData(data);
            }else{
                setData([]);
            }
        });
}