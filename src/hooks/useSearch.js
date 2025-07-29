export default function useSearch(string,cartera,setData,setTotal){
    if(string.length>4){
        if(/^[A-Za-z ]+/.test(string)){

            fetch(`${import.meta.env.VITE_URL_BASE}/credit/filter?nombre=${string}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setData(data.data)
                });

        }else{  //Búscamos por número de cédula
            
            if(string.length>5){
                fetch(`${import.meta.env.VITE_URL_BASE}/credit/filter?cedula=${string}`,{
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
            
        }
    }else if(string===''){
        fetch(`${import.meta.env.VITE_URL_BASE}/credit?cartera=SEFIL_1`,{
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