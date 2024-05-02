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
import DocumentsScreen from './components/Tabs/Documents/DocumentsScreen';
import ChatScreen from './components/Tabs/ChatScreen';
import NewPostScreen from './components/Home/NewPostScreen';
import AuthScreen from './components/Auth/AuthScreen';
import TransmissionDetailsScreen from './components/Tabs/Transmissions/TransmissionDetailsScreen';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import DocumentDetail from './components/Tabs/Documents/DocumentDetail';

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
        options={{ headerShown: false }}
        initialParams={{ userId: user ? user.uid : null }}
      />
      <Stack.Screen
        name="TransmissionDetails"
        component={TransmissionDetailsScreen}
        options={{ title: 'Détails de la transmission' }}
        initialParams={{ userId: user ? user.uid : null }}
      />
    </Stack.Navigator>
  );
}

function DocumentsStackScreen() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="DocumentsList" component={DocumentsScreen} options={{ headerShown: false, title: 'Documents' }} />
      <Stack.Screen name="DocumentDetail" component={DocumentDetail} options={{ title: false }} />
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarIcon: ({ focused, color, size }) => null,
          tabBarLabelStyle: {
            fontSize: 12,
            color: "#FBFCF9",
            fontWeight: "bold",

          },
          tabBarStyle: {
            backgroundColor: "#A4D2C1",
            borderTopWidth: 1,
            borderTopColor: "lightgray",

          },
          tabBarItemStyle: {

          }
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
          component={DocumentsStackScreen}
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
