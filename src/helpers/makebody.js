export default function makebody({message,values}){
    let index = 0;
    const body = message.replace(/\(x\)/g, () => values[index++]);
    return body;
}