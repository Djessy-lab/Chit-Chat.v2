import { Image, Text, TouchableOpacity } from "react-native";

const NewPostButton = ({ navigation }) => (
  <TouchableOpacity
    style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#85C2C2',
      padding: 10,
      borderRadius: 100,
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onPress={() => {
      navigation.navigate('NewPost');
    }}
  >
    <Image
      source={require('../../assets/plus.png')}
      style={{ width: 30, height: 30, tintColor: '#fff'}}
    />
  </TouchableOpacity>
);

export default NewPostButton;
