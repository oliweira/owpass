import CryptoJS from "crypto-js";
import { openDatabase } from "expo-sqlite";
import { supabase } from "../services/supabase";

const db = openDatabase("db_owpass");

export function initDB() {
  db.transaction((tx) => {
    // Mudamos o ID para TEXT para suportar o ID único sincronizado
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS passwords (id TEXT PRIMARY KEY, service TEXT, username TEXT, password TEXT, site TEXT);",
    );
  });
}

export function savePassword(item, masterKey) {
  const encrypted = CryptoJS.AES.encrypt(item.password, masterKey).toString();

  // Se não tiver ID (novo cadastro), gera um ID único
  const id =
    item.id ||
    Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

  // 1. Salva Local
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT OR REPLACE INTO passwords (id, service, username, password, site) VALUES (?, ?, ?, ?, ?)",
      [id, item.service, item.username, encrypted, item.site],
    );
  });

  // 2. Sincroniza Nuvem (upsert insere ou atualiza)
  supabase
    .from("passwords_sync")
    .upsert({
      id: id,
      service: item.service,
      username: item.username,
      password: encrypted,
      site: item.site,
    })
    .then(({ error }) => {
      if (error) console.error("Erro ao sincronizar com nuvem:", error);
    });
}

// Nova função para deletar em ambos os lugares
export async function deletePasswordDB(id) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM passwords WHERE id = ?", [id], async () => {
        // Após deletar local, deleta na nuvem
        const { error } = await supabase
          .from("passwords_sync")
          .delete()
          .eq("id", id);
        resolve(!error);
      });
    });
  });
}

export function getPasswords(callback) {
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM passwords", [], (_, result) => {
      callback(result.rows._array);
    });
  });
}
