import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const ScanResultModal = ({ 
  isVisible, 
  onDismiss, 
  barcodeData, 
  productExists,
  barcodeImage // This would be a capture of the scanned barcode area
}) => {
  const router = useRouter();

  const handleProductAction = () => {
    if (productExists) {
        router.push({ pathname: "/ProductDetails", params: { barcodeData } });
    } else {
      router.push(`/ProductDetails`);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity 
        style={styles.backdrop} 
        onPress={onDismiss} 
        activeOpacity={1}
      />

      {/* Modal Content */}
      <View style={styles.modalContainer}>
        <View style={styles.handle} />

        {/* Barcode Image Section */}
        <View style={styles.barcodeContainer}>
          <Image 
            source={{ uri: barcodeImage }} 
            style={styles.barcodeImage}
            resizeMode="contain"
          />
          <Text style={styles.barcodeText}>{barcodeData}</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleProductAction}
        >
          <LinearGradient
            colors={['#FF9F43', '#FF6B6B']}
            style={styles.actionButtonGradient}
          >
            <MaterialCommunityIcons 
              name={productExists ? "information" : "plus"} 
              size={24} 
              color="white" 
            />
            <Text style={styles.actionButtonText}>
              {productExists ? 'View Product Details' : 'Insert New Product'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Dismiss Button */}
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={onDismiss}
        >
          <MaterialCommunityIcons name="close" size={20} color="#687076" />
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  barcodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  barcodeImage: {
    width: '100%',
    height: 100,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  barcodeText: {
    fontSize: 16,
    color: '#11181C',
    fontFamily: 'monospace',
  },
  actionButton: {
    marginBottom: 15,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  dismissButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  dismissText: {
    color: '#687076',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ScanResultModal;