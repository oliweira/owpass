import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import AddPasswordScreen from "../screens/AddPasswordScreen";
import DetailsScreen from "../screens/DetailsScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import { getStoredPasswordHash } from "../services/auth"; // Nome atualizado para refletir o uso de Hash

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [hasPasswordSaved, setHasPasswordSaved] = useState(null);

  useEffect(() => {
    async function checkExistingPassword() {
      try {
        // Verifica se existe um HASH de senha mestra no storage
        const savedHash = await getStoredPasswordHash();
        console.log("Status do Hash salvo:", savedHash ? "Existe" : "Vazio");

        // Se houver hash, ele deve ir para o Login. Se não, ele cria a senha.
        setHasPasswordSaved(!!savedHash);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setHasPasswordSaved(false);
      }
    }
    checkExistingPassword();
  }, []);

  if (hasPasswordSaved === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        // Se já tem senha, vai para Login. Se não tem, vai para Login também (onde ele criará a senha)
        initialRouteName="Login"
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Gerenciador de Senhas" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Gerenciador de Senhas" }}
        />
        <Stack.Screen
          name="AddPassword"
          component={AddPasswordScreen}
          options={{ title: "Gerenciador de Senhas" }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ title: "Gerenciador de Senhas" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
