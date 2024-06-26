export default function useSearch(string,cartera,setData,setTotal){
    if(string.length>4){
        if(/^[A-Za-z ]+/.test(string)){
            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/filter?nombre=${string}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setData(data.data)
                });
        }else{
            fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit/filter?cedula=${string}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setData(data.data)
                });
        }
    }else if(string===''){
        fetch(`${import.meta.env.VITE_URL_BASE}/public/api/credit?cartera=SEFIL_1`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                setTotal(data)
            });
    }
}

// if(string.length>4){
//     if(/^[A-Za-z ]+/.test(string) & cartera!==''){
//         fetch(`https://sefil.softsen.space/public/api/credit?nombre=${string}&cartera=${cartera}`,{
//             headers: {
//                 Accept: 'application/json',
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//         })
//             .then((response) => response.json())  
//             .then((data) => {
//                 setData(data)
//             });
//     }else if(cartera!==''){
//         fetch(`https://sefil.softsen.space/public/api/credit?cedula=${string}&cartera=${cartera}`,{
//             headers: {
//                 Accept: 'application/json',
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//         })
//             .then((response) => response.json())  
//             .then((data) => {
//                 setData(data)
//             });
//     }else{
//         //Buscamos en todas las  carteras
//     }
// }else if(string===''){
//     fetch(`https://sefil.softsen.space/public/api/credit?cartera=${cartera}`,{
//         headers: {
//             Accept: 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//     })
//         .then((response) => response.json())  
//         .then((data) => {
//             setData(data)
//         });
// }