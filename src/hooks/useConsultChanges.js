export default function useConsultChanges(url){
    fetch(url,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => response.json()) 
        .then((data) => {
            return data;
        });
}