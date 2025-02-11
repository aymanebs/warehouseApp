import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { findProduct } from '@/services/ProductServices';


export default function ProductDetails({ product }) {
  const totalStock = product?.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const {barcodeData} = useLocalSearchParams();

  console.log('barcodeData',barcodeData); 

  useEffect(  () =>{

    const fetchProduct = async ()=>{
      const product = await findProduct(barcodeData);
      console.log("Product:", product);
    } 
    
    fetchProduct();
  },[]);

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <Image 
        source={{ uri: product?.image }} 
        style={styles.image}
        resizeMode="cover"
      />

      {/* Product Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.name}>{product?.name}</Text>
        <View style={styles.basicInfo}>
          <Text style={styles.type}>{product?.type}</Text>
          <Text style={styles.barcode}>#{product?.barcode}</Text>
        </View>

        {/* Price Section */}
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>${product?.price}</Text>
          </View>
          <View>
            <Text style={styles.priceLabel}>Sale Price</Text>
            <Text style={styles.salePrice}>${product?.solde}</Text>
          </View>
          <View>
            <Text style={styles.priceLabel}>Supplier</Text>
            <Text style={styles.supplier}>{product?.supplier}</Text>
          </View>
        </View>

        {/* Total Stock */}
        <LinearGradient
          colors={['#FF9F43', '#FF6B6B']}
          style={styles.totalStockCard}
        >
          <MaterialCommunityIcons name="package-variant" size={24} color="white" />
          <Text style={styles.totalStockText}>Total Stock: {totalStock} units</Text>
        </LinearGradient>

        {/* Stock Locations */}
        <Text style={styles.sectionTitle}>Stock Locations</Text>
        {product?.stocks.map((stock) => (
          <View key={stock.id} style={styles.stockCard}>
            <View style={styles.stockHeader}>
              <Text style={styles.stockName}>{stock.name}</Text>
              <Text style={styles.stockQuantity}>{stock.quantity} units</Text>
            </View>
            <View style={styles.locationInfo}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#687076" />
              <Text style={styles.locationText}>
                {stock.localisation.city} ({stock.localisation.latitude.toFixed(4)}, {stock.localisation.longitude.toFixed(4)})
              </Text>
            </View>
          </View>
        ))}

        {/* Last Edited */}
        <View style={styles.editedInfo}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#687076" />
          <Text style={styles.editedText}>
            Last edited by Warehouseman #{product?.editedBy[0].warehousemanId} on {product?.editedBy[0].at}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  infoCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    padding: 20,
    minHeight: 500,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 10,
  },
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  type: {
    color: '#687076',
    fontSize: 16,
  },
  barcode: {
    color: '#FF9F43',
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceLabel: {
    color: '#687076',
    fontSize: 14,
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  salePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  supplier: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  totalStockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  totalStockText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 15,
  },
  stockCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stockName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11181C',
  },
  stockQuantity: {
    fontSize: 16,
    color: '#FF9F43',
    fontWeight: 'bold',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#687076',
    marginLeft: 5,
  },
  editedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  editedText: {
    color: '#687076',
    marginLeft: 5,
  },
});