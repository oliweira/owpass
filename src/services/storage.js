import AsyncStorage from '@react-native-async-storage/async-storage';


export async function savePassword(data) {
const stored = await AsyncStorage.getItem('passwords');
const list = stored ? JSON.parse(stored) : [];
list.push(data);
await AsyncStorage.setItem('passwords', JSON.stringify(list));
}


export async function getPasswords() {
const stored = await AsyncStorage.getItem('passwords');
return stored ? JSON.parse(stored) : [];
}