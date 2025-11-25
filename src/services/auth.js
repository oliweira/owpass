import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

export async function authenticate() {
  const biometric = await LocalAuthentication.authenticateAsync({
    promptMessage: "Autentique para acessar as senhas",
  });

  if (biometric.success) return true;

  const storedPassword = await SecureStore.getItemAsync("master_password");
  return storedPassword ? "PASSWORD_REQUIRED" : "SETUP_REQUIRED";
}

export async function saveMasterPassword(password) {
  await SecureStore.setItemAsync("master_password", password);
}
