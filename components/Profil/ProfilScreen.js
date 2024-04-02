import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FIREBASE_AUTH, FIREBASE_STORAGE } from "../../firebase";
import { signOut, updateProfile } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import ProfileForm from "./ProfilForm";
import { ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';



const ProfilScreen = ({ navigation }) => {
  const auth = FIREBASE_AUTH;
  const [user, setUser] = useState(auth.currentUser);
  const [isProfileFormVisible, setProfileFormVisibility] = useState(false);

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [role, setRole] = useState("USER");
  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [savePhoto, setSavePhoto] = useState(false);

  const convertImageToBase64 = async (uri) => {
    try {
      if (uri.startsWith('http')) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
          reader.onload = () => {
            resolve(reader.result.split(',')[1]);
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsDataURL(blob);
        });
      } else {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        return base64;
      }
    } catch (error) {
      console.error('Erreur lors de la conversion de l\'image :', error);
      throw error;
    }
  };



  const fetchUserProfileFromServer = async () => {
    try {
      console.log(user);
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

  useEffect(() => {
    if (user) {
      fetchUserProfileFromServer();
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(user, { displayName: `${prenom} ${nom}` });

      const formData = new FormData();
      formData.append('prenom', prenom);
      formData.append('nom', nom);
      formData.append('role', role);
      formData.append('email', user.email);

      if (profilePicture) {
        const timestamp = new Date().getTime();
        const filename = `${timestamp}_${profilePicture.split('/').pop()}`;
        const base64Image = await convertImageToBase64(profilePicture);

        formData.append('filename', filename);

        const image = {
          uri: profilePicture,
          name: filename,
          contentType: 'image/jpeg',
        };

        formData.append('profilePicture', image);
        formData.append('profilePictureBase64', base64Image);

        const storageRef = ref(FIREBASE_STORAGE, `profilePicture/${user.email}/${filename}`);
        await uploadString(storageRef, base64Image);
        const downloadURL = await getDownloadURL(storageRef);

        formData.append('profilePicture', downloadURL);
      }

      const updateUserResponse = await fetch(`http://192.168.1.21:3000/api/update-user/${user.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (updateUserResponse.ok) {
        const responseData = await updateUserResponse.json();
        alert("Succès", "Informations mises à jour avec succès !");
        setProfileFormVisibility(false);
      } else {
        const errorDetails = await updateUserResponse.json();
        console.error('Erreur lors de la mise à jour des informations:', errorDetails);
        alert("Erreur", "Erreur lors de la mise à jour des informations.");
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert("Erreur", "Erreur lors de la mise à jour du profil.");
    }
  };


  const handleChoosePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission d\'accès à la bibliothèque photo refusée!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const selectedImage = result.assets && result.assets[0];

        if (selectedImage) {
          setProfilePicture(selectedImage.uri);
          setSavePhoto(true);
        }
      }
    } catch (error) {
      console.error('Erreur lors du choix de la photo:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Auth");
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleCancelProfileForm = () => {
    setProfileFormVisibility(false);
  };

  const handleSavePhoto = async () => {
    handleUpdateProfile();
    setSavePhoto(false);
  }


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
                  {profilePicture ? (
                    <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                  ) : (
                    <Image source={require('../../assets/person.png')} style={styles.profilePicture} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                {savePhoto && (
                  <Button title="Enregistrer la photo" onPress={() => handleSavePhoto()} />
                )}
              </View>
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
