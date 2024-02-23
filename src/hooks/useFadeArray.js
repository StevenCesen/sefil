export default function useFadeArray(len){
    const array=[];
    for (let index = 0; index < len; index++) {
        array[index]="";
    }

    return array;
}