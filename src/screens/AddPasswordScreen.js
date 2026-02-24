import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { savePassword } from "../database/db"; // Importando do novo banco de dados
import { getSessionKey } from "../services/session";

export default function AddPasswordScreen({ navigation }) {
  const [service, setService] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [site, setSite] = useState("");

  async function save() {
    // 1. Validação básica
    if (!service || !password) {
      Alert.alert("Erro", "Por favor, preencha o serviço e a senha.");
      return;
    }

    // 2. Recupera a chave mestra da sessão
    const key = getSessionKey();

    if (!key) {
      Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      // 3. Salva usando a nova lógica (SQLite + Supabase)
      // Passamos a senha em texto limpo pois o db.js cuida da criptografia
      await savePassword(
        {
          service: service,
          username: user,
          password: password,
          site: site,
        },
        key,
      );

      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Não foi possível salvar a senha.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Serviço *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Netflix, Gmail..."
        value={service}
        onChangeText={setService}
      />

      <Text style={styles.label}>Usuário/E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: usuario@email.com"
        value={user}
        onChangeText={setUser}
      />

      <Text style={styles.label}>Senha *</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Sua senha secreta"
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Site (Opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: www.netflix.com"
        value={site}
        onChangeText={setSite}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Salvar Senha" onPress={save} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  label: { fontWeight: "bold", marginTop: 15, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
});
