import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { clearSessionKey } from "../services/session";
import { getStoredPasswords } from "../services/storage";

const HomeScreen = ({ navigation }) => {
  const [passwords, setPasswords] = useState([]);
  const isFocused = useIsFocused(); // Hook que detecta se a tela está ativa

  // Função para buscar os dados
  const loadPasswords = async () => {
    try {
      const data = await getStoredPasswords();
      setPasswords(data || []);
    } catch (error) {
      console.error("Erro ao carregar senhas:", error);
    }
  };

  const handleLogout = () => {
    clearSessionKey(); // Apaga a senha da RAM
    navigation.replace("Login"); // Redireciona para o Login
  };

  // Recarrega sempre que a tela ganhar foco (ao voltar de 'AddPassword')
  useEffect(() => {
    if (isFocused) {
      loadPasswords();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Senhas</Text>

        {passwords.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma senha cadastrada ainda.</Text>
        ) : (
          <FlatList
            data={passwords}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ padding: 10, borderBottomWidth: 1 }}
                onPress={() => navigation.navigate("Details", { item })}
              >
                <Text style={{ fontSize: 18 }}>{item.service}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddPassword")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
  addButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: { color: "#fff", fontSize: 30, fontWeight: "bold" },
});

export default HomeScreen;
