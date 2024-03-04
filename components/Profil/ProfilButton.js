import { Image, Text, TouchableOpacity } from "react-native";

const ProfilButton = ({ navigation }) => (
  <TouchableOpacity
    style={{ marginRight: 10, backgroundColor: '#85C2C2', padding: 10, borderRadius: 100, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }}
    onPress={() => {
      navigation.navigate('Profil')
    }}
  >
    <Image
      source={require('../../assets/family.png')}
      style={{ width: 30, height: 30 }} />
  </TouchableOpacity>
);

export default ProfilButton;
