import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';


export default function LoginScreen({ navigation }) {
const [pass, setPass] = useState("");


function validate() {
if (pass === "1234") navigation.replace("Home");
}


return (
<View style={{ padding: 20 }}>
<Text style={{ fontSize: 22 }}>Digite sua senha:</Text>
<TextInput secureTextEntry value={pass} onChangeText={setPass} style={{ borderWidth: 1, marginVertical: 10 }} />
<Button title="Entrar" onPress={validate} />
</View>
);
}