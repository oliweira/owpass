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
import { getPasswords } from "../database/db";
import { clearSessionKey } from "../services/session";
import { supabase } from "../services/supabase";

const HomeScreen = ({ navigation }) => {
  const [passwords, setPasswords] = useState([]);
  const isFocused = useIsFocused();

  const loadPasswords = () => {
    getPasswords((data) => {
      setPasswords(data || []);
    });
  };

  useEffect(() => {
    if (isFocused) loadPasswords();
  }, [isFocused]);

  // ESCUTA A NUVEM EM TEMPO REAL
  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "passwords_sync" },
        () => {
          loadPasswords(); // Recarrega a lista se houver qualquer mudança na nuvem
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleLogout = () => {
    clearSessionKey();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Senhas</Text>

      <FlatList
        data={passwords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Details", { item })}
          >
            <Text style={styles.cardText}>{item.service}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma senha salva.</Text>
        }
        contentContainerStyle={{ paddingBottom: 150 }}
      />

      <View style={styles.fabColumn}>
        <TouchableOpacity
          style={[styles.fab, styles.fabAdd]}
          onPress={() => navigation.navigate("AddPassword")}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, styles.fabLogout]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... Seus estilos permanecem os mesmos ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cardText: { fontSize: 18 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
  fabColumn: { position: "absolute", bottom: 40, right: 20, gap: 15 },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabAdd: { backgroundColor: "#007AFF" },
  fabLogout: {
    backgroundColor: "#ff4444",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: "center",
  },
});

export default HomeScreen;
