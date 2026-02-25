import CryptoJS from "crypto-js";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import { supabase } from "../services/supabase";

// Só abre o SQLite se NÃO for Web
const db = Platform.OS !== "web" ? SQLite.openDatabaseSync("db_owpass") : null;

export function initDB() {
  if (Platform.OS !== "web" && db) {
    try {
      db.execSync(
        "CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, service TEXT, username TEXT, password TEXT, site TEXT);",
      );
    } catch (error) {
      console.error("Erro ao inicializar SQLite:", error);
    }
  }
}

export async function savePassword(item, masterKey) {
  console.log("1. Iniciando savePassword para:", item.service);

  const encrypted = CryptoJS.AES.encrypt(item.password, masterKey).toString();
  const id = item.id || Math.random().toString(36).substring(2, 15);

  // GRAVAÇÃO LOCAL
  if (Platform.OS !== "web" && db) {
    try {
      db.runSync(
        "INSERT OR REPLACE INTO passwords (id, service, username, password, site) VALUES (?, ?, ?, ?, ?)",
        [id, item.service, item.username, encrypted, item.site],
      );
      console.log("2. Sucesso no SQLite Local");
    } catch (e) {
      console.error("ERRO no SQLite:", e);
    }
  }

  // GRAVAÇÃO NUVEM
  console.log("3. Enviando para o Supabase...");
  const { error } = await supabase.from("passwords_sync").upsert({
    id,
    service: item.service,
    username: item.username,
    password: encrypted,
    site: item.site,
  });

  if (error) {
    console.error("ERRO no Supabase:", error.message);
  } else {
    console.log("4. Sucesso no Supabase!");
  }
}

export async function getPasswords(callback) {
  if (Platform.OS === "web") {
    // No PC: Busca direto da Nuvem
    const { data } = await supabase
      .from("passwords_sync")
      .select("*")
      .order("service", { ascending: true });
    callback(data || []);
  } else {
    // No Celular: Busca do SQLite local
    try {
      const allRows = db.getAllSync("SELECT * FROM passwords");
      callback(allRows);
    } catch (_error) {
      callback([]);
    }
  }
}

export async function deletePasswordDB(id) {
  // Apaga na Nuvem
  await supabase.from("passwords_sync").delete().eq("id", id);

  // Apaga no SQLite
  if (Platform.OS !== "web" && db) {
    db.runSync("DELETE FROM passwords WHERE id = ?", [id]);
  }
  return true;
}

// Função para baixar dados da nuvem (útil para quando instalar em dispositivo novo)
export async function syncFromCloud(callback) {
  try {
    const { data, error } = await supabase.from("passwords_sync").select("*");

    if (data && !error) {
      data.forEach((item) => {
        db.runSync(
          "INSERT OR REPLACE INTO passwords (id, service, username, password, site) VALUES (?, ?, ?, ?, ?)",
          [item.id, item.service, item.username, item.password, item.site],
        );
      });
      if (callback) callback();
    }
  } catch (error) {
    console.error("Erro ao baixar dados da nuvem:", error);
  }
}
