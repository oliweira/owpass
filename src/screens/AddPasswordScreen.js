import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { encrypt } from "../services/crypto";
import { savePassword } from "../services/storage";

export default function AddPasswordScreen({ navigation }) {
  const [service, setService] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [site, setSite] = useState("");

  async function save() {
    const encrypted = await encrypt(password);
    const success = await savePassword({
      service: service,
      username: user,
      password: encrypted, // Salvamos a versão segura
      site: site,
    });
    if (success) {
      navigation.goBack();
    } else {
      alert("Erro ao salvar senha");
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Serviço *</Text>
      <TextInput
        style={{ borderWidth: 1 }}
        value={service}
        onChangeText={setService}
      />

      <Text>Usuário</Text>
      <TextInput
        style={{ borderWidth: 1 }}
        value={user}
        onChangeText={setUser}
      />

      <Text>Senha *</Text>
      <TextInput
        style={{ borderWidth: 1 }}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text>Site</Text>
      <TextInput
        style={{ borderWidth: 1 }}
        value={site}
        onChangeText={setSite}
      />

      <Button title="Salvar" onPress={save} />
    </View>
  );
}
