import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { findProduct, UpdateQuantity } from '@/services/ProductServices';
import generateProductReport from '@/services/GenerateProductReport';

const QuantityAdjuster = ({ stock, onUpdate }) => {
  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity 
        style={styles.quantityButton}
        onPress={() => onUpdate(stock.id, stock.quantity - 1)}
      >
        <MaterialCommunityIcons name="minus" size={20} color="#FF9F43" />
      </TouchableOpacity>
      
      <Text style={styles.quantityText}>{stock.quantity}</Text>
      
      <TouchableOpacity 
        style={styles.quantityButton}
        onPress={() => onUpdate(stock.id, stock.quantity + 1)}
      >
        <MaterialCommunityIcons name="plus" size={20} color="#FF9F43" />
      </TouchableOpacity>
    </View>
  );
};

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { barcodeData } = useLocalSearchParams();
  
  const totalStock = product?.stocks.reduce((sum, stock) => sum + stock.quantity, 0);

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await findProduct(barcodeData);
      setProduct(product);
    };
    
    fetchProduct();
  }, []);

  const handleQuantityUpdate = async (stockId, newQuantity) => {
    if (newQuantity < 0) {
      return;
    }

    setIsUpdating(true);
    try {
      UpdateQuantity(product.id,stockId,newQuantity);
  
      setProduct(prevProduct => ({
        ...prevProduct,
        stocks: prevProduct.stocks.map(stock => 
          stock.id === stockId ? { ...stock, quantity: newQuantity } : stock
        )
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: product?.image }} 
        style={styles.image}
        resizeMode="cover"
      />   
      <View style={styles.infoCard}>

      <TouchableOpacity 
        style={styles.printButton}
        onPress={() => product && generateProductReport(product)}
      >
        <MaterialCommunityIcons name="file-pdf-box" size={24} color="#FF9F43" />
        <Text style={styles.printButtonText}>Export Report</Text>
      </TouchableOpacity>

        <Text style={styles.name}>{product?.name}</Text>
        <View style={styles.basicInfo}>
          <Text style={styles.type}>{product?.type}</Text>
          <Text style={styles.barcode}>#{product?.barcode}</Text>
      </View>

        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>${product?.price}</Text>
          </View>
          <View>
            <Text style={styles.priceLabel}>Supplier</Text>
            <Text style={styles.supplier}>{product?.supplier}</Text>
          </View>
        </View>

        <LinearGradient
          colors={['#FF9F43', '#FF6B6B']}
          style={styles.totalStockCard}
        >
          <MaterialCommunityIcons name="package-variant" size={24} color="white" />
          <Text style={styles.totalStockText}>Total Stock: {totalStock} units</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Stock Locations</Text>
        {product?.stocks.map((stock) => (
          <View key={stock.id} style={styles.stockCard}>
            <View style={styles.stockHeader}>
              <Text style={styles.stockName}>{stock.name}</Text>
            </View>
            
            <View style={styles.stockDetails}>
              <View style={styles.locationInfo}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#687076" />
                <Text style={styles.locationText}>{stock.localisation.city}</Text>
              </View>
              
              <QuantityAdjuster 
                stock={stock}
                onUpdate={handleQuantityUpdate}
              />
            </View>
          </View>
        ))}

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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  quantityButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#FFF5EC',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#11181C',
  },
  stockDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
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
  printButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  printButtonText: {
    color: '#FF9F43',
    marginLeft: 8,
    fontWeight: '600',
  },
});