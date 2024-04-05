import React, { useRef } from "react";
import { View, Text, Button, StyleSheet, TextInput, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';

const ProfileForm = ({ prenom, nom, role, setPrenom, setNom, setRole, onSubmit, onCancel, profilePicture }) => {
  const nextInput = useRef();

  return (
    <View style={styles.container}>
      <Text>Profil de l'utilisateur</Text>
      <View style={styles.profilePictureContainer}>
        {profilePicture && (
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        )}
      </View>
      <TextInput
        value={prenom}
        style={styles.input}
        placeholder="Prénom"
        onChangeText={setPrenom}
        returnKeyType="next"
        onSubmitEditing={() => nextInput.current.focus()}
        blurOnSubmit={false}
      />
      <TextInput ref={nextInput} value={nom} style={styles.input} placeholder="Nom" onChangeText={setNom} returnKeyType="done"
        onSubmitEditing={() => console.log('Done!')} />

      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Parent" value="USER" />
        <Picker.Item label="Nounou" value="NOUNOU" />
      </Picker>

      <View style={styles.buttonContainer}>
        <Button title="Enregistrer" onPress={onSubmit} />
        <Button title="Annuler" onPress={onCancel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginVertical: 4,
    width: 200,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 40,
    width: 150,
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'transparent',
    marginTop: -50,
  },
  buttonContainer: {
    marginTop: 200,
  },
  profilePictureContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
});

export default ProfileForm;
