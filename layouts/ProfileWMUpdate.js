import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
//import { TextField, Button, Card, CardContent } from '@mui/material';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import { AntDesign } from '@expo/vector-icons';

import BottomBar from "./BottomBar";

export default function ProfileWMUpdate({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    workModeID: undefined,

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
      const props = route.params;

      setValues({
        ...values,
        userID: props.props.userID,
        workModeID: props.props.workModeID,
      })
    }
  }, [route]);


  const [workingModeList, setWorkingModeList] = useState([]);

  const fetchData = async () => {
    try {
      const workingModeResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getWorkingMode`);
      const [workingModeData] = await Promise.all([
        workingModeResponse,
      ]);

      setWorkingModeList(workingModeData.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmButton = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/updateWorkModeID`, values)
      .then((res) => {
        if (res.data === 'updated') {
          alert('Success');
          navigation.navigate('Home')
        }
      })
      .catch((err) => console.log(err));

  };

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <ScrollView style={styles.margincontainer}>
        <Text style={styles.heading}>Working Mode Update Page</Text>

        {
          workingModeList.map((item) => (
            <TouchableOpacity
              key={item.workModeID}
              onPress={() =>
                setValues({
                  ...values,
                  workModeID: item.workModeID,
                })
              }
            >
              <View
                style={
                  values.workModeID === item.workModeID
                    ? styles.cardContainerSelected
                    : styles.cardContainer
                }
              >
                <Text style={styles.textInfo}>{item.workModeName}</Text>
              </View>
            </TouchableOpacity>
          ))
        }

        <TouchableOpacity style={styles.submitButton} onPress={handleConfirmButton}>
          <Text style={styles.submitButtonText}>Confirm</Text>
        </TouchableOpacity>

      </ScrollView>

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
    backgroundColor: '#F9F6F2', // Rice color
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    borderColor: 'gray', // Gray border color
    borderWidth: 4, // Border width
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContainerSelected: {
    backgroundColor: 'green', // Rice color
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    borderColor: 'gray', // Gray border color
    borderWidth: 4, // Border width
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
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
  subbutton: {
    backgroundColor: '#91AC9A',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    borderColor: '#9C9885', // Gray border color
    borderWidth: 4, // Border width
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 100
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});