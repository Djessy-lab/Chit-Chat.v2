import { Button, ScrollView, StyleSheet, Text, View, ViewBase } from "react-native";

function DocumentsScreen() {
  return (
    <View style={styles.container} id="CONTAIN">
      <View style={styles.button}>
        <Button title="Ajouter un document" />
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    // display: 'flex',
    // flexDirection: 'column',
    borderColor: 'black',
    borderRadius: 7,
    borderWidth: 1,
  },
});

export default DocumentsScreen;
