import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { TextInput as PaperTextInput, Button as PaperButton, Menu, Divider, Provider } from 'react-native-paper';
import axios from 'axios';
import { FIREBASE_AUTH } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../../firebase';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const NewPostScreen = ({ navigation }) => {
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;
  const [content, setContent] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);
  const [image, setImage] = useState(null);
  const [children, setChildren] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://192.168.1.21:3000/api/child');
      setChildren(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des enfants:', error);
    }
  };

  const handleContentChange = (text) => {
    setContent(text);
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    closeMenu();
  };

  const handleChooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission d\'accès à la bibliothèque photo refusée!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const compressedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [],
        { compress: 0.4 }
      );
      setImage(compressedImage.uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(FIREBASE_STORAGE, `posts/${user.uid}/${new Date().toISOString()}`);
      await uploadBytes(storageRef, blob);
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image :", error);
      throw error;
    }
  };


  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const handleSubmit = async () => {
    if (content.trim() === '' || !selectedChild) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const response = await axios.post('http://192.168.1.21:3000/api/posts', {
        content,
        childId: selectedChild.id,
        image: imageUrl,
        userId: user.uid,
      });


      setContent('');
      setSelectedChild(null);
      setImage(null);

      navigation.navigate('Home');

      console.log('Post ajouté avec succès:', response.data);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du post:', error);
      alert('Erreur lors de l\'ajout du post. Veuillez réessayer.');
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Nouveau Post</Text>

        <PaperTextInput
          label="Contenu du Post"
          value={content}
          onChangeText={handleContentChange}
          multiline
          numberOfLines={4}
          style={styles.contentInput}
        />

        <Button title="Choisir une image" onPress={handleChooseImage} />

        {image && (
          <View style={styles.imageContainer}>
            <Text>Image :</Text>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        )}



        {selectedChild && (
          <Text style={styles.selectedChildText}>
            Enfant sélectionné : {selectedChild.name}
          </Text>
        )}

        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<PaperButton onPress={openMenu}>Sélectionner un enfant</PaperButton>}
        >
          {children.map((child) => (
            <Menu.Item key={child.id} onPress={() => handleChildSelect(child)} title={child.name} />
          ))}
          <Divider />
          <Menu.Item onPress={() => handleChildSelect('Autre')} title="Autre" />
        </Menu>

        <PaperButton mode="contained" onPress={handleSubmit} style={styles.submitButton}>
          Poster
        </PaperButton>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  contentInput: {
    marginBottom: 16,
  },
  imageInput: {
    marginBottom: 16,
  },
  imageContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 8,
  },
  selectedChildText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#84AD5B',
  },
});

export default NewPostScreen;
