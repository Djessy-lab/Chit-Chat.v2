import { ScrollView, Text, View } from "react-native";

function DocumentsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{ fontSize: 30, fontWeight: 'bold', marginTop: 20 }}
        >
          Documents
        </Text>
      </ScrollView>
    </View>
  )
}

export default DocumentsScreen;
