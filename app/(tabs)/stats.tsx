import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, SafeAreaView, Platform, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAllProducts } from '@/services/ProductServices';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'view-dashboard-outline' },
  { id: 'distribution', label: 'Distribution', icon: 'chart-pie' },
  { id: 'stock', label: 'Stock Analysis', icon: 'chart-bar' }
];

const COLORS = ['#FF6B6B', '#FF8E53', '#FF512F', '#F09819', '#FF3366'];

export default function Stats() {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function fetchProducts() {
      const data = await getAllProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  // Calculate stats
  const totalProducts = products.length;
  const totalStock = products.reduce((total, product) => {
    return total + (product.stocks ? product.stocks.reduce((sum, stock) => sum + stock.quantity, 0) : 0);
  }, 0);

  const totalCities = (() => {
    const cities = new Set();
    products.forEach(product => {
      product.stocks?.forEach(stock => {
        if (stock.localisation?.city) {
          cities.add(stock.localisation.city);
        }
      });
    });
    return cities.size;
  })();

  // Calculate distribution data
  const typeDistribution = products.reduce((acc, product) => {
    const type = product.type || 'Unspecified';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Calculate stock by city
  const cityStocks = products.reduce((acc, product) => {
    product.stocks?.forEach(stock => {
      if (stock.localisation?.city) {
        acc[stock.localisation.city] = (acc[stock.localisation.city] || 0) + stock.quantity;
      }
    });
    return acc;
  }, {});

  const stats = [
    { 
      title: 'Total Products', 
      value: totalProducts, 
      icon: 'package-variant-closed', 
      gradient: ['#FF6B6B', '#FF8E53'],
      detail: 'Active products in catalog' 
    },
    { 
      title: 'Total Stock', 
      value: totalStock, 
      icon: 'archive', 
      gradient: ['#FF512F', '#F09819'],
      detail: 'Units currently in warehouse' 
    },
    { 
      title: 'Cities Coverage', 
      value: totalCities, 
      icon: 'city', 
      gradient: ['#FF3366', '#FF7B54'],
      detail: 'Distribution centers' 
    }
  ];

  const DistributionChart = () => {
    const entries = Object.entries(typeDistribution);
    const total = entries.reduce((sum, [_, value]) => sum + value, 0);

    return (
      <View style={styles.chartWrapper}>
        <View style={styles.distributionContainer}>
          {entries.map(([name, value], index) => {
            const percentage = (value / total) * 100;
            return (
              <View key={name} style={styles.distributionItem}>
                <View style={styles.distributionBar}>
                  <LinearGradient
                    colors={[COLORS[index % COLORS.length], COLORS[(index + 1) % COLORS.length]]}
                    style={[styles.distributionFill, { width: `${percentage}%` }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
                <View style={styles.distributionLabel}>
                  <Text style={styles.distributionText}>{name}</Text>
                  <Text style={styles.distributionValue}>{value} ({percentage.toFixed(1)}%)</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const StockChart = () => {
    const entries = Object.entries(cityStocks);
    const maxValue = Math.max(...entries.map(([_, value]) => value));

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartWrapper}>
        <View style={styles.stockContainer}>
          {entries.map(([city, stock], index) => {
            const percentage = (stock / maxValue) * 100;
            return (
              <View key={city} style={styles.stockItem}>
                <View style={styles.stockBarContainer}>
                  <LinearGradient
                    colors={[COLORS[index % COLORS.length], COLORS[(index + 1) % COLORS.length]]}
                    style={[styles.stockBar, { height: `${percentage}%` }]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                  />
                </View>
                <Text style={styles.stockCity}>{city}</Text>
                <Text style={styles.stockValue}>{stock}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {stats.map(stat => (
              <LinearGradient 
                key={stat.title} 
                colors={stat.gradient} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <MaterialCommunityIcons name={stat.icon} size={36} color="#FFFFFF" style={styles.icon} />
                  <Text style={styles.cardTitle}>{stat.title}</Text>
                  <Text style={styles.cardValue}>{stat.value}</Text>
                  <Text style={styles.cardDetail}>{stat.detail}</Text>
                </View>
              </LinearGradient>
            ))}
          </ScrollView>
        );
      
      case 'distribution':
        return (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Product Type Distribution</Text>
            <DistributionChart />
          </View>
        );
      
      case 'stock':
        return (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Stock by City</Text>
            <StockChart />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 16 : insets.top }]}>
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <Pressable 
              key={tab.id} 
              onPress={() => setActiveTab(tab.id)} 
              style={[
                styles.tabButton,
                activeTab === tab.id && styles.activeTabButton
              ]}
            >
              <MaterialCommunityIcons
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? '#FFFFFF' : '#666666'}
              />
              <Text style={[
                styles.tabButtonText,
                activeTab === tab.id && styles.activeTabButtonText
              ]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF'
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8
  },
  activeTabButton: {
    backgroundColor: '#FF4B2B',
  },
  tabButtonText: {
    color: '#666666',
    fontWeight: '500',
    fontSize: 14
  },
  activeTabButtonText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  scrollContent: {
    padding: 16
  },
  cardGradient: {
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5
  },
  cardContent: {
    padding: 24,
    alignItems: 'center'
  },
  icon: {
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8
  },
  cardDetail: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9
  },
  chartContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 16,
    textAlign: 'center'
  },
  chartWrapper: {
    marginTop: 20
  },
  distributionContainer: {
    width: '100%',
    padding: 16
  },
  distributionItem: {
    marginBottom: 16
  },
  distributionBar: {
    height: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden'
  },
  distributionFill: {
    height: '100%',
    borderRadius: 12
  },
  distributionLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  distributionText: {
    fontSize: 14,
    color: '#2E3A59'
  },
  distributionValue: {
    fontSize: 14,
    color: '#666666'
  },
  stockContainer: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    gap: 16
  },
  stockItem: {
    alignItems: 'center',
    width: 60
  },
  stockBarContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden'
  },
  stockBar: {
    width: '100%',
    borderRadius: 8,
    position: 'absolute',
    bottom: 0
  },
  stockCity: {
    fontSize: 12,
    color: '#2E3A59',
    marginTop: 8,
    textAlign: 'center'
  },
  stockValue: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4
  }
});