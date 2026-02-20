import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getStoredPasswordHash,
  storePassword,
  verifyPassword,
} from "../services/auth";
import { setSessionKey } from "../services/session";

export default function LoginScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [isFirstAccess, setIsFirstAccess] = useState(null);

  useEffect(() => {
    async function checkFirstAccess() {
      try {
        const saved = await getStoredPasswordHash();
        // Se a nova key @admin_master_password retornar null, é primeiro acesso
        setIsFirstAccess(!saved);
      } catch (error) {
        console.error("Erro ao checar senha:", error);
        setIsFirstAccess(true); // Na dúvida, assume primeiro acesso para não travar
      }
    }
    checkFirstAccess();
  }, []);

  async function handleAction() {
    if (password.length < 4) {
      Alert.alert("Erro", "Senha mínima de 4 dígitos");
      return;
    }

    try {
      if (isFirstAccess) {
        await storePassword(password);
        setSessionKey(password);
        Alert.alert("Sucesso", "Senha mestra configurada!");
        navigation.replace("Home");
      } else {
        const isValid = await verifyPassword(password);
        if (isValid) {
          setSessionKey(password);
          navigation.replace("Home");
        } else {
          Alert.alert("Erro", "Senha incorreta");
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um problema ao processar a senha.");
    }
  }

  // Se estiver carregando, mostra um ícone de carregamento em vez de tela branca
  if (isFirstAccess === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, textAlign: "center" }}>
          Verificando segurança...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {isFirstAccess ? "Crie sua senha mestra:" : "Digite sua senha:"}
      </Text>
      <TextInput
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
        placeholder="****"
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleAction}>
        <Text style={styles.buttonText}>
          {isFirstAccess ? "Configurar e Entrar" : "Entrar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  label: { fontSize: 22, marginBottom: 15, textAlign: "center", color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    color: "#000",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
