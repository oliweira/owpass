import { StatusBar } from "expo-status-bar";
import Navigation from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <>
      <Navigation />
      <StatusBar style="light" />
    </>
  );
}