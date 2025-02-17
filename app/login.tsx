import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '@/config/axios';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [authKey, setAuthKey] = useState('');
  const [invalidData, setInvalidData] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      if (userData) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const handleLogin = async () => {   
    try {
      setIsLoading(true);
      const response = await apiClient.get('warehousemans');
      const users = response.data;
      const user = users.find((user) => user.secretKey === authKey);

      if (user) {
        await SecureStore.setItemAsync('userData', JSON.stringify({
          id: user.id,
          name: user.name,
          warehouseId: user.warehouseId,
          city: user.city
        }));

        router.replace('/(tabs)');
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Invalid Authentication Key',
          text2: 'Please check your key and try again'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Connection Error',
        text2: 'Please check your internet connection'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  return (
    <LinearGradient
      colors={['#FF9F43', '#FF6B6B']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image 
          source={require('@/assets/images/login2.png')} 
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Stock Manager</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Authentication Key"
            value={authKey}
            onChangeText={setAuthKey}
            secureTextEntry={!showPassword}
            placeholderTextColor="#FFD1A9"
            autoCapitalize="none"
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color="#FFD1A9"
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
          disabled={!authKey.trim()}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    opacity: 1,
  },
  buttonText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: '17%',
  }
});