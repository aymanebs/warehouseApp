import apiClient from "@/config/axios"


export const  findProduct = async (barcode: string)=>{

    const products = (await apiClient.get('/products')).data;
    const productExist = products.filter((prod)=> prod.barcode == barcode);

    if(productExist.length > 0){
        return true;
    }

    return false;
}