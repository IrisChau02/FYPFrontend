import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView, Linking } from 'react-native';
import axios from 'axios';

import { Dimensions } from 'react-native';


export default function EventDetail({ navigation, route }) {

  const getFreshModel = () => ({
    guildName: undefined,
    eventName: undefined,
    eventDetail: undefined,

    formateventDate: undefined,
    startTime: undefined,
    endTime: undefined,
    memberNumber: undefined,
    currentNumber: undefined,
    venue: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  useEffect(() => {
    if (route && route.params) {
      const { event } = route.params;

      setValues({
        ...values,
        eventName: event.eventName,
      })
    }
  }, [route]);

  useEffect(() => {
    if (values.eventName !== undefined) {

      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getGuildEventByName`, {
          params: {
            eventName: values.eventName
          },
        })
        .then((res) => {

          setValues({
            ...values,
            eventDetail: res.data[0].eventDetail,
            formateventDate: res.data[0].eventDate,
            startTime: res.data[0].startTime.toString(),
            endTime: res.data[0].endTime.toString(),
            memberNumber: res.data[0].memberNumber.toString(),
            currentNumber: res.data[0].currentNumber.toString(),
            venue: res.data[0].venue,
          })


        })
        .catch((err) => console.log(err));


    }
  }, [values.eventName]);

  const PlaceholderImage = require('../assets/loginbackground2.png');

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <View style={styles.margincontainer}>
        <ScrollView>
          <Text style={styles.heading}>Event Detail Page</Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Event Name</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Event Name"
            value={values.eventName}
          />


          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Event Detail</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Event Detail"
            value={values.eventDetail}
            multiline={true}
            keyboardType="ascii-capable"
          />


          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Event Date</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Event Time"
            value={values.formateventDate}
          />


          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Event From Time</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Event From Time"
            value={values.startTime}
          />


          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Event To Time</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Event To Time"
            value={values.endTime}
          />



          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Member Number Limit</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Member Number Limit"
            value={values.memberNumber}
          />


          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Current Number</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Current Number"
            value={values.currentNumber}
          />


          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Venue</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Venue"
            value={values.venue}
          />

        </ScrollView>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  margincontainer: {
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
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,

  },
  col: {
    flexDirection: 'row',
    alignItems: 'center',
    //margin: 10,
    width: Dimensions.get('window').width / 2,
    justifyContent: 'center'
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray', // Set the background color
  },
});