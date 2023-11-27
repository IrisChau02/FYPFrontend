import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
//import { TextField, Button, Card, CardContent } from '@mui/material';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';

import { Share } from 'react-native';

import BottomBar from "./BottomBar";

export default function Home({ navigation, route }) {

  const getFreshModel = () => ({
    firstName: undefined,
    lastName: undefined,
    formatbirthday: undefined,
    gender: undefined,
    phoneNumber: undefined,
    email: undefined,
    password: undefined,
    loginName: undefined,
    confirmPassword: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const PlaceholderImage = require('../assets/loginbackground2.png');

  useEffect(() => {
    if (route && route.params) {
      const { loginName, password } = route.params;

      setValues({
        ...values,
        loginName: loginName,
        password: password
      })
    }
  }, [route]);

  useEffect(() => {
    if (values.loginName !== undefined && values.password !== undefined) {
      console.log(values.loginName, values.password)
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserData`, {
          params: {
            loginName: values.loginName,
            password: values.password,
          },
        })
        .then((res) => {
          if (res.data === 'failed') {
            alert('No existing record');
          } else {

            setValues({
              ...values,
              firstName: res.data[0].firstName,
              lastName: res.data[0].lastName,
              formatbirthday: res.data[0].birthday,
              gender: res.data[0].gender,
              phoneNumber: res.data[0].phoneNumber,
              email: res.data[0].email
            })

          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.loginName, values.password]);

  const shareViaWhatsApp = async () => {
    try {
      const result = await Share.share({
        message: ("Congulation to join!!")
      }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('shared')
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed')
      }
    }
    catch (error) {
      console.log(error.message)
    }

    /*
    https://docs.expo.dev/versions/latest/sdk/sharing/
    https://www.volcengine.com/theme/6356016-Z-7-1

    group
    https://stackoverflow.com/questions/43518482/react-native-send-a-message-to-specific-whatsapp-number
    https://stackoverflow.com/questions/68435788/whatsapp-share-using-expo-sharing-library-in-androidreact-native
    */
  };

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <View style={styles.margincontainer}>
      <Text style={styles.heading}>Home Page</Text>

      <View style={styles.cardContainer}>
        <Card style={styles.card}>
          <TextInput
            style={styles.input}
            value={values.loginName}
          />
          <TextInput
            style={styles.input}
            value={values.gender}
          />
          <TextInput
            style={styles.input}
            value={values.formatbirthday}
          />
        </Card>
      </View>

      </View>
      <BottomBar navigation={navigation} />
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
    height: 200, // Set the desired fixed height for the card
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray', // Set the background color
  },
});