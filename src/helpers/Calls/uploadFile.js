export default async function uploadFile({data}){
    try {
        const request=await fetch(`upload.php`,{
            method:'POST',
            body:data
        });

        const response=await request.json();
        return response;

    } catch (error) {
        return error;
    }
}