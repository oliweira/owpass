import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { storePassword } from "../services/auth";

export default function LoginScreen({ navigation }) {
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (password.length < 4) return alert("Senha mínima de 4 dígitos");
    await storePassword(password);
    navigation.navigate("Home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Digite sua senha:</Text>
      <TextInput
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  label: { fontSize: 22, marginBottom: 15 },
  input: { borderWidth: 1, padding: 15, marginBottom: 20, borderRadius: 10 },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10 },
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
});
