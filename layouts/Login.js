import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm'; 
import { TextField, Button, Card, CardContent } from '@mui/material';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function Login({ navigation }) {

  const getFreshModel = () => ({
    username: '',
    password: '',
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const PlaceholderImage = require('../assets/loginbackground2.png');

  const handleSubmit = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/login`, values)
      .then((res) => {
        if (res.data === 'failed') {
          alert('No exist record');
        } else {
          alert('success')
          navigation.navigate('Home', { loginName: res.data.loginName, password: res.data.password })
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    console.log(values)
  }, [values])

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <Pressable onPress={() => alert('You pressed a button.')} style={styles.button}>
        <Text style={styles.buttonText}>Login Page</Text>
      </Pressable>
      <Text style={styles.text}>Please enter your information</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={values.username}
        onChangeText={text => handleInputChange('username', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={values.password}
        onChangeText={text => handleInputChange('password', text)}
        secureTextEntry
      />

      <Text>{error.username}</Text>
      <Text>{error.password}</Text>

      <Text style={styles.buttonText}>if you do not have account</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.button}>
        <Text style={styles.buttonText}>Go to Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Sign In</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    backgroundColor: 'lightgray', // Set the background color
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

