import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-paper';
import {Button} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = props => {
  const [nik, setNik] = useState('');
  const [pwd, setPwd] = useState('');
  const storeData = async data => {
    console.log(data, 'dataaaa');
    try {
      const jsonValue = JSON.stringify(data);
      console.log(jsonValue, 'dataaaa');
      await AsyncStorage.setItem('data', jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };
  function login(params) {
    axios
      .post('http://10.0.2.2:3000/login', {
        NIK: nik,
        pwd: pwd,
      })
      .then(function (response) {
        console.log(response.data);

        storeData(response.data.data);
        props.navigation.replace('MainApp');
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={e => setNik(e)}
        style={{
          width: '50%',
        }}
        mode="outlined"
        label="NIK"
        placeholder="NIK"
        right={<TextInput.Affix text="/100" />}
      />
      <TextInput
        onChangeText={e => setPwd(e)}
        style={{
          width: '50%',
          marginBottom: 10,
        }}
        label="Password"
        mode="outlined"
        secureTextEntry
        right={<TextInput.Icon icon="eye" />}
      />
      <Button
        style={{
          width: '50%',
          marginBottom: 10,
          borderRadius: 8,
        }}
        // icon="camera"
        mode="contained"
        onPress={() => login()}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
