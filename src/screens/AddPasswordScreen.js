import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { savePassword } from "../database/db";
import { getSessionKey } from "../services/session";

export default function AddPasswordScreen({ route, navigation }) {
  // Pegamos o item que veio lá da visualização
  const editItem = route.params?.item;

  const [service, setService] = useState(editItem?.service || "");
  const [username, setUsername] = useState(editItem?.username || "");
  const [password, setPassword] = useState("");
  const [site, setSite] = useState(editItem?.site || "");

  // Se for edição, precisamos descriptografar a senha para mostrar no campo
  useEffect(() => {
    if (editItem) {
      const key = getSessionKey();
      try {
        const bytes = CryptoJS.AES.decrypt(editItem.password, key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        setPassword(originalText);
      } catch (e) {
        console.error("Erro ao descriptografar", e);
      }
    }
  }, [editItem]);

  const generateStrongPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let newPassword = "";
    for (let i = 0; i < 10; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword); // Preenche o campo de senha automaticamente
  };

  async function save() {
    console.log("Salvando senha para serviço:", service);
    if (!service || !password) {
      Alert.alert("Erro", "Por favor, preencha o serviço e a senha.");
      return;
    }
    const key = getSessionKey();
    if (!key) {
      Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
      return;
    }
    try {
      await savePassword(
        {
          id: editItem?.id, // IMPORTANTE: mantém o ID para não criar duplicata
          service: service,
          username: username,
          password: password,
          site: site,
        },
        key,
      );
      // Se for edição manda para a tela Home, se for criação volta para a tela anterior
      if (editItem) {
        navigation.navigate("Home");
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Não foi possível salvar a senha.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editItem ? "Editar Registro" : "Nova Senha"}
      </Text>
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
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Senha *</Text>
      {/* Container horizontal para alinhar Input e Botão Gerar */}
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          secureTextEntry={false} // Alterado para false para você ver a senha gerada
          placeholder="Sua senha secreta"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateStrongPassword}
        >
          <Text style={styles.generateButtonText}>Gerar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Site (Opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: www.netflix.com"
        value={site}
        onChangeText={setSite}
      />
      <TouchableOpacity style={styles.saveButton} onPress={save}>
        <Text style={styles.buttonText}>
          {editItem ? "Confirmar Alterações" : "Salvar Senha"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontWeight: "bold", marginTop: 15, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    marginBottom: 5,
  },
  // Estilos novos para o layout do gerador
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: "center",
  },
  generateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  saveButton: {
    backgroundColor: "rgb(0, 69, 187)",
    padding: 18,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
