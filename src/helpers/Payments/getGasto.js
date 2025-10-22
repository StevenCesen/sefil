export default function getGasto(){
    e.target.textContent='Facturando...';
    if(viewGastos.status===false){
        fetch(`${import.meta.env.VITE_URL_BASE}/credit/savegasto?cartera=${cartera.id}&credito=${param.get('id')}`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
            .then((data) => {
                
            });
    }else{
        
    }
}