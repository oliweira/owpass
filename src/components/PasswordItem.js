import { Text, TouchableOpacity } from "react-native";

export default function PasswordItem({ item }) {
  return (
    <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text style={{ fontSize: 18 }}>{item.service}</Text>
    </TouchableOpacity>
  );
}
