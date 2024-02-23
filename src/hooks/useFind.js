export default function useFind({data_products,id}){
    let indices = [];

    data_products.map(product=>{
        const idx = product.category.indexOf(id);
        
        if(idx != -1) {
            indices.push(product);
        }
    });

    return indices;
}