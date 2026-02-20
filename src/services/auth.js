import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";

const PASSWORD_KEY = "@master_password";

export async function storePassword(password) {
  // Guardamos o HASH para conferir o login depois
  const hash = CryptoJS.SHA256(password).toString();
  await AsyncStorage.setItem(PASSWORD_KEY, hash);
}

export async function getStoredPasswordHash() {
  return await AsyncStorage.getItem(PASSWORD_KEY);
}

export async function verifyPassword(inputPassword) {
  const savedHash = await getStoredPasswordHash();
  if (!savedHash) return false;

  const inputHash = CryptoJS.SHA256(inputPassword).toString();
  return savedHash === inputHash;
}
