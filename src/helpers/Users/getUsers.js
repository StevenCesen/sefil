export default function getUsers() {
    let users=[];

    fetch(`${import.meta.env.VITE_URL_BASE}/users`,{
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => response.json())  
                .then((data) => {
                    users=data;
            });
    return users;
}