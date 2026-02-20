import CryptoJS from "crypto-js";
import * as Crypto from "expo-crypto";

// Correção para o erro de Native Crypto que resolvemos antes
CryptoJS.lib.WordArray.random = (nBytes) => {
  const words = [];
  const randomBytes = Crypto.getRandomValues(new Uint8Array(nBytes));
  for (let i = 0; i < nBytes; i += 4) {
    words.push(
      (randomBytes[i] << 24) |
        (randomBytes[i + 1] << 16) |
        (randomBytes[i + 2] << 8) |
        randomBytes[i + 3],
    );
  }
  return new CryptoJS.lib.WordArray.init(words, nBytes);
};

// Agora as funções pedem a masterKey
export const encrypt = (text, masterKey) => {
  try {
    return CryptoJS.AES.encrypt(text, masterKey).toString();
  } catch (error) {
    return error.message || "Erro ao criptografar";
  }
};

export const decrypt = (ciphertext, masterKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, masterKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return error.message || "Erro ao descriptografar";
  }
};
