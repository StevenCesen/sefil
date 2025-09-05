export default async function ClickToCopy({text}){
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {

    }
}