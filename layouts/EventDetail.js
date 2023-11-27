import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView, Linking } from 'react-native';
import axios from 'axios';

import { Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const formatDate = (date) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

export default function EventDetail({ navigation, route }) {

  const getFreshModel = () => ({
    guildName: undefined,
    eventName: undefined,
    eventDetail: undefined,
    eventDate: new Date(),
    formateventDate: undefined,
    startTime: undefined,
    endTime: undefined,
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
      console.log(event)

      setValues({
        ...values,
        eventName: event.eventName,
        eventDetail: event.eventDetail,
        eventDate: event.eventDate,
        startTime: event.startTime.toString(),
        endTime: event.endTime.toString(),
        venue: event.venue,
      })
    }
  }, [route]);

  const PlaceholderImage = require('../assets/loginbackground2.png');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

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
              onChangeText={(text) => handleInputChange('eventName', text)}
            />
      

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event Detail</Text>
            </TouchableOpacity>
       
            <TextInput
              style={styles.input}
              placeholder="Event Detail"
              value={values.eventDetail}
              onChangeText={(text) => handleInputChange('eventDetail', text)}
              multiline={true}
              keyboardType="ascii-capable"
            />
    

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event Date</Text>
            </TouchableOpacity>
    
            <TextInput
              style={styles.input}
              placeholder="Event Time"
              value={values.eventDate}
            />
    

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event From Time</Text>
            </TouchableOpacity>
      
            <TextInput
              style={styles.input}
              placeholder="Event From Time"
              value={values.startTime}
              onChangeText={(text) => handleInputChange('startTime', text)}
            />
    

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event To Time</Text>
            </TouchableOpacity>
        
            <TextInput
              style={styles.input}
              placeholder="Event To Time"
              value={values.endTime}
              onChangeText={(text) => handleInputChange('endTime', text)}
            />
        

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Venue</Text>
            </TouchableOpacity>
         
            <TextInput
              style={styles.input}
              placeholder="Venue"
              value={values.venue}
              onChangeText={(text) => handleInputChange('venue', text)}
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