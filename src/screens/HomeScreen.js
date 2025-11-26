import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Home!</Text>

      <TouchableOpacity onPress={() => navigation.navigate("AddPassword")}>
        <Text>Adicionar senha</Text>
      </TouchableOpacity>
    </View>
  );
}
