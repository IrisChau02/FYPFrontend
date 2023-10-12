import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ImageBackground } from 'react-native';

export default function Register({ navigation }) {
  const getFreshModel = () => ({
    firstName: undefined,
    lastName: undefined,
    //birthday: undefined,
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

  const PlaceholderImage = require('../assets/loginbackground.png');

  useEffect(() => {
    console.log(values)
  }, [values])

  const handleRegisterSubmit = () => {
    // Handle form submission
  };

  return (
    <ImageBackground source={PlaceholderImage} style={styles.image} resizeMode="cover">
    <View style={styles.container}>
      <Text style={styles.heading}>Register Page</Text>
      <View style={styles.divider} />
      <Text style={styles.label}>Personal Information</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="First Name"
          value={values.firstName}
          onChangeText={(text) => handleInputChange('firstName', text)}
        />

        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Last Name"
          value={values.lastName}
          onChangeText={(text) => handleInputChange('lastName', text)}
        />
      </View>

      {/* Radio buttons for gender */}
      {/* Replace this with appropriate Radio button component in React Native */}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={values.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={values.phoneNumber}
        onChangeText={(text) => handleInputChange('phoneNumber', text)}
      />

      <View style={styles.divider} />
      <Text style={styles.label}>Login Information</Text>

      <TextInput
        style={styles.input}
        placeholder="Login Name"
        value={values.loginName}
        onChangeText={(text) => handleInputChange('loginName', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={values.password}
        onChangeText={(text) => handleInputChange('password', text)}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={values.confirmPassword}
        onChangeText={(text) => handleInputChange('confirmPassword', text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegisterSubmit}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'brown',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginVertical: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray', // Set the background color
  },
  registerButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  }
});