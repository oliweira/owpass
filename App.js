import { useEffect } from "react";
import { initDB } from "./src/database/db";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  useEffect(() => {
    try {
      // Inicializa o banco de dados e cria as tabelas se não existirem
      initDB();
      console.log("Banco de dados inicializado com sucesso.");
    } catch (error) {
      console.error("Erro ao inicializar o banco de dados:", error);
    }
  }, []);

  return <AppNavigator />;
}
