import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScannerScreen from '@/app/ScannerScreen'; 

export default function HomeScreen() {
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  return (
    <LinearGradient
      colors={['#FF9F43', '#FF6B6B']}
      style={styles.container}
    >
      <View style={styles.content}>
  
        <MaterialCommunityIcons 
          name="barcode-scan" 
          size={120} 
          color="white" 
          style={styles.mainIcon}
        />

        
        <Text style={styles.title}>Scan a Product</Text>
        <Text style={styles.subtitle}>
          Position the barcode within the frame to scan
        </Text>

      
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => setIsScannerVisible(true)}
        >
          <MaterialCommunityIcons name="camera" size={24} color="#FF6B6B" />
        </TouchableOpacity>

        {/* Scanner Modal */}
        <Modal
          visible={isScannerVisible}
          animationType="slide"
          onRequestClose={() => setIsScannerVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ScannerScreen />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsScannerVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  scanButton: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 25,
    zIndex: 1,
  },
});