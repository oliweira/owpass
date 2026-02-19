import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { decrypt } from "../services/crypto";
import { deletePassword } from "../services/storage"; // Importamos a função que criamos no storage.js

const DetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [decryptedPassword, setDecryptedPassword] = useState("Carregando...");

  useEffect(() => {
    async function handleDecrypt() {
      const password = await decrypt(item.password);
      setDecryptedPassword(password);
    }
    handleDecrypt();
  }, [item.password]);

  // Função para confirmar e excluir
  const handleDelete = () => {
    Alert.alert(
      "Excluir Senha",
      `Tem certeza que deseja excluir a senha de ${item.service}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const success = await deletePassword(item.id);
            if (success) {
              // Volta para a Home. O useIsFocused que colocamos na Home
              // vai cuidar de atualizar a lista automaticamente!
              navigation.goBack();
            } else {
              Alert.alert("Erro", "Não foi possível excluir a senha.");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Serviço</Text>
        <Text style={styles.value}>{item.service}</Text>

        <Text style={styles.label}>Usuário / E-mail</Text>
        <Text style={styles.value}>{item.username}</Text>

        <Text style={styles.label}>Senha</Text>
        <Text style={styles.passwordValue}>{decryptedPassword}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
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
    borderRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  label: { fontSize: 14, color: "#888", marginBottom: 5 },
  value: { fontSize: 18, fontWeight: "bold", marginBottom: 20, color: "#333" },
  passwordValue: { fontSize: 22, color: "#e74c3c", fontWeight: "bold" },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default DetailsScreen;
