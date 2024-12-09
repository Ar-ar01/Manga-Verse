import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import HomesScreen from './src/screen/HomesScreen';
import LoginScreen from './src/screen/LoginScreen';
import SignupScreen from './src/screen/SignupScreen';
import DetailsScreen from './src/views/DetailsScreen';
import ProfileScreen from './src/views/ProfileScreen';
import FavoriteScreen from './src/views/FavoriteScreen';
import { UserContext } from './src/views/UserContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <UserContext>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="HOME" component={HomesScreen} />
          <Stack.Screen name="LOGIN" component={LoginScreen} />
          <Stack.Screen name="SIGNUP" component={SignupScreen} />
          <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
          <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
      </UserContext>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
