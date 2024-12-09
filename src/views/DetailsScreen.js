import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Alert, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [favoriteMangas, setFavoriteMangas] = useState([]);
  const scrollViewRef = useRef(); // Reference for ScrollView

  const mangas = [
    { title: "Manga Adventure", author: "John Doe", image: '../image/action/image2.jpg', category: 'Action', chapters: 10 },
    { title: "Mystery Manga", author: "Jane Smith", image: '../image/action/image1.jpg', category: 'Mystery', chapters: 8 },
    { title: "Fantasy Saga", author: "Emily Brown", image: '../image/fantasy/image1.jpg', category: 'Fantasy', chapters: 15 },
    { title: "Epic Journey", author: "Alan Parker", image: '../image/fantasy/image2.jpg', category: 'Adventure', chapters: 12 },
    { title: "Epic Journey", author: "Alan Parker", image: '../image/fantasy/image4.jpg', category: 'Adventure', chapters: 12 },
  ];
  

  const handleSearchChange = (text) => setSearchText(text);
  const clearSearch = () => setSearchText('');
  const filterMangasByCategory = (category) => setSelectedCategory(category);

  // Filter mangas by category
  const filteredByCategory = selectedCategory === 'All'
    ? mangas
    : mangas.filter((manga) => manga.category === selectedCategory);

  // Filter mangas by search text
  const filteredMangas = filteredByCategory.filter((manga) =>
    manga.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleMangaClick = (manga) => {
    Alert.alert('Manga Selected', `You selected ${manga.title}.`);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true }); // Scroll to the top
  };

  // Toggle favorite status of a manga and move it to favorites section
  const toggleFavorite = (manga) => {
    // Toggle the manga in the favorites list
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(manga.title)) {
        // Remove from favorites
        Alert.alert('Removed from Favorites', `${manga.title} has been removed from your favorites.`);
        return prevFavorites.filter((title) => title !== manga.title);
      } else {
        // Add to favorites
        Alert.alert('Added to Favorites', `${manga.title} has been added to your favorites.`);
        return [...prevFavorites, manga.title];
      }
    });

    // Add or remove manga from the favoriteMangas list
    if (favoriteMangas.includes(manga)) {
      setFavoriteMangas(favoriteMangas.filter((favManga) => favManga.title !== manga.title)); // Remove from favoriteMangas
    } else {
      setFavoriteMangas([...favoriteMangas, manga]); // Add to favoriteMangas
    }
  };

  // Check if manga is a favorite
  const isFavorite = (title) => favorites.includes(title);

  return (
    <View style={styles.container}>
      {/* Header with Profile Image on the left */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('ProfileScreen')} // Navigate to ProfileScreen
          style={styles.profileButton}
        >
          {/* Replace with Image component for custom profile image */}
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your image URL
            style={styles.profileImage} 
          />
        </TouchableOpacity>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            placeholder="Search for mangas..."
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleSearchChange}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
              <Icon name="times" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories Section */}
      <View style={styles.categoriesSection}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
          {['All', 'Action', 'Fantasy', 'Adventure', 'Mystery'].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryButton, selectedCategory === category && { backgroundColor: '#A1D3FF' }]}
              onPress={() => filterMangasByCategory(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <TouchableWithoutFeedback onPress={scrollToTop}>
  <ScrollView ref={scrollViewRef}>
    {/* Featured Manga Section */}
    <Text style={styles.featuredTitle}>Featured Manga</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bookList}>
      {filteredMangas.length === 0 ? (
        <Text style={styles.noResults}>No results found</Text>
      ) : (
        filteredMangas.map((manga, index) => (
          <View key={index} style={styles.mangaItem}>
            <Image source={{ uri: manga.image }} style={styles.mangaImage} />
            <View style={styles.mangaInfo}>
              <Text style={styles.mangaTitle}>{manga.title}</Text>
              <Text style={styles.mangaAuthor}>{manga.author}</Text>
              <Text style={styles.mangaChapters}>{manga.chapters} Chapters</Text>
              <TouchableOpacity style={styles.readButton} onPress={() => handleMangaClick(manga)}>
                <Text style={styles.readButtonText}>Read</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleFavorite(manga)} style={styles.favoriteButton}>
                <Icon name={isFavorite(manga.title) ? 'star' : 'star-o'} size={24} color="#FFD700" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  </ScrollView>
</TouchableWithoutFeedback>


      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('DetailsScreen')}>
          <Icon name="home" size={24} color="#007AFF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('FavoriteScreen')}>
          <Icon name="heart" size={24} color="#007AFF" />
          <Text style={styles.navText}>Favorite</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
    backgroundColor: '#FFF',
    elevation: 3,
    marginBottom: 20,
    marginTop: 15,
  },
  profileButton: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    marginRight: 15,
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12, // Makes the image circular
  },
  searchBarContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  searchIcon: {
    marginTop: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  clearIcon: {
    marginLeft: 10,
    marginTop: 9,
  },
  categoriesSection: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoriesList: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: '#D3D3D3',
    padding: 10,
    marginRight: 10,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  bookList: {
    marginLeft: 15,
  },
  mangaItem: {
    marginRight: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: 120,
  },
  mangaImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  mangaInfo: {
    marginTop: 5,
  },
  mangaTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  mangaAuthor: {
    fontSize: 12,
    color: '#666',
  },
  mangaChapters: {
    fontSize: 12,
    color: '#666',
  },
  readButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  readButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    elevation: 3,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#007AFF',
  },
});

export default DetailsScreen;
