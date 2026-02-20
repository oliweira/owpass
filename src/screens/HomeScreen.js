import Ionicons from "@expo/vector-icons/Ionicons";
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
import { getListPasswords } from "../services/storage";

const HomeScreen = ({ navigation }) => {
  const [passwords, setPasswords] = useState([]);
  const isFocused = useIsFocused(); // Hook que detecta se a tela está ativa

  // Função para buscar os dados
  const loadPasswords = async () => {
    try {
      const data = await getListPasswords();
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
      </View>

      {/* COLUNA DE BOTÕES FLUTUANTES (FAB COLUMN) */}
      <View style={styles.fabColumn}>
        {/* Botão Adicionar (Azul - Em cima) */}
        <TouchableOpacity
          onPress={() => navigation.navigate("AddPassword")}
          style={[styles.fab, styles.fabAdd]}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>

        {/* Botão Sair (Vermelho - Em baixo) */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.fab, styles.fabLogout]}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    textAlign: "center",
  },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
  // CONTAINER DA COLUNA
  fabColumn: {
    position: "absolute",
    bottom: 60,
    right: 20,
    alignItems: "center",
    gap: 15, // Espaço entre os botões
  },

  // ESTILO BASE DO CÍRCULO
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabAdd: {
    backgroundColor: "#007AFF",
  },
  fabLogout: {
    backgroundColor: "#ff4444",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardText: { fontSize: 18 },
});

export default HomeScreen;
