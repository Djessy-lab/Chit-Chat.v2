import React, { useEffect, useState } from "react";
import { Button, View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from 'axios';
import { FIREBASE_AUTH } from "../../../firebase";
import { Picker } from "@react-native-picker/picker";

const UploadDocument = ({ onUploadComplete }) => {
  const [fileInfo, setFileInfo] = useState(null);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await axios.get(`http://192.168.1.21:3000/api/user/get-user/${user.uid}`);
        setChildren(response.data.children);

      } catch (error) {
        console.error('Erreur lors de la récupération des enfants:', error);
      }
    };

    fetchChildren();
  }, []);

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        setFileInfo(result);
        setDocumentTitle(result.assets[0].name);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const uploadFileToFirebase = async (fileUri, fileName) => {
    const storage = getStorage();
    const storageRef = ref(storage, `documents/${fileName}`);

    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setDocumentUrl(downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier sur Firebase:", error);
      throw error;
    }
  };

  const handleUploadAndSave = async () => {
    if (!fileInfo) {
      alert('Veuillez sélectionner un fichier d\'abord.');
      return;
    }

    try {
      const fileUrl = await uploadFileToFirebase(fileInfo.assets[0].uri, fileInfo.assets[0].name);
      const saveResponse = await axios.post('http://192.168.1.21:3000/api/shared-documents', {
        title: documentTitle,
        content: fileUrl,
        userId: user.uid,
        childId: selectedChildId
      });
      onUploadComplete();
      setFileInfo(null);
      setSelectedChildId(null);
      setDocumentTitle('');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du document:', error);
      alert('Erreur lors de la sauvegarde du document. Veuillez réessayer.');
    }
  };

  const handleCancel = () => {
    setFileInfo(null);
    console.log("Upload annulé");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Ajouter un document" onPress={selectFile} color="#4a90e2" />
      </View>
      {fileInfo && (
        <View style={styles.fileInfoContainer}>
          <Text style={styles.text}>Nom du fichier : {fileInfo.assets[0].name}</Text>
          <Text style={styles.text}>Taille : {fileInfo.assets[0].size} bytes</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setDocumentTitle}
            value={documentTitle}
            placeholder="Entrez ou modifiez le titre du document"
          />
        </View>
      )}
      {children.length > 0 && fileInfo && (
        <View style={styles.pickerContainer}>
          <Text style={styles.text}>Sélectionnez un enfant :</Text>
          {selectedChildId !== 'undefined' ? (
            <Text style={styles.text}>Enfant sélectionné : {children.find(child => child.id === selectedChildId)?.name}</Text>
          ) : (
            <Text style={styles.text}>Aucun enfant sélectionné</Text>
          )}
          <Picker
            selectedValue={selectedChildId}
            onValueChange={(itemValue, itemIndex) => setSelectedChildId(itemValue)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Sélectionnez un enfant" />
            {children.map((child) => (
              <Picker.Item key={child.id} label={child.name} value={child.id} />
            ))}
          </Picker>
        </View>
      )}
      {fileInfo && (
        <View style={styles.buttonContainer}>
          <Button title="Sauvegarder" onPress={handleUploadAndSave} />
          <Button title="Annuler" onPress={handleCancel} color="red" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  fileInfoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  pickerContainer: {
    width: '100%',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
  picker: {
    height: 200,
    width: '100%',
    color: '#444',
    marginTop: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: 'white',
  }
});

export default UploadDocument;
