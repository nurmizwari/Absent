import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDataLokal = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('data');
    console.log(jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log(e);
  }
};
