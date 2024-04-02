import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from 'axios';
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';

const Cards = ({ post, onDelete, onEdit }) => {
  const [child, setChild] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.21:3000/api/child/${post.childId}`);
        setChild(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'enfant:', error);
      }
    };

    fetchChildDetails();
  }, [post.childId]);


  const createdAtDate = new Date(post.createdAt);
  const formattedDate = format(createdAtDate, "dd MMMM yyyy", { locale: fr });

  const handleDeletePress = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer ce post ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", onPress: () => onDelete(post.id) },
      ]
    );
  };

  const handleEditPress = () => {
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://192.168.1.21:3000/api/posts/${post.id}`, {
        content: editedContent,
      });

      setEditMode(false);
      onEdit(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du post:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(post.content);
    setEditMode(false);
  };

  return (
    <View style={styles.card}>
      {editMode ? (
        <>
          <TextInput
            style={styles.editInput}
            value={editedContent}
            onChangeText={setEditedContent}
          />
          <Button title="Enregistrer" onPress={handleSaveEdit} />
          <Button title="Annuler" onPress={handleCancelEdit} />
        </>
      ) : (
        <>
          {post.user && (
            <View style={styles.userInfo}>
              {post.user.profilePicture ? (
                <Image
                  source={{ uri: post.user.profilePicture }}
                  style={styles.userPhoto}
                />
              ) : (
                <Image
                  source={require('../../assets/person.png')}
                  style={styles.placeholderImage}
                />
              )}
              <Text style={styles.userName}>{post.user.prenom} {post.user.nom}</Text>
            </View>
          )}

          <View style={styles.headerCardContainer}>
            <Text style={styles.cardDate}>{formattedDate}</Text>
          </View>
          <Image source={{ uri: post.image }} style={styles.cardImage} />
          <Text style={styles.cardContent}>{post.content}</Text>
          {child && (
            <Text style={[styles.cardChildName, { alignSelf: "flex-end" }]}>{child.name}</Text>
          )}
          <View style={styles.iconContainer}>
            <Icon name="trash" size={25} color={'#85c2c2'} onPress={handleDeletePress} />
            <Icon name="edit" size={25} color={'#85c2c2'} onPress={handleEditPress} />
          </View>
        </>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    marginTop: 30,
    backgroundColor: '#f6f9f2',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1,
    width: "90%"
  },
  cardImage: {
    width: "100%",
    height: 300,
    borderRadius: 0,
    objectFit: "contain",
    alignSelf: "center",
  },
  cardContent: {
    padding: 15,
    fontSize: 16,
  },
  cardDate: {
    fontSize: 10,
    marginLeft: 45,
  },
  cardChildName: {
    padding: 5,
    fontSize: 14,
    marginRight: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  editInput: {
    padding: 15,
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    padding: 10,
  },
  headerCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userPhoto: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginRight: 10,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#ccc', // Couleur de fond du placeholder
  }
});

export default Cards;
