import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@owpass_passwords";

// 1. Buscar todas as senhas salvas
export const getListPasswords = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Erro ao buscar senhas:", error);
    return [];
  }
};

// 2. Salvar uma nova senha na lista existente
export const savePassword = async (newPasswordObject) => {
  try {
    // Busca a lista atual primeiro
    const currentPasswords = await getListPasswords();

    // Adiciona a nova senha com um ID único (timestamp)
    const updatedPasswords = [
      ...currentPasswords,
      { ...newPasswordObject, id: Date.now().toString() },
    ];

    // Salva a lista atualizada
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPasswords));
    return true;
  } catch (error) {
    console.error("Erro ao salvar senha:", error);
    return false;
  }
};

// 3. Deletar uma senha pelo ID
export const deletePassword = async (id) => {
  try {
    const passwords = await getListPasswords();
    // Filtra removendo o ID que recebemos
    const filtered = passwords.filter((p) => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
};
