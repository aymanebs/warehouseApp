import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAllProducts } from '@/services/ProductServices';

const ProductList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState([]);
  const [showSortModal, setShowSortModal] = useState(false);

  useEffect(()=>{

    async function fetchProducts(){
        const data = await getAllProducts();
        setProducts(data);
    }
    fetchProducts();
  },[])

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'low-stock', label: 'Low Stock' },
    { id: 'out-stock', label: 'Out of Stock' },
  ];

  const sortOptions = [
    { id: 'name', label: 'Name' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'stock', label: 'Stock Level' },
  ];

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleSort = (sortOption) => {
    setSortBy(sortOption);
    setShowSortModal(false);
  };

  const filteredProducts = products.map(product=>{
    const totalStock = product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0);

    return {...product,totalStock};
    
  }).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeFilter) {
      case 'low-stock':
        return matchesSearch && product.totalStock < 10 && product.totalStock > 0;
      case 'out-stock':
        return matchesSearch && product.totalStock === 0;
      default:
        return matchesSearch;
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'stock':
        return b.totalStock - a.totalStock;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const renderProductCard = useCallback(({ item }) =>{  
    
    return(
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/ProductDetails', params: { barcodeData: item.barcode } })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.productType}>{item.type}</Text>
        <View style={styles.stockInfo}>
          <MaterialCommunityIcons 
            name="package-variant" 
            size={16} 
            color={item.totalStock > 10 ? '#22c55e' : item.totalStock > 0 ? '#f59e0b' : '#ef4444'} 
          />
          <Text style={styles.stockText}>{item.totalStock} in stock</Text>
        </View>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#687076" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

      </View>

      <View style={styles.filterSection}>
        <ScrollView
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.activeFilterChip
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter.id && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Text style={styles.sortButtonText}>
              {sortOptions.find(option => option.id === sortBy)?.label}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#687076" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  sortBy === option.id && styles.activeSortOption
                ]}
                onPress={() => handleSort(option.id)}
              >
                <Text style={[
                  styles.sortOptionText,
                  sortBy === option.id && styles.activeSortOptionText
                ]}>
                  {option.label}
                </Text>
                {sortBy === option.id && (
                  <MaterialCommunityIcons name="check" size={20} color="#FF9F43" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    header: {
      flexDirection: 'row',
      padding: 16,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      alignItems: 'center',
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      padding: 8,
      marginRight: 12,
      alignItems: 'center',
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: '#11181C',
    },
    filterSection: {
      backgroundColor: 'white',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    filterScroll: {
      paddingHorizontal: 16,
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#f8f9fa',
      borderRadius: 20,
      marginRight: 8,
    },
    activeFilterChip: {
      backgroundColor: '#ff512f',
    },
    filterText: {
      color: '#687076',
      fontSize: 14,
      fontWeight: '500',
    },
    activeFilterText: {
      color: 'white',
    },
    sortContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 12,
    },
    sortLabel: {
      color: '#687076',
      marginRight: 8,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    sortButtonText: {
      color: '#11181C',
      marginRight: 4,
    },
    productList: {
      padding: 16,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    productName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#11181C',
      flex: 1,
      marginRight: 8,
    },
    productPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FF9F43',
    },
    cardBody: {
      gap: 4,
    },
    productType: {
      color: '#687076',
      fontSize: 14,
    },
    stockInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    stockText: {
      color: '#687076',
      fontSize: 14,
    },
    location: {
      color: '#687076',
      fontSize: 14,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 12,
      width: '80%',
      padding: 16,
    },
    sortOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    sortOptionText: {
      fontSize: 16,
      color: '#11181C',
    },
    activeSortOption: {
      backgroundColor: '#fff',
    },
    activeSortOptionText: {
      color: '#FF9F43',
      fontWeight: '500',
    },

  });

export default ProductList;