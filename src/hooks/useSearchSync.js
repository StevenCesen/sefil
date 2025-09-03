export default function useSearchSyncs(string,cartera,setData,setTotal){
    if(string.length>4){
        if(/^[A-Za-z ]+/.test(string)){

            fetch(`${import.meta.env.VITE_URL_BASE}/syncs/index?nombre=${string}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => {
                    setData(data)
                });

        }else{  //Búscamos por número de cédula
            
            if(string.length>5){
                fetch(`${import.meta.env.VITE_URL_BASE}/syncs/index?cedula=${string}`,{
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
            
        }
    }else if(string===''){
        fetch(`${import.meta.env.VITE_URL_BASE}/bussines/${localStorage.getItem('cartera')}`,{
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
