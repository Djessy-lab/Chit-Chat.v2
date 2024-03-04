import { ScrollView, Text, View } from "react-native";

function TransmissionsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{ fontSize: 30, fontWeight: 'bold', marginTop: 20 }}
        >
          Transmission
        </Text>
      </ScrollView>
    </View>
  )
}

export default TransmissionsScreen;
