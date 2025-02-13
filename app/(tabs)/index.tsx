import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScannerScreen from '@/app/ScannerScreen';
import { router } from 'expo-router';
import ScanResultModal from '@/components/ScanResultModal';
import { findProduct } from '@/services/ProductServices';

export default function HomeScreen() {
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isManualEntryVisible, setIsManualEntryVisible] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isBottomModalOpen, setisBottomModalOpen] = useState(false);
  const [productExists, setIsProductExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleManualSubmit = async() => {
    try{
      if (manualCode.trim().length < 13) {
        Alert.alert('Invalid Code', 'Please enter a valid barcode');
        return;
      }
      setIsLoading(true);

      const product = await findProduct(manualCode);
      
      setIsProductExists(!!product);
      setIsManualEntryVisible(false);
      setisBottomModalOpen(true);
    }
    catch(error){
      Alert.alert(
        'Error',
        'An error occurred while checking the product. Please try again.'
      );
      console.error('Error in handleManualSubmit:', error);
      setIsProductExists(false);
      setisBottomModalOpen(false);
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleModalDismiss = () => {
    setisBottomModalOpen(false);
    setIsProductExists(false);
    setManualCode('');
  };

  

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

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => setIsScannerVisible(true)}
          >
            <MaterialCommunityIcons name="camera" size={24} color="#FF6B6B" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.manualButton}
            onPress={() => setIsManualEntryVisible(true)}
          >
            <MaterialCommunityIcons name="keyboard" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.manualEntryText}
          onPress={() => setIsManualEntryVisible(true)}
        >
          <Text style={styles.manualEntryLabel}>Or Enter code manually</Text>
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

        {/* Manual Entry Modal */}
        <Modal
          visible={isManualEntryVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() =>{
            setIsManualEntryVisible(false);
            setManualCode('');
          }
          }
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.manualEntryModalContainer}
          >
            <View style={styles.manualEntryContent}>
              <View style={styles.handle} />
              
              <Text style={styles.manualEntryTitle}>Enter Barcode</Text>
              
              <TextInput
                style={styles.manualEntryInput}
                value={manualCode}
                onChangeText={setManualCode}
                placeholder="Enter barcode number"
                keyboardType="numeric"
                autoFocus
                maxLength={13}
              />

              <View style={styles.manualEntryButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsManualEntryVisible(false);
                    setManualCode('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.submitButton,
                    (!manualCode.trim() || isLoading) && styles.submitButtonDisabled
                  ]}
                  onPress={handleManualSubmit}
                  disabled={!manualCode.trim() || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>

    {/* Bottom modal  */}
    <ScanResultModal
        isVisible={isBottomModalOpen}
        barcodeData = {manualCode}
        productExists={productExists}
        barcodeImage={null}
        onDismiss={handleModalDismiss}
    />

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
  buttonGroup: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
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
  manualButton: {
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
  manualEntryText: {
    marginTop: 10,
  },
  manualEntryLabel: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
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
  manualEntryModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  manualEntryContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  manualEntryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 20,
  },
  manualEntryInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  manualEntryButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#687076',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FF9F43',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#FFD1A9',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});