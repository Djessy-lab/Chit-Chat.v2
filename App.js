import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfilButton from './components/Profil/ProfilButton';
import ProfilScreen from './components/Profil/ProfilScreen';
import HomeScreen from './components/Home/HomeScreen';
import TransmissionsScreen from './components/Tabs/TransmissionsScreen';
import DocumentsScreen from './components/Tabs/DocumentsScreen';
import ChatScreen from './components/Tabs/ChatScreen';
import NewPostScreen from './components/Home/NewPostScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: '#A4D2C1',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontSize: 20,
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#92A96F",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ focused, color, size }) => null,
          tabBarLabelStyle: {
            fontSize: 12,
            color: "#FBFCF9",
            fontWeight: "bold",
            marginBottom: 5,
          },
          tabBarStyle: {
            backgroundColor: "#A4D2C1",
            borderTopWidth: 1,
            borderTopColor: "lightgray",
          },
        }}
      >
        <Tab.Screen
          name="Accueil"
          component={HomeStackScreen}
          options={({ navigation }) => ({
            headerRight: () => <ProfilButton navigation={navigation} />,
            ...screenOptions,
          })}
        />
        <Tab.Screen
          name="Transmissions"
          component={TransmissionsScreen}
          options={({ navigation }) => ({
            headerRight: () => <ProfilButton navigation={navigation} />,
            ...screenOptions,
          })}
        />
        <Tab.Screen
          name="Documents"
          component={DocumentsScreen}
          options={({ navigation }) => ({
            headerRight: () => <ProfilButton navigation={navigation} />,
            ...screenOptions,
          })}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={({ navigation }) => ({
            headerRight: () => <ProfilButton navigation={navigation} />,
            ...screenOptions,
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const HomeStackScreen = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil', headerShown: false }} />
    <Stack.Screen name="Profil" component={ProfilScreen} options={{ tabBarButton: () => null, headerShown: false }} />
    <Stack.Screen name="NewPost" component={NewPostScreen} options={{ tabBarButton: () => null, headerShown: false }} />
  </Stack.Navigator>
);
