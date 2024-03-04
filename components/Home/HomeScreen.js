import { ScrollView, Text, View } from "react-native";

function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{ fontSize: 30, fontWeight: 'bold', marginTop: 20, color: "#84AD5B" }}
        >
          ChitChat
        </Text>
      </ScrollView>
    </View>
  )
}

export default HomeScreen;
