import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import UploadDocument from "./UploadDocument";
import DocumentsList from "./DocumentsList";

function DocumentsScreen() {

  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };



  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestion des Documents</Text>
      <UploadDocument onUploadComplete={handleUploadComplete} />
      <DocumentsList key={refreshKey} />
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
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#1A1E11',
    fontVariant: ['small-caps'],
  },
});


export default DocumentsScreen;
