import * as React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen(props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'start', position: 'relative' }}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 20, right: 20, backgroundColor: '#ACCDBC', padding: 10, borderRadius: 100, width: 60, height: 60, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => {
          props.navigation.navigate('Profil')
        }}
      >
        <Image
          source={require('./assets/family.png')}
          style={{ width: 30, height: 30 }} />
      </TouchableOpacity>
      <Text
        style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}
      >ChitChat</Text>
    </View>
  )
}

function ProfilScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profil</Text>
    </View>
  )
}

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Accueil" component={HomeScreen} />
        <Stack.Screen name="Profil" component={ProfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
