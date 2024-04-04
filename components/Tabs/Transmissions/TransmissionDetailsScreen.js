import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransmissionDetailsScreen = ({ route }) => {
  const { transmission, child } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.content}>Enfant: {child ? child.name : 'Enfant inconnu'}</Text>
      <Text style={styles.content}>{transmission.content}</Text>
      <Text style={styles.content}>Couches: {transmission.diapers}</Text>
      <Text style={styles.content}>Repas: {transmission.meals}</Text>
      <Text style={styles.content}>Sommeil: {transmission.sleep}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default TransmissionDetailsScreen;
