import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm'; 
import { TextField, Button, Card, CardContent } from '@mui/material';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

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

  const validate = () => {
    const temp = {};

    if (!values.username) {
      temp.username = "Username cannot be empty.";
    } else {
      temp.username = "";
    }

    if (!values.password) {
      temp.password = "Password cannot be empty.";
    } else {
      temp.password = "";
    }

    setErrors(temp);

    return Object.values(temp).every((x) => x === "");
  };
  
  const handleSubmit = () => {
    if (validate()) {
      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/login`, values)
        .then((res) => {
          if (res.data === 'failed') {
            alert('There is no existing record. Please input again.');
          } else {
            alert('Success');
            navigation.navigate('Home', {
              loginName: res.data[0].loginName,
              password: res.data[0].password,
            });
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Login Page</Text>
      </Pressable>
      <Text style={styles.text}>Please enter your login information</Text>

      <TextInput
      style={styles.input}
      placeholder="Username"
      value={values.username}
      onChangeText={(text) => handleInputChange('username', text)}
      onFocus={() => setErrors({ ...error, username: '' })}
    />
    {error.username && <Text style={styles.errorText}>{error.username}</Text>}

    <TextInput
      style={styles.input}
      placeholder="Password"
      value={values.password}
      onChangeText={(text) => handleInputChange('password', text)}
      secureTextEntry
      onFocus={() => setErrors({ ...error, password: '' })}
    />
    {error.password && <Text style={styles.errorText}>{error.password}</Text>}

      <Text style={styles.text}>If you do not have an account</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.button}>
        <Text style={styles.buttonText}>Go to Register Page</Text>
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
    color: 'gray',
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
  errorText: {
    color: '#FF0000',
    fontSize: 14,
  },
});

