import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AddProduct } from '@/services/ProductServices';

export default function ProductCreationScreen() {
  const router = useRouter();
  const {barcodeData} = useLocalSearchParams(); 
  const [form, setForm] = useState({
    name: '',
    type: '',
    price: '',
    solde: '',
    supplier: '',
    quantity: '',
    location: '',
    city: '',
    barcode: barcodeData,
  });

  const handleSubmit = async () => {
   
    if (!form.name || !form.type || !form.price) {
             Toast.show({
                  type: 'error',
                  position: 'top',
                  text1: 'Please fill in all required fields',
                  text2: 'Please try again'
                });
      return;
    }

    try {
      AddProduct(form);
      Alert.alert(
        'Success',
        'Product added successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
        Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Failed to add product',

          });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
       
        <View style={styles.header}>
          <Text style={styles.title}>Add New Product</Text>
          <Text style={styles.barcode}>Barcode: {barcodeData}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
        
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => setForm({...form, name: text})}
                placeholder="Enter product name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type *</Text>
              <TextInput
                style={styles.input}
                value={form.type}
                onChangeText={(text) => setForm({...form, type: text})}
                placeholder="Enter product type"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Price *</Text>
                <TextInput
                  style={styles.input}
                  value={form.price}
                  onChangeText={(text) => setForm({...form, price: text})}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Sale Price</Text>
                <TextInput
                  style={styles.input}
                  value={form.solde}
                  onChangeText={(text) => setForm({...form, solde: text})}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Supplier</Text>
              <TextInput
                style={styles.input}
                value={form.supplier}
                onChangeText={(text) => setForm({...form, supplier: text})}
                placeholder="Enter supplier name"
              />
            </View>
          </View>

         
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stock Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Initial Quantity *</Text>
              <TextInput
                style={styles.input}
                value={form.quantity}
                onChangeText={(text) => setForm({...form, quantity: text})}
                placeholder="Enter quantity"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location Name</Text>
              <TextInput
                style={styles.input}
                value={form.location}
                onChangeText={(text) => setForm({...form, location: text})}
                placeholder="Enter storage location"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={form.city}
                onChangeText={(text) => setForm({...form, city: text})}
                placeholder="Enter city"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <MaterialCommunityIcons name="check" size={24} color="white" />
          <Text style={styles.submitButtonText}>Save Product</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 5,
  },
  barcode: {
    color: '#687076',
    fontSize: 16,
  },
  form: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#11181C',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#687076',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FF9F43',
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});