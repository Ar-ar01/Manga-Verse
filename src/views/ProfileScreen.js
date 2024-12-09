import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(
    'https://via.placeholder.com/150' // Placeholder image URL
  );

  const navigation = useNavigation();

  // Load data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedName = await AsyncStorage.getItem('profile_name');
        const savedLastName = await AsyncStorage.getItem('profile_last_name');
        const savedEmail = await AsyncStorage.getItem('profile_email');
        const savedProfilePicture = await AsyncStorage.getItem('profile_picture');

        if (savedName) setName(savedName);
        if (savedLastName) setLastName(savedLastName);
        if (savedEmail) setEmail(savedEmail);
        if (savedProfilePicture) setProfilePicture(savedProfilePicture);
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };

    loadProfileData();
  }, []);

  // Function to handle profile picture change
  const handleProfilePictureChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
      // Save the new picture path to AsyncStorage
      await AsyncStorage.setItem('profile_picture', result.assets[0].uri);
    }
  };

  // Function to remove profile picture
  const handleRemoveProfilePicture = async () => {
    try {
      // If the current profile picture is not the placeholder image
      if (profilePicture !== 'https://via.placeholder.com/150') {
        // Delete the profile picture file from local storage
        await FileSystem.deleteAsync(profilePicture);
        console.log('Profile picture deleted from storage');
      }
      // Reset to the placeholder image and update AsyncStorage
      setProfilePicture('https://via.placeholder.com/150');
      await AsyncStorage.setItem('profile_picture', 'https://via.placeholder.com/150');
      Alert.alert('Profile Picture Removed', 'The profile picture has been permanently deleted and reset to default.');
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      Alert.alert('Error', 'Failed to delete profile picture.');
    }
  };

  // Save data to AsyncStorage
  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('profile_name', name);
      await AsyncStorage.setItem('profile_last_name', lastName);
      await AsyncStorage.setItem('profile_email', email);
      await AsyncStorage.setItem('profile_picture', profilePicture);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile data:', error);
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'LOGIN' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profilePictureContainer}>
        <TouchableOpacity onPress={handleProfilePictureChange}>
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        </TouchableOpacity>
        <Text style={styles.changePictureText}>Change Picture</Text>
        <TouchableOpacity
          style={styles.removePictureButton}
          onPress={handleRemoveProfilePicture}
        >
          <Text style={styles.removePictureText}>Remove Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.infoLabel}>First Name</Text>
        <TextInput
          style={styles.inputField}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.infoLabel}>Last Name</Text>
        <TextInput
          style={styles.inputField}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.infoLabel}>Email</Text>
        <TextInput
          style={styles.inputField}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="sign-out" size={24} color="#FF0000" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  changePictureText: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 14,
  },
  removePictureButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FF4444',
    borderRadius: 5,
  },
  removePictureText: {
    color: '#FFF',
    fontSize: 14,
  },
  profileInfo: {
    marginBottom: 30,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  inputField: {
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF0000',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default ProfileScreen;
