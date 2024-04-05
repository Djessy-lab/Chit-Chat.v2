import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FIREBASE_AUTH, FIREBASE_STORAGE } from "../../firebase";
import { signOut, updateProfile } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import ProfileForm from "./ProfilForm";
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';
import { MaterialIcons } from '@expo/vector-icons';

const ProfilScreen = ({ navigation }) => {
  const auth = FIREBASE_AUTH;
  const [user, setUser] = useState(auth.currentUser);
  const [isProfileFormVisible, setProfileFormVisibility] = useState(false);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [role, setRole] = useState("USER");
  const [profilePicture, setProfilePicture] = useState(null);
  const [savePhoto, setSavePhoto] = useState(false);
  const [children, setChildren] = useState([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(null);

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
        setChildren(userProfileData.children || []);
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

  const toggleChildSelection = (index) => {
    setSelectedChildIndex(prevIndex => prevIndex === index ? null : index);
  };



  return (
    <View style={styles.container}>
      {user && (
        <>
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
              <Text style={styles.email}>Email: {user.email}</Text>
              <View>
                {children.length > 0 ? (
                  children.map((child, index) => (
                    <View key={index} style={styles.childItem}>
                      <View style={styles.iconContainer}>
                        <Text style={styles.childName}>{child.name}</Text>
                        <TouchableOpacity onPress={() => toggleChildSelection(index)}>
                          {/* <MaterialIcons style={styles.icon} name={selectedChildIndex === index ? "info" : "info-outline"} size={24} color="black" /> */}
                          <Image source={require('../../assets/family.png') } style={selectedChildIndex === index ? styles.iconOpacity : styles.icon}  />
                        </TouchableOpacity>
                      </View>
                      {selectedChildIndex === index && (
                        <View style={styles.tooltip}>
                          {child.associatedUsers.length > 0 ? (
                            child.associatedUsers.map((user, userIndex) => (
                              <Text key={userIndex} style={styles.userInfo}>
                                {user.prenom} {user.nom}
                              </Text>
                            ))
                          ) : (
                            <Text style={styles.userInfo}>Aucun utilisateur associé</Text>
                          )}
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <Text>Aucun enfant associé.</Text>
                )}
              </View>
              <View >
                <Text style={styles.role}>{role === 'USER' ? 'Parent' : 'Nounou'}</Text>
              </View>
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
    fontSize: 14,
    fontVariant: 'small-caps',
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
  enfants: {
    marginVertical: 20,
    fontSize: 20,
    textAlign: 'center',
  },
  childName: {
    fontSize: 16,
    fontVariant: 'small-caps',
    textAlign: 'center',
  },
  role: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
    fontVariant: 'small-caps',
  },
  childrenList: {
    alignItems: 'center',
    marginTop: 20,
  },
  childItem: {
    flexDirection: 'col',
    alignItems: 'center',
    padding: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  icon: {
    marginHorizontal: 10,
    width: 24,
    height: 24,
  },
  iconOpacity: {
    marginHorizontal: 10,
    width: 24,
    height: 24,
    opacity: 0.5,
  },
  tooltip: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  userInfo: {
    fontSize: 16,
  },
});

export default ProfilScreen;
