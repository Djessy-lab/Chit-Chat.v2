import React, { useRef, useState } from "react";
import { FIREBASE_AUTH } from "../../firebase";
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image } from "react-native";
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

      await axios.post('http://192.168.1.21:3000/api/user/create-user', {
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

  const nextInput = useRef();


  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={{ width: 200, height: 120, marginTop: 30, marginBottom: 30 }} />
      <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} returnKeyType="next"
        onSubmitEditing={() => nextInput.current.focus()}
        blurOnSubmit={false}></TextInput>
      <TextInput ref={nextInput} secureTextEntry={true} value={password} style={styles.input} placeholder="Mot de passe" autoCapitalize="none" onChangeText={(text) => setPassword(text)} returnKeyType="done"
        onSubmitEditing={() => signIn()}></TextInput>
      {loading ? (
        <ActivityIndicator size='large' color="#0000ff" />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <Button style={styles.button} title="Se connecter" onPress={() => signIn()} />
            <Button style={styles.button} title="Créer un compte" onPress={() => signUp()} />
          </View>
        </>
      )}
    </View>
  )
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginVertical: 4,
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: "#A4D2C1",
    borderRadius: 30,
    padding: 10,
    backgroundColor: "#fff",
  },

  buttonContainer: {
    marginTop: 30,
  },
});
