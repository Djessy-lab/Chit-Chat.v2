import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput as PaperTextInput, Button as PaperButton, Menu, Divider, Provider } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';

const NewPostScreen = ({ onSubmit, childrenData }) => {
  const [content, setContent] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);
  const [image, setImage] = useState(null);

  // Simuler des données dynamiques pour les enfants (à remplacer par la récupération réelle de la base de données)
  const [children, setChildren] = useState([]);

  useEffect(() => {
    // Remplacez ce code avec la logique de récupération réelle des enfants depuis votre base de données
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
    // Ajoutez ici la logique pour soumettre le post
    if (content.trim() === '') {
      alert('Veuillez entrer du contenu pour votre post.');
      return;
    }

    if (!selectedChild) {
      alert('Veuillez sélectionner un enfant.');
      return;
    }

    // Appel de la fonction onSubmit avec le contenu du post, l'enfant sélectionné et l'image
    onSubmit({ content, selectedChild, image });

    // Réinitialisation du champ de contenu, de l'enfant et de l'image après soumission
    setContent('');
    setSelectedChild(null);
    setImage(null);
  };

  // Menu pour la sélection de l'enfant
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Nouveau Post</Text>

        {/* Champ de texte pour le contenu du post */}
        <PaperTextInput
          label="Contenu du Post"
          value={content}
          onChangeText={handleContentChange}
          multiline
          numberOfLines={4}
          style={styles.contentInput}
        />

        {/* Bouton pour ajouter une image */}
        <PaperButton icon="camera" mode="outlined" onPress={handleImagePick}>
          Ajouter une image
        </PaperButton>

        {/* Affichage de l'image sélectionnée (si elle existe) */}
        {image && (
          <View style={styles.imageContainer}>
            <Text>Image sélectionnée :</Text>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        )}

        {/* Sélecteur pour choisir l'enfant à identifier */}
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<PaperButton onPress={openMenu}>Sélectionner un enfant</PaperButton>}
        >
          {/* {children.map((child) => (
            <Menu.Item key={child.id} onPress={() => handleChildSelect(child)} title={child.name} />
          ))} */}
          {/* Ajoutez d'autres éléments du menu selon vos besoins */}
          <Divider />
          <Menu.Item onPress={() => handleChildSelect('Autre')} title="Autre" />
        </Menu>

        {/* Bouton de soumission du formulaire */}
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
