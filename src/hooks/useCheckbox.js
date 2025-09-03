export default function useCheckbox(name,setFilter){
    let inputs=document.getElementsByName(name);
    inputs=Array.apply(null,inputs);

    inputs.map((input)=>{
        if(input.checked){
            fetch(`${import.meta.env.VITE_URL_BASE}/report/pays?${name}=${input.value}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => setFilter(data));
        }
    });
}