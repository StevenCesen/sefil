export default function useSearchVouchers(string,cartera,setData){
    fetch(`https://sefil.softsen.space/public/api/vouchers/group/${string}?cartera=${cartera}`,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => response.json())  
        .then((data) => {
            setData(data)
        });
}