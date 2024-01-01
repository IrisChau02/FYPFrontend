import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
//import { TextField, Button, Card, CardContent } from '@mui/material';

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
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <View style={styles.margincontainer}>
        <Text style={styles.heading}>Update Logo Page</Text>

        <View style={styles.cardContainer}>
          <Card style={styles.card}>
       
       
                <Image source={values.userLogo ? { uri: `data:image/jpeg;base64,${values.userLogo}` } : defaultLogoImage} style={styles.logo} />
                <AntDesign name="camera" size={50} color="grey" onPress={pickImageAsync}/>
            
                <TouchableOpacity style={styles.button} onPress={handleUpdateUserLogo}>
            <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>

       
          </Card>
        </View>

      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  margincontainer: { // Corrected style name
    margin: 16
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'brown',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  cardContainer: {
    height: 500, // Set the desired fixed height for the card
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    // Set any other styles for the card if needed
  },
  input: {
    height: 40,
    //borderColor: 'gray',
    //borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray', // Set the background color
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flex: 1, // Use flex: 1 to make the column take up remaining horizontal space
    //marginLeft: 10,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 8,
  },
  button: {
    backgroundColor: 'grey',
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
});