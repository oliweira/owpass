import { Ionicons } from "@expo/vector-icons"; // Para os ícones de olho e copiar
import * as Clipboard from "expo-clipboard"; // Adicionado para copiar
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { decrypt } from "../services/crypto";
import { getSessionKey } from "../services/session";
import { deletePassword } from "../services/storage";

const DetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [decryptedPassword, setDecryptedPassword] = useState("A carregar...");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/esconder

  useEffect(() => {
    async function handleDecrypt() {
      try {
        const key = getSessionKey();
        const passwordDecrypt = await decrypt(item.password, key);
        setDecryptedPassword(passwordDecrypt);
      } catch (error) {
        setDecryptedPassword("Erro ao descriptografar");
        console.error(error);
      }
    }
    handleDecrypt();
  }, [item.password]);

  // Função para copiar a senha
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(decryptedPassword);
    if (Platform.OS === "web") {
      alert("Copiado para a área de transferência!");
    } else {
      Alert.alert("Copiado!", "A senha foi copiada com sucesso.");
    }
  };

  const executeDelete = async () => {
    try {
      const success = await deletePassword(item.id);
      if (success) {
        navigation.goBack();
      } else {
        console.error("Erro ao apagar do storage");
      }
    } catch (error) {
      console.error("Erro fatal ao apagar:", error);
    }
  };

  const handleDelete = () => {
    const mensagem = `Tem certeza que deseja apagar a senha de ${item.service}?`;
    if (Platform.OS === "web") {
      const confirmed = window.confirm(mensagem);
      if (confirmed) executeDelete();
    } else {
      Alert.alert("Excluir Senha", mensagem, [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: executeDelete },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Serviço</Text>
        <Text style={styles.value}>{item.service}</Text>

        <Text style={styles.label}>Usuário</Text>
        <Text style={styles.value}>{item.username}</Text>

        <Text style={styles.label}>Senha</Text>
        {/* Container horizontal para a senha e ações */}
        <View style={styles.passwordContainer}>
          <Text style={styles.passwordValue}>
            {showPassword ? decryptedPassword : "••••••••"}
          </Text>

          <View style={styles.actionButtons}>
            {/* Botão para mostrar/esconder */}
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconButton}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#8e8e93"
              />
            </TouchableOpacity>

            {/* Botão para copiar */}
            <TouchableOpacity
              onPress={copyToClipboard}
              style={styles.iconButton}
            >
              <Ionicons name="copy-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {item.site && (
          <>
            <Text style={styles.label}>Site</Text>
            <Text style={styles.value}>{item.site}</Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteButtonText}>Excluir Senha</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 30,
  },
  label: {
    fontSize: 12,
    color: "#8e8e93",
    fontWeight: "bold",
    marginBottom: 4,
  },
  value: { fontSize: 18, color: "#1c1c1e", marginBottom: 20 },
  // Estilos novos para o container de senha
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  passwordValue: {
    fontSize: 20,
    color: "#ff3b30",
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  actionButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default DetailsScreen;
