import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const DocumentDetail = ({ route }) => {
  const { document } = route.params;
  const user = document.user;
  const [userData, setUserData] = useState(null);
  const webViewRef = useRef(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [document.content]);

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, [document.content]);

  useEffect(() => {
    setUserData(null)
    if (user) {
      fetchUser();
    }
  }, [user]);


  const fetchUser = async () => {
    try {
      setUserData(null)
      const response = await axios.get(`http://192.168.1.21:3000/api/user/get-user/${document.user.uid}`);
      setUserData(response.data);
    }
    catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView key={key} ref={webViewRef} source={{ uri: document.content }} style={{ height: 200 }} />
      <Text style={styles.title}>{document.title}</Text>
      <Text style={styles.user}>{`Utilisateur: ${document.user.prenom}-${document.user.nom}`}</Text>
      <Text style={styles.user}>{document.child ? `Enfant : ${document.child.name}` : ''}</Text>
      <Text style={styles.createdAt}>{`Créé le: ${new Date(document.createdAt).toLocaleDateString('fr')}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  user: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  createdAt: {
    fontSize: 14,
    color: '#666',
  },
});

export default DocumentDetail;
