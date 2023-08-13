import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  useEffect(() => {
    async function getDataLocal(params) {
      let data = await getData();
      console.log(data, 'dataLokal');
    }
    getDataLocal();
  }, []);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('data');
      console.log(jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Home;
