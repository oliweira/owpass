import { Text, TouchableOpacity } from 'react-native';

export default function PasswordItem({ item, onPress }) {
return (
<TouchableOpacity onPress={onPress} style={{ padding: 10, borderBottomWidth: 1 }}>
<Text style={{ fontSize: 18 }}>{item.name}</Text>
</TouchableOpacity>
);
}