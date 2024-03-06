import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';

const ProfilButton = ({ disabled }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (!disabled) {
      navigation.navigate('Profil');
    } else {
      navigation.navigate('Auth');
    }
  };

  return (
    <TouchableOpacity
      style={{
        marginRight: 10,
        backgroundColor: '#85C2C2',
        padding: 10,
        borderRadius: 100,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={handlePress}
    >
      <Image
        source={require('../../assets/family.png')}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
  );
};

export default ProfilButton;
