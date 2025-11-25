import CryptoJS from "crypto-js";

// use uma chave fixa apenas para teste
// depois vamos trocar pela senha mestre do usuário e PBKDF2
const SECRET_KEY = "minha-chave-secreta-super-segura";

export function encrypt(text) {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
}