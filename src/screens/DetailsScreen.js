import { Linking, Text, View } from "react-native";
import { decrypt } from "../services/crypto";

export default function DetailsScreen({ route }) {
    const { name, user, password, site } = route.params;

    return (
    <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 22 }}>{name}</Text>
        <Text>Usuário: {user || "-"}</Text>
        <Text>Senha: {decrypt(password)}</Text>
        {site && <Text style={{ color: "blue" }} onPress={() => Linking.openURL(site)}>{site}</Text>}
    </View>
    );
}