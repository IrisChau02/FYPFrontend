import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

import { AntDesign } from '@expo/vector-icons';

import BottomBar from "./BottomBar";

export default function ProfileTimeSlotUpdate({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    timeslotID: undefined,
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
        timeslotID: props.props.timeslotID,
      })
    }
  }, [route]);


  const [timeslotList, setTimeslotList] = useState([]);

  const fetchData = async () => {
    try {
      const timeslotResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getTimeslot`);
      const [timeslotData] = await Promise.all([
        timeslotResponse,
      ]);

      setTimeslotList(timeslotData.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmButton = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/updateTimeslotID`, values)
      .then((res) => {
        if (res.data === 'updated') {
          alert('Success');
          navigation.navigate('Home')
        }
      })
      .catch((err) => console.log(err));

  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>

       <Text style={styles.heading}>Update Timeslot</Text>

      <ScrollView style={styles.margincontainer}>

        {
          timeslotList.map((item) => (
            <TouchableOpacity
              key={item.timeslotID}
              onPress={() =>
                setValues({
                  ...values,
                  timeslotID: item.timeslotID,
                })
              }
            >
              <View
                style={
                  values.timeslotID === item.timeslotID
                    ? styles.cardContainerSelected
                    : styles.cardContainer
                }
              >
                <Text style={styles.textInfo}>{item.timeslotName}</Text>
              </View>
            </TouchableOpacity>
          ))
        }

        <TouchableOpacity style={styles.submitButton} onPress={handleConfirmButton}>
          <Text style={styles.submitButtonText}>Confirm</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.bottomBarContainer}>
        <BottomBar navigation={navigation} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  margincontainer: { 
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F1F1F1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  cardContainer: {
    backgroundColor: '#F9F6F2',
    borderRadius: 30,
    padding: 10,
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 2,
  },
  cardContainerSelected: {
    backgroundColor: '#B5CDC2',
    borderRadius: 30,
    padding: 10,
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 2,
  },
  textInfo: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
    color: 'grey',
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 80,
    width: 100
  },
  submitButtonText: {
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