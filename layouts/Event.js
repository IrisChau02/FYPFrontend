import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';

import BottomBar from "./BottomBar";

export default function Event({ navigation}) {

  const getFreshModel = () => ({
   
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
      <Text style={styles.heading}>Event Page</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EventCreate')}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    margin: 20,
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