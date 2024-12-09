import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const FavoriteScreen = ({ route, navigation }) => {
  const [favoriteMangas, setFavoriteMangas] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@favorites');
        if (jsonValue != null) {
          setFavoriteMangas(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Failed to load favorites from AsyncStorage', e);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        const jsonValue = JSON.stringify(favoriteMangas);
        await AsyncStorage.setItem('@favorites', jsonValue);
      } catch (e) {
        console.error('Failed to save favorites to AsyncStorage', e);
      }
    };

    if (favoriteMangas.length > 0) {
      saveFavorites();
    }
  }, [favoriteMangas]);

  const removeFromFavorites = (manga) => {
    Alert.alert(
      'Remove from Favorites',
      `Are you sure you want to remove "${manga.title}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => {
            const newFavorites = favoriteMangas.filter((item) => item.title !== manga.title);
            setFavoriteMangas(newFavorites);
            Alert.alert('Removed', `"${manga.title}" has been removed from your favorites.`);
          },
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.mangaItem}>
      <Image source={{ uri: item.image }} style={styles.mangaImage} />
      <View style={styles.mangaInfo}>
        <Text style={styles.mangaTitle}>{item.title}</Text>
        <Text style={styles.mangaAuthor}>By {item.author}</Text>
        <Text style={styles.mangaChapters}>{item.chapters} Chapters</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromFavorites(item)}
        >
          <Icon name="trash" size={18} color="#FF6347" />
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Favorites</Text>
        {favoriteMangas.length > 0 ? (
          <FlatList
            data={favoriteMangas}
            keyExtractor={(item) => item.title}
            renderItem={renderFavoriteItem}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text style={styles.emptyMessage}>You have no favorite mangas yet.</Text>
        )}
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('DetailsScreen')}>
          <Icon name="home" size={24} color="#007AFF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('DetailsScreen')}>
          <Icon name="book" size={24} color="#007AFF" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 30,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  list: {
    paddingBottom: 16,
  },
  mangaItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  mangaImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  mangaInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mangaTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  mangaAuthor: {
    fontSize: 14,
    color: '#666',
  },
  mangaChapters: {
    fontSize: 12,
    color: '#999',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  removeButtonText: {
    fontSize: 14,
    color: '#FF6347',
    marginLeft: 6,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#007AFF',
  },
});
