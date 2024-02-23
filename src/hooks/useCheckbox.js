export default function useCheckbox(name,setFilter){
    let inputs=document.getElementsByName(name);
    inputs=Array.apply(null,inputs);

    inputs.map((input)=>{
        if(input.checked){
            fetch(`https://sefil.softsen.space/public/api/report/pays?${name}=${input.value}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response) => response.json())  
                .then((data) => setFilter(data));
        }
    });

    // setFilter(value);


}