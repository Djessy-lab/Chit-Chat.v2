import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase';

import ProfilButton from './components/Profil/ProfilButton';
import ProfilScreen from './components/Profil/ProfilScreen';
import HomeScreen from './components/Home/HomeScreen';
import TransmissionsScreen from './components/Tabs/Transmissions/TransmissionsScreen';
import DocumentsScreen from './components/Tabs/DocumentsScreen';
import ChatScreen from './components/Tabs/ChatScreen';
import NewPostScreen from './components/Home/NewPostScreen';
import AuthScreen from './components/Auth/AuthScreen';
import TransmissionDetailsScreen from './components/Tabs/Transmissions/TransmissionDetailsScreen';

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

function HomeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil', headerShown: false }} />
      <Stack.Screen name="Profil" component={ProfilScreen} options={{ tabBarButton: () => null }} />
      <Stack.Screen name="NewPost" component={NewPostScreen} options={{ tabBarButton: () => null, headerShown: false }} />
    </Stack.Navigator>
  );
}

function TransmissionsStackScreen({ user }) {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="TransmissionsList"
        component={TransmissionsScreen}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="TransmissionDetails"
        component={TransmissionDetailsScreen}
        options={{ title: 'Détails de la transmission' }}
      />
    </Stack.Navigator>
  );
}


export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

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
            headerRight: () => <ProfilButton disabled={!user} />,
            ...screenOptions,
          })}
        />
        <Tab.Screen
          name="Transmissions"
          options={({ navigation }) => ({
            headerRight: () => <ProfilButton disabled={!user} />,
            ...screenOptions,
          })}
        >
          {() => <TransmissionsStackScreen user={user} />}
        </Tab.Screen>
        <Tab.Screen
          name="Documents"
          component={DocumentsScreen}
          options={({ navigation }) => ({
            headerRight: () => <ProfilButton disabled={!user} />,
            ...screenOptions,
          })}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={({ navigation }) => ({
            headerRight: () => <ProfilButton disabled={!user} />,
            ...screenOptions,
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
