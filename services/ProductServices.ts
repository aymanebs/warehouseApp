import apiClient from "@/config/axios"


export const  findProduct = async (barcode: string)=>{

    try{
        const products = (await apiClient.get('/products')).data;
        const product = products.find((prod) => prod.barcode === barcode)
        return product || null;
    }
    
    catch(error){
        console.error("Failed to find product", error);
        return null;
    }
  
}

export const AddProduct = async(data)=>{
        try{
            await apiClient.post('/products',data);
        }
        catch(error){
            console.error('Failed to insert product',error);
        }
}


// export const UpdateQuantity = async(barcode, newQuantity) =>{
    
//     const product = await findProduct(barcode);

//     await apiClient.patch('/products',)
// }