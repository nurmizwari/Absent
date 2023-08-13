import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import {Button} from 'react-native-paper';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {getDataLokal} from '../utils';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';
// import checkPermissionlocation from '../utils/permission';

const Absent = () => {
  const [activeCamera, setActiveCamera] = useState(false);
  const [idKaryawan, setIdKaryawan] = useState('');
  const [nama, setNama] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [checkin, setCheckin] = useState(true);
  const cameraRef = useRef(Camera);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position, 'positiion');
        const {latitude, longitude} = position.coords;
        console.log('====================================');
        console.log(latitude, longitude);
        console.log('====================================');
        if (latitude && longitude) {
          setLatitude(latitude);
          setLongitude(longitude);
        }
      },
      error => {
        console.log('Error:', error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  useEffect(() => {
    async function getLokal() {
      let data = await getDataLokal();
      setIdKaryawan(data.id);
      setNama(data.nama);
      console.log(data, 'data');
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
      checkPermissionlocation();
      getCurrentLocation();
    }

    getLokal();
    permissionCamera();
    getPermissionCamera();
  }, [checkPermissionlocation, getCurrentLocation]);

  const checkPermissionlocation = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    console.log(granted, 'granted');
    if (!granted) {
      // Jika izin tidak diberikan, minta izin lokasi
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location.',
            buttonPositive: 'OK',
          },
        );
        console.log(result, 'result');
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      console.log('Location permission already granted');
    }
  };
  async function permissionCamera(params) {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();
  }
  async function getPermissionCamera(params) {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
  }

  const devices = useCameraDevices();
  const device = devices.back;

  if (device == null) return <ActivityIndicator />;

  const takePhoto = async () => {
    if (cameraRef.current == null) {
      throw new Error('Camera is Null');
    }

    const photo = await cameraRef.current.takePhoto({
      qualityPriorition: 'quality',
      // flash: `${torch}`,
    });
    console.log(photo);
    if (!photo || !photo.path) {
      throw new Error('Photo is null or does not have a path');
    }

    let obj = {
      id: idKaryawan,
      nama: nama,
      lat: latitude,
      lng: longitude,
      checkin: '',
      image: '',
    };

    console.log(obj);
    const fileName = photo.path.split('/').pop();
    var formData = new FormData();
    formData.append('id', idKaryawan);
    formData.append('nama', nama);
    formData.append('lat', latitude);
    formData.append('lng', longitude);
    if (checkin) {
      formData.append('checkin', 'checkin');
    } else {
      formData.append('checkout', 'checkout');
    }
    formData.append('image', {
      uri: Platform.OS == 'android' ? 'file:///' + photo.path : photo.path,
      type: 'image/jpg', // Ganti sesuai dengan tipe file gambar yang diinginkan
      name: fileName,
    });

    if (checkin) {
      axios
        .post('http://10.0.2.2:3000/checkin', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(function (response) {
          console.log(response.data);
          if (response.data.status == 200) {
            setActiveCamera(false);
            showToast('success', 'Absent', 'Checkin Berhasil 😁');
          } else {
            showToast('info', 'Absent', 'Anda Sudah Checkin 😁');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios
        .post('http://10.0.2.2:3000/checkin', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(function (response) {
          console.log(response.data, 'checkout');
          if (response.data.status == 200) {
            setActiveCamera(false);
            setCheckin(true);
            showToast('success', 'Absent', 'Checkout Berhasil 😁');
          } else {
            showToast('info', 'Gagal', 'Ada Error dari server');
            setCheckin(true);
          }
        })
        .catch(function (error) {
          console.log(error);
          setCheckin(true);
        });
    }
  };
  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
    });
  };
  return (
    <View style={styles.container}>
      {activeCamera ? (
        <>
          <View
            style={{
              // flex: 1,
              width: windowWidth * 1,
              height: windowHeight * 0.8,
            }}>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={activeCamera}
              ref={cameraRef}
              photo={true}
            />
          </View>
          <View
            style={[
              styles.row,
              {
                justifyContent: 'center',
                alignItems: 'center',
                // borderWidth: 1,
                marginTop: 10,
              },
            ]}>
            <Button
              style={{
                width: '40%',
              }}
              // icon="camera"
              mode="contained"
              onPress={() => {
                setActiveCamera(false), setCheckin(true);
              }}>
              Kembali
            </Button>
            <Button
              style={{
                width: '40%',
              }}
              icon="camera"
              mode="contained"
              onPress={() => takePhoto()}>
              poto
            </Button>
          </View>
        </>
      ) : (
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => setActiveCamera(true)}
            style={styles.checkin}>
            <Text>Checkin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveCamera(true), setCheckin(false);
            }}
            style={[
              styles.checkin,
              {
                marginLeft: 10,
              },
            ]}>
            <Text>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast />
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  checkin: {
    backgroundColor: 'white',
    width: 100,
    height: 100,
    elevation: 4,
    borderRadius: 10,
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
  },
});

export default Absent;
