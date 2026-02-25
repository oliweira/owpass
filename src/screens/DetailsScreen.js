import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deletePasswordDB } from "../database/db"; // Usando a nova função do DB
import { decrypt } from "../services/crypto";
import { getSessionKey } from "../services/session";

const DetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [decryptedPassword, setDecryptedPassword] = useState("A carregar...");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function handleDecrypt() {
      try {
        const key = getSessionKey();
        const passwordDecrypt = await decrypt(item.password, key);
        setDecryptedPassword(passwordDecrypt);
      } catch (_error) {
        setDecryptedPassword("Erro ao descriptografar");
      }
    }
    handleDecrypt();
  }, [item.password]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(decryptedPassword);
    Alert.alert("Copiado!", "Senha enviada para a área de transferência.");
  };

  const executeDelete = async () => {
    const success = await deletePasswordDB(item.id);
    if (success) {
      navigation.goBack();
    } else {
      Alert.alert("Erro", "Não foi possível excluir a senha.");
    }
  };

  const handleDelete = () => {
    Alert.alert("Excluir", `Deseja apagar a senha de ${item.service}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: executeDelete },
    ]);
  };

  const handleEdit = () => {
    // Navega para a tela de adicionar, mas enviando os dados do item
    navigation.navigate("AddPassword", { item: item, navigation });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Serviço</Text>
        <Text style={styles.value}>{item.service}</Text>

        <Text style={styles.label}>Usuário</Text>
        <Text style={styles.value}>{item.username}</Text>

        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordContainer}>
          <Text style={styles.passwordValue}>
            {showPassword ? decryptedPassword : "••••••••"}
          </Text>
          <View style={styles.actionButtons}>
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
      {/* Container para alinhar os botões horizontalmente */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    color: "#ff3b30",
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  actionButtons: { flexDirection: "row" },
  iconButton: { marginLeft: 15 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Espaça os botões igualmente
    marginTop: 20,
    width: "100%",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    width: "48%",
  },
  editButton: {
    backgroundColor: "rgb(19, 187, 0)",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    width: "48%",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default DetailsScreen;
