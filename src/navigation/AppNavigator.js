import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import AddPasswordScreen from "../screens/AddPasswordScreen";
import DetailsScreen from "../screens/DetailsScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import { getStoredPassword } from "../services/auth";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const savedPassword = await getStoredPassword();
      setIsAuthenticated(savedPassword ? true : false);
    }
    checkAuth();
  }, []);

  if (isAuthenticated === null) return null; // loading state futuramente

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddPassword" component={AddPasswordScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
