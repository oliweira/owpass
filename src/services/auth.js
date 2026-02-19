import AsyncStorage from "@react-native-async-storage/async-storage";

const PASSWORD_KEY = "@master_password";

export async function storePassword(password) {
  await AsyncStorage.setItem(PASSWORD_KEY, password);
}

export async function getStoredPassword() {
  const password = await AsyncStorage.getItem(PASSWORD_KEY);
  return password;
}
