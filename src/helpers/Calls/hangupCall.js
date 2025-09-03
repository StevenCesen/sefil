export default async function hangupCall({phone_number}){
    try {
        const request=await fetch(`hangup.php?exten=${phone_number}&channel=${localStorage.getItem('extension')}`);
        const response=await request.json();
        return true;
    } catch (error) {
        return true;
    }
}