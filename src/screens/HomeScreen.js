import { useEffect, useState } from "react";
import { Button, FlatList, TextInput, View } from "react-native";
import PasswordItem from "../components/PasswordItem";
import { getPasswords } from "../services/storage";


export default function HomeScreen({ navigation }) {
const [search, setSearch] = useState("");
const [passwords, setPasswords] = useState([]);
const [show, setShow] = useState(false);


useEffect(() => load(), []);


async function load() {
const data = await getPasswords();
setPasswords(data);
}


return (
<View style={{ padding: 20 }}>
<Button title="+ Adicionar Senha" onPress={() => navigation.navigate("AddPassword")} />


<TextInput
placeholder="Pesquisar..."
value={search}
onChangeText={setSearch}
style={{ borderWidth: 1, marginVertical: 10 }}
/>


<Button title={show ? "Ocultar" : "Mostrar todas as senhas"} onPress={() => setShow(!show)} />


{show && (
<FlatList
data={passwords.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))}
keyExtractor={(item, index) => index.toString()}
renderItem={({ item }) => (
<PasswordItem item={item} onPress={() => navigation.navigate("Details", item)} />
)}
/>
)}
</View>
);
}