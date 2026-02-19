import CryptoJS from "crypto-js";

// use uma chave fixa apenas para teste
// depois vamos trocar pela senha mestre do usuário e PBKDF2
const SECRET_KEY =
  "b1f8c8d497ce76bfffc20ea71ad38121b9c8e5f1a2d3e4f6g7h8i9j0k1l2";

// 1. Função para Criptografar (usada no AddPasswordScreen)
export const encrypt = async (text) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    return ciphertext;
  } catch (error) {
    console.error("Erro na criptografia:", error);
    return null;
  }
};

// 2. Função para Descriptografar (usada no DetailsScreen)
export const decrypt = async (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (!originalText) throw new Error("Falha na decodificação");

    return originalText;
  } catch (error) {
    console.error("Erro na descriptografia:", error);
    return "Erro: Senha inválida";
  }
};
