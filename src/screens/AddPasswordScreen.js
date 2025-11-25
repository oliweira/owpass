import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { encrypt } from '../services/crypto';
import { savePassword } from '../services/storage';


export default function AddPasswordScreen({ navigation }) {
const [name, setName] = useState("");
const [user, setUser] = useState("");
const [password, setPassword] = useState("");
const [site, setSite] = useState("");


async function save() {
const encrypted = await encrypt(password);
await savePassword({ name, user, password: encrypted, site });
navigation.goBack();
}


return (
<View style={{ padding: 20 }}>
<Text>Nome *</Text>
<TextInput style={{ borderWidth: 1 }} value={name} onChangeText={setName} />


<Text>Usuário</Text>
<TextInput style={{ borderWidth: 1 }} value={user} onChangeText={setUser} />


<Text>Senha *</Text>
<TextInput style={{ borderWidth: 1 }} secureTextEntry value={password} onChangeText={setPassword} />


<Text>Site</Text>
<TextInput style={{ borderWidth: 1 }} value={site} onChangeText={setSite} />


<Button title="Salvar" onPress={save} />
</View>
);
}