import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput as PaperTextInput, Button as PaperButton, Menu, Divider, Provider } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';

const NewPostScreen = ({ onSubmit, childrenData }) => {
  const [content, setContent] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);
  const [image, setImage] = useState(null);

  const [children, setChildren] = useState([]);

  useEffect(() => {
    setChildren(childrenData);
  }, [childrenData]);

  const handleContentChange = (text) => {
    setContent(text);
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    closeMenu();
  };

  const handleImagePick = () => {
    ImagePicker.showImagePicker({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error) {
        setImage(response.uri);
      }
    });
  };

  const handleSubmit = () => {
    if (content.trim() === '') {
      alert('Veuillez entrer du contenu pour votre post.');
      return;
    }

    if (!selectedChild) {
      alert('Veuillez sélectionner un enfant.');
      return;
    }

    onSubmit({ content, selectedChild, image });

    setContent('');
    setSelectedChild(null);
    setImage(null);
  };

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

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

        <PaperButton icon="camera" mode="outlined" onPress={handleImagePick}>
          Ajouter une image
        </PaperButton>

        {image && (
          <View style={styles.imageContainer}>
            <Text>Image sélectionnée :</Text>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        )}

        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<PaperButton onPress={openMenu}>Sélectionner un enfant</PaperButton>}
        >
          {/* {children.map((child) => (
            <Menu.Item key={child.id} onPress={() => handleChildSelect(child)} title={child.name} />
          ))} */}
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
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contentInput: {
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
  submitButton: {
    marginTop: 16,
  },
});

export default NewPostScreen;
