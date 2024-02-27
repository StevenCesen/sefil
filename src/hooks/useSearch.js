export default function useSearch(string,cartera,setData){
    if(string.length>4){
        if(/^[A-Za-z ]+/.test(string) & cartera!==''){
            fetch(`https://sefil.softsen.space/public/api/credit?nombre=${string}&cartera=${cartera}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setData(data)
                });
        }else if(cartera!==''){
            fetch(`https://sefil.softsen.space/public/api/credit?cedula=${string}&cartera=${cartera}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setData(data)
                });
        }else{
            //Buscamos en todas las  carteras
        }
    }else if(string===''){
        console.log('no hay entradas');
        // fetch(`https://sefil.softsen.space/public/api/credit`,{
        //     headers: {
        //         Accept: 'application/json',
        //         Authorization: `Bearer ${localStorage.getItem('token')}`
        //     }
        // })
        //     .then((response) => response.json())  
        //     .then((data) => {
        //         setData(data)
        //     });
    }
}