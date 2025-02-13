import apiClient from "@/config/axios"
import axios from "axios";


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


export const UpdateQuantity = async(productId: string,stockId: string, newQuantity: number) =>{
    try{
        const product = (await apiClient.get(`products/${productId}`)).data;
        const newStocks = product.stocks.map((stock)=> stock.id == stockId ? {...stock, quantity: newQuantity} : stock);
        const response =  await apiClient.patch(`/products/${productId}`,{stocks: newStocks});
    }
    catch(error){
        console.error('Failed to update product quantity',error);
    }
  
}


export const getAllProducts = async ()=>{
    try{
        const products = (await apiClient.get('/products')).data;
        return products;
    }
    catch(error){
        console.error('Failed to fetch products',error);
    }
}