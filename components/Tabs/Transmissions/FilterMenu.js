import React from 'react';
import { View, Button, TouchableOpacity, Image } from 'react-native';
import { Menu } from 'react-native-paper';

const FilterMenu = ({
  dailyTransmissions,
  setDateMenuVisible,
  isDateMenuVisible,
  setSelectedDate,
  setChildMenuVisible,
  selectedChildId,
  selectedDate,
  isChildMenuVisible,
  children,
  setSelectedChildId
}) => {
  const uniqueDates = Array.from(new Set(dailyTransmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(transmission => new Date(transmission.createdAt).toLocaleDateString())));
  return (
    <View>
      <Menu
        visible={isDateMenuVisible}
        onDismiss={() => setDateMenuVisible(false)}
        anchor={<Button onPress={() => setDateMenuVisible(true)} style={{ padding: 10 }} title='Filtrer par date' />}>
        {uniqueDates.map((date, index) => (
          <Menu.Item
            key={index}
            title={date}
            onPress={() => {
              setSelectedDate(date);
              setDateMenuVisible(false);
            }}
          />
        ))}
      </Menu>
      <Menu
        visible={isChildMenuVisible}
        onDismiss={() => setChildMenuVisible(false)}
        anchor={<Button onPress={() => setChildMenuVisible(true)} title='Filtrer par enfant' />}>
        {children.map((child, index) => (
          <Menu.Item
            key={index}
            title={child.name}
            onPress={() => {
              setSelectedChildId(child.id);
              setChildMenuVisible(false);
            }}
          />
        ))}
      </Menu>
      {(selectedDate || selectedChildId) && (
        <View style={{ position: 'absolute', right: -60, top: 20 }}>
          <TouchableOpacity onPress={() => {
            setSelectedDate('');
            setDateMenuVisible(false);
            setSelectedChildId('');
            setChildMenuVisible(false);
          }}>
            <Image
              source={require('../../../assets/supprimer.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FilterMenu;
