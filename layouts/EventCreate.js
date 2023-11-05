import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView, Linking } from 'react-native';
import axios from 'axios';

import BottomBar from "./BottomBar";
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

export default function EventCreate({ navigation }) {

  const getFreshModel = () => ({
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

  const PlaceholderImage = require('../assets/loginbackground2.png');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleCreateEvent = () => {
    console.log(values)

    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/createGuildEvent`, values)
      .then((res) => {
        if (res.data === 'added') {
          alert('success');

          const msg = `Event: [${values.eventName}] is created on [${values.formateventDate}]!\nIt will start from [${values.startTime}] to [${values.endTime}]\nThe venue is [${values.venue}]\nHere is the Detail: "${values.eventDetail}" \nWelcome to join!!`;

          const url = `https://wa.me/85298245007?text=${encodeURIComponent(msg)}`;
          Linking.openURL(url);
          // navigation.navigate('Login');
        } else {
          alert('fail');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <ScrollView>
        <Text style={styles.heading}>Create Event Page</Text>

        <View style={styles.row}>
          <View style={styles.col}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event Name</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.col}>
            <TextInput
              style={styles.input}
              placeholder="Event Name"
              value={values.eventName}
              onChangeText={(text) => handleInputChange('eventName', text)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event Detail</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.col}>
            <TextInput
              style={styles.input}
              placeholder="Event Detail"
              value={values.eventDetail}
              onChangeText={(text) => handleInputChange('eventDetail', text)}
              multiline={true}
              keyboardType="ascii-capable"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event Date</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.col}>
            <TouchableOpacity style={styles.button} onPress={showDatePickerModal}>
              <Text style={styles.buttonText}>Select Event Date</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={values.eventDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  handleInputChange('eventDate', selectedDate);
                  handleInputChange('formateventDate', formatDate(selectedDate));
                }}
              />
            )}

          </View>
        </View>


        <View style={styles.row}>
          <View style={styles.col}>

          </View>

          <View style={styles.col}>
            <TextInput
              style={styles.input}
              placeholder="Event Time"
              value={values.formateventDate}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event From Time</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.col}>
            <TextInput
              style={styles.input}
              placeholder="Event From Time"
              value={values.startTime}
              onChangeText={(text) => handleInputChange('startTime', text)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event To Time</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.col}>
            <TextInput
              style={styles.input}
              placeholder="Event To Time"
              value={values.endTime}
              onChangeText={(text) => handleInputChange('endTime', text)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Venue</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.col}>
            <TextInput
              style={styles.input}
              placeholder="Venue"
              value={values.venue}
              onChangeText={(text) => handleInputChange('venue', text)}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>

      </ScrollView>
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
    width: 150,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray', // Set the background color
  },
});