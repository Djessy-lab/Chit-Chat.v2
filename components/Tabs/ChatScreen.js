import { ScrollView, Text, View } from "react-native";

function ChatScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{ fontSize: 30, fontWeight: 'bold', marginTop: 20 }}
        >
          Chat
        </Text>
      </ScrollView>
    </View>
  )
}

export default ChatScreen;
