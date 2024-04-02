import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../firebase";
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";


const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      alert("Email ou mot de passe incorrect", error.message);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUid = response.user.uid;

      await axios.post('http://192.168.1.21:3000/api/create-user', {
        email,
        password,
        uid: firebaseUid,
      });

      alert("Vérifiez vos emails pour valider votre compte");
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      alert("Echec lors de la création du compte", error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
      <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Mot de passe" autoCapitalize="none" onChangeText={(text) => setPassword(text)}></TextInput>
      {loading ? (
        <ActivityIndicator size='large' color="#0000ff" />
      ) : (
        <>
          <Button title="Se connecter" onPress={() => signIn()} />
          <Button title="Créer un compte" onPress={() => signUp()} />
        </>
      )}
    </View>
  )
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  // button: {
  //   alignItems: "center",
  //   backgroundColor: "#DDDDDD",
  //   padding: 10,
  // },
});
