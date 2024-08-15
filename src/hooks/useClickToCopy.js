export default async function useClickToCopy(element){
    try {

        await navigator.clipboard.writeText(element);
        console.log('Content copied to clipboard');

    } catch (err) {

        console.error('Failed to copy: ', err);
    }
}