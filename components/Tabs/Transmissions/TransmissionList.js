import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TransmissionList = ({ dailyTransmissions, children, handleTransmissionDetails }) => {
  return (
    <View>
      <View style={styles.dailyContainer}>
        {dailyTransmissions
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((transmission, index) => {
            const child = children.find(c => c.id === transmission.childId);
            const childName = child ? child.name : 'Enfant inconnu';
            const itemStyle = dailyTransmissions.length === 1 ? { ...styles.item, width: '100%' } : styles.item;

            return (
              <TouchableOpacity key={index} style={itemStyle} onPress={() => handleTransmissionDetails(transmission)}>
                <Text style={styles.dailyTransmissionsButton}>{transmission.content}</Text>
                <View style={styles.containNameDate}>
                  <Text style={styles.nameDateText}>{childName}</Text>
                  <Text style={styles.nameDateText}>{new Date(transmission.createdAt).toLocaleDateString('fr')}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dailyTransmissionsButton: {
    backgroundColor: '#A4D2C1',
    padding: 10,
    borderRadius: 5,
    color: 'white',
    textAlign: 'center',
    height: 60,
  },
  dailyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  containNameDate:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameDateText:{
    fontSize: 12,
    color: '#1A1E11',
  },
  item: {
    width: '50%',
    padding: 10,
  }
});

export default TransmissionList;
