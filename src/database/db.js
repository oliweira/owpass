import CryptoJS from "crypto-js";
import { openDatabase } from "expo-sqlite";

// Abre (ou cria) o banco
const db = openDatabase("passwords.db");

export function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT,
        password TEXT NOT NULL,
        url TEXT
      );
      `
    );
  });
}

export function savePassword(item, masterKey) {
  const encrypted = CryptoJS.AES.encrypt(item.password, masterKey).toString();

  db.transaction(tx => {
    tx.executeSql(
      "INSERT INTO passwords (name, username, password, url) VALUES (?, ?, ?, ?)",
      [item.name, item.username, encrypted, item.url]
    );
  });
}

export function getPasswords(callback) {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM passwords",
      [],
      (_, result) => callback(result.rows._array),
      (_, err) => console.log("Erro ao buscar senhas", err)
    );
  });
}
