import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUserData } from '@/helpers/getUserData';


export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const data = await getUserData();
    if (data) {
      setUserData(data);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('userData');
              router.replace('/login');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#FF9F43', '#FF6B6B']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account-circle" size={80} color="white" />
          </View>
          {userData && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userDetail}>{userData.city}</Text>
            </View>
          )}
        </View>

        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="account-edit" size={24} color="white" />
            <Text style={styles.settingText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
            <Text style={styles.settingText}>Notifications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="shield-check-outline" size={24} color="white" />
            <Text style={styles.settingText}>Privacy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={24} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userDetail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  settingsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});