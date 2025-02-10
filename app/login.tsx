import React, { useState } from 'react';
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

export default function LoginScreen() {
  const [authKey, setAuthKey] = useState('');
  const [invalidData, setInvalidData] = useState(false);
  const router = useRouter();

  const  handleLogin = async() => {   
    const users = (await apiClient.get('warehousemans')).data;
    const userExist = users.filter((user: string)=>user.secretKey == authKey);
    if (userExist.length > 0) {
      router.replace('/(tabs)');
    }
    else{
        Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Invalid input',
            text2: 'Please try again'
          });
    }
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
        <TextInput
          style={styles.input}
          placeholder="Enter Authentication Key"
          value={authKey}
          onChangeText={setAuthKey}
          secureTextEntry
          placeholderTextColor="#FFD1A9"
          autoCapitalize="none"
        />
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
});