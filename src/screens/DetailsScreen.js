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
import { deletePassword } from "../services/storage";

const DetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [decryptedPassword, setDecryptedPassword] = useState("A carregar...");

  useEffect(() => {
    async function handleDecrypt() {
      try {
        // Se a sua função decrypt for assíncrona, usamos await
        const password = await decrypt(item.password);
        setDecryptedPassword(password);
      } catch (error) {
        setDecryptedPassword("Erro ao descriptografar");
        console.error(error);
      }
    }
    handleDecrypt();
  }, [item.password]);

  // Função centralizada para executar a exclusão
  const executeDelete = async () => {
    try {
      const success = await deletePassword(item.id);
      if (success) {
        navigation.goBack(); // Volta para a Home
      } else {
        console.error("Erro ao apagar do storage");
      }
    } catch (error) {
      console.error("Erro fatal ao apagar:", error);
    }
  };

  const handleDelete = () => {
    const mensagem = `Tem certeza que deseja apagar a senha de ${item.service}?`;

    // VERIFICAÇÃO DE PLATAFORMA (Importante para o Browser)
    if (Platform.OS === "web") {
      // Se estiver no navegador, usa o confirm padrão do JS
      const confirmed = window.confirm(mensagem);
      if (confirmed) {
        executeDelete();
      }
    } else {
      // Se estiver no telemóvel (Android/iOS), usa o Alert do React Native
      Alert.alert("Excluir Senha", mensagem, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: executeDelete,
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>SERVIÇO</Text>
        <Text style={styles.value}>{item.service}</Text>

        <Text style={styles.label}>USUÁRIO</Text>
        <Text style={styles.value}>{item.user}</Text>

        <Text style={styles.label}>SENHA</Text>
        <Text style={styles.passwordValue}>{decryptedPassword}</Text>

        {item.site && (
          <>
            <Text style={styles.label}>SITE</Text>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  label: {
    fontSize: 12,
    color: "#8e8e93",
    fontWeight: "bold",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: "#1c1c1e",
    marginBottom: 20,
  },
  passwordValue: {
    fontSize: 22,
    color: "#ff3b30", // Vermelho para destacar a senha
    fontWeight: "bold",
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DetailsScreen;
