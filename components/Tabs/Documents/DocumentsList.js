import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import { FIREBASE_AUTH } from '../../../firebase';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';


function DocumentsList() {
  const [documents, setDocuments] = useState([]);
  const user = FIREBASE_AUTH.currentUser;
  const userId = user.uid;
  const navigation = useNavigation();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useFocusEffect(
    useCallback(() => {
      fetchDocuments();
    }, [fetchDocuments])
  );

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`http://192.168.1.21:3000/api/shared-documents`, {
        params: { userId }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
    }
  };

  const handlePressDelete = (id) => {
    Alert.alert(
      'Suppression du document',
      'Êtes-vous sûr de vouloir supprimer ce document ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        { text: 'OK', onPress: () => handleDelete(id) },
      ]
    );
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.1.21:3000/api/shared-documents/${id}`);
      fetchDocuments();
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
    }
  }


  return (
    <View style={styles.container}>
      {documents
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((document, index) => (
          <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => navigation.navigate('DocumentDetail', { document: document })} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.itemTitle}>{document.title}</Text>
              <Icon
                name="trash"
                size={25}
                color="#85c2c2"
                onPress={() => handlePressDelete(document.id)}
              />
            </View>
            {document.child && <Text>{`Enfant: ${document.child.name}`}</Text>}
            <Text>{`Créé le: ${new Date(document.createdAt).toLocaleDateString('fr')}`}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  itemTitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    color: '#1A1E11',
    fontVariant: ['small-caps'],
  },
});

export default DocumentsList;
