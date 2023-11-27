import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

import BottomBar from "./BottomBar";

export default function Mission({ navigation}) {

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

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <View style={styles.margincontainer}>
      <Text style={styles.heading}>Mission Page</Text>

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
});