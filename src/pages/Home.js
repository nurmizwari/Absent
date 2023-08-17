import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import bg from '../assets/bg.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Carousell from '../components/carousel';

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
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <ImageBackground source={bg} resizeMode="cover" style={styles.image}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <View>
              <Text>PT MIZWARI GROUP</Text>
            </View>
            <View style={styles.row}>
              <Ionicons
                name={'notifications-outline'}
                size={30}
                color={'grey'}
              />
              <Ionicons name={'person-circle'} size={30} color={'grey'} />
            </View>
          </View>
        </ImageBackground>
      </View>
      <Carousell />
      <View style={styles.subContainer2}>
        <Text>PT</Text>
        <TouchableOpacity style={styles.height}>
          <Text>AA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.height}>
          <Text>AA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.height}>
          <Text>AA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.height}>
          <Text>AA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal:10
  },
  subContainer: {
    // paddingHorizontal: 10,
    flex: 1,
  },
  subContainer2: {
    paddingHorizontal: 10,
    flex: 3,
  },
  height: {
    height: windowHeight * 0.1,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    marginBottom: 10,
  },
  image: {
    // flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: windowHeight * 0.2,
  },
  row: {
    flexDirection: 'row',
  },
});

export default Home;
