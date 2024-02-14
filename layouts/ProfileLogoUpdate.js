import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import { AntDesign } from '@expo/vector-icons';

import BottomBar from "./BottomBar";

export default function ProfileLogoUpdate({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    userLogo: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const PlaceholderImage = require('../assets/loginbackground2.png');
  const defaultLogoImage = require('../assets/defaultUserLogo.png');

  useEffect(() => {
    if (route && route.params) {
      const props = route.params;

      setValues({
        ...values,
        userID: props.props.userID,
        userLogo: props.props.userLogo,
      })
    }
  }, [route]);


  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //ensure the type is image
      allowsEditing: true,
      quality: 0.3, // Adjust the quality parameter (0-1) to reduce image size
      base64: true, // Set base64 to true to get the image data in base64 format
    });

    if (!result.canceled) {
      delete result.cancelled;

      setValues({
        ...values,
        userLogo: result.assets[0].base64,
      })

    } else {
      alert('You did not select any image.');
    }
  };

  const handleUpdateUserLogo = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/updateUserLogo`, values)
      .then((res) => {
        if (res.data === 'updated') {
          alert('Change successfully')
          navigation.navigate('Home')
        } else {
          alert('Failed to Change');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F1F1F1' }}>
      <View style={styles.margincontainer}>

        <View style={styles.cardContainer}>
          <Card style={styles.card}>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.input}>Icon Preview</Text>
            </View>

            <Image source={values.userLogo ? { uri: `data:image/jpeg;base64,${values.userLogo}` } : defaultLogoImage} style={styles.logo} />

            <TouchableOpacity
              onPress={pickImageAsync}
              style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
            >
              <AntDesign name="camera" size={50} color="grey" />
              <Text style={styles.input}> Import Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleUpdateUserLogo}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>


          </Card>
        </View>
      </View>

      <View style={styles.bottomBarContainer}>
        <BottomBar navigation={navigation} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  margincontainer: {
    margin: 16
  },
  cardContainer: {
    height: 500,
    marginTop: 30,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    margin: 5,
    paddingHorizontal: 4,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 8,
    borderRadius: 180,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});