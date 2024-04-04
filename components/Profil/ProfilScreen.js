import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FIREBASE_AUTH, FIREBASE_STORAGE } from "../../firebase";
import { signOut, updateProfile } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import ProfileForm from "./ProfilForm";
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';

const ProfilScreen = ({ navigation }) => {
  const auth = FIREBASE_AUTH;
  const [user, setUser] = useState(auth.currentUser);
  const [isProfileFormVisible, setProfileFormVisibility] = useState(false);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [role, setRole] = useState("USER");
  const [profilePicture, setProfilePicture] = useState(null);
  const [savePhoto, setSavePhoto] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfileFromServer();
    }
  }, [user]);

  const fetchUserProfileFromServer = async () => {
    try {
      const userProfileResponse = await fetch(`http://192.168.1.21:3000/api/user/get-user/${user.uid}`);
      if (userProfileResponse.ok) {
        const userProfileData = await userProfileResponse.json();
        setPrenom(userProfileData.prenom || "");
        setNom(userProfileData.nom || "");
        setRole(userProfileData.role || "USER");
        setProfilePicture(userProfileData.profilePicture || null);
      } else {
        console.error('Erreur lors de la récupération des données du profil:', userProfileResponse.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données du profil:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!prenom || !nom || !role) {
        alert('Veuillez remplir tous les champs.');
        return;
      }

      await updateProfile(user, { displayName: `${prenom} ${nom}` });

      let imageUrl = profilePicture;
      if (profilePicture && savePhoto) {
        imageUrl = await uploadImage(profilePicture);
      }

      const response = await fetch(`http://192.168.1.21:3000/api/user/update-user/${user.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom, role, profilePicture: imageUrl }),
      });

      if (response.ok) {
        alert("Succès", "Informations mises à jour avec succès !");
        setProfilePicture(imageUrl);
        setProfileFormVisibility(false);
        fetchUserProfileFromServer();
      } else {
        const errorDetails = await response.json();
        alert("Erreur", "Erreur lors de la mise à jour des informations.");
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert("Erreur", "Erreur lors de la mise à jour du profil.");
    }
  };


  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission d\'accès à la bibliothèque photo refusée!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
    });

    if (!result.canceled && result.assets) {
      const compressedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [],
        { compress: 0.5 }
      );
      setProfilePicture(compressedImage.uri);
      setSavePhoto(true);
    }
  };

  const uploadImage = async (uri) => {
    const blob = await (await fetch(uri)).blob();
    const filename = uri.split('/').pop();
    const storageRef = ref(FIREBASE_STORAGE, `profilePicture/${user.uid}/${filename}`);
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigation.navigate("Auth");
  };

  const handleCancelProfileForm = () => setProfileFormVisibility(false);

  const handleSavePhoto = async () => {
    if (!profilePicture) {
      alert('Aucune photo sélectionnée');
      return;
    }

    try {
      const blob = await fetch(profilePicture).then(res => res.blob());
      const filename = `${Date.now()}_${profilePicture.split('/').pop()}`;
      const storageRef = ref(FIREBASE_STORAGE, `profilePicture/${user.uid}/${filename}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      handleUpdateProfile(downloadURL);
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image :', error);
    }
  };

  return (
    <View style={styles.container}>
      {user && (
        <>
          <Text style={styles.email}>Email: {user.email}</Text>
          {isProfileFormVisible ? (
            <ProfileForm
              prenom={prenom}
              nom={nom}
              role={role}
              setPrenom={setPrenom}
              setNom={setNom}
              setRole={setRole}
              onSubmit={handleUpdateProfile}
              onCancel={handleCancelProfileForm}
              profilePicture={profilePicture}
            />
          ) : (
            <>
              <TouchableOpacity onPress={handleChoosePhoto}>
                <View style={styles.profilePictureContainer}>
                  <Image source={{ uri: profilePicture || '../../assets/person.png' }} style={styles.profilePicture} />
                </View>
              </TouchableOpacity>
              {savePhoto && <Button title="Enregistrer la photo" onPress={handleSavePhoto} />}
              <Button title="Modifier le profil" onPress={() => setProfileFormVisibility(true)} />
              <Button title="Se déconnecter" onPress={handleSignOut} />
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  email: {
    marginVertical: 20,
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

export default ProfilScreen;
