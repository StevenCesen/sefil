export default function useSearch(string,setData){
    if(string.length>4){
        if(/^[A-Za-z ]+/.test(string)){
            fetch(`https://sefil.softsen.space/public/api/credit?nombre=${string}`,{
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
            fetch(`https://sefil.softsen.space/public/api/credit?cedula=${string}`,{
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
    }else if(string===''){
        fetch(`https://sefil.softsen.space/public/api/credit`,{
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