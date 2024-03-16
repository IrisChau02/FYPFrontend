import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView, Linking } from 'react-native';
import axios from 'axios';

import { Dimensions } from 'react-native';
import BottomBar from "./BottomBar";

import { CurrentUserID } from './CurrentUserID';


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
    guildName: undefined,
    initiatorID: undefined,
    memberID: undefined,
    memberIDArray: undefined,
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
            guildName: res.data[0].guildName,
            initiatorID: res.data[0].initiatorID,
            memberID: res.data[0].memberID, //string
            memberIDArray: res.data[0].memberID.split(',') //array
          })
        })
        .catch((err) => console.log(err));
    }
  }, [values.eventName]);

  const handleJoinEvent = () => {
    let newMemberID;
    if (values.memberID === null) {
      newMemberID = CurrentUserID; // Set `newMemberID` to `CurrentUserID`
    } else {
      newMemberID = values.memberID + `,${CurrentUserID}`; // Append `CurrentUserID` to `memberID`
    }

    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/joinEvent`, {
        memberID: newMemberID,
        guildName: values.guildName,
        eventName: values.eventName,
        currentNumber: parseInt(values.currentNumber) + 1
      })
      .then((res) => {
        if (res.data === 'updated') {
          alert('Join successfully');
          navigation.navigate('Event');
        } else {
          alert('Failed to Join');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Event Detail Page</Text>
      <View style={styles.margincontainer}>

        <ScrollView>
          <View style={{ marginBottom: 80 }}>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event Name</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Event Name"
              value={values.eventName}
              editable={false}
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
              editable={false}
            />


            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event Date</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Event Time"
              value={values.formateventDate}
              editable={false}
            />


            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event From Time</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Event From Time"
              value={values.startTime}
              editable={false}
            />


            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Event To Time</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Event To Time"
              value={values.endTime}
              editable={false}
            />


            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Member Number Limit</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Member Number Limit"
              value={values.memberNumber}
              editable={false}
            />


            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Current Number</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Current Number"
              value={values.currentNumber}
              editable={false}
            />


            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Venue</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Venue"
              value={values.venue}
              editable={false}
            />

            {/* initiator cannot join the event */}
            {CurrentUserID !== values.initiatorID && (
              parseInt(values.currentNumber) < parseInt(values.memberNumber) ? (
                values.memberIDArray.includes(CurrentUserID) ? (
                  <TouchableOpacity style={{ backgroundColor: 'grey', padding: 10, borderRadius: 5, width: '100%', marginTop: 10, marginBottom: 10 }}>
                    <Text style={styles.buttonText}>Joined</Text>
                  </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleJoinEvent} style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, width: '100%', marginTop: 10, marginBottom: 10 }}>
                      <Text style={styles.buttonText}>Join</Text>
                    </TouchableOpacity>
                )
              ) : (
                <TouchableOpacity style={{ backgroundColor: 'grey', padding: 10, borderRadius: 5, width: '100%', marginTop: 10, marginBottom: 10 }}>
                  <Text style={styles.buttonText}>Full</Text>
                </TouchableOpacity>
              )
            )}

          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomBarContainer}>
        <BottomBar navigation={navigation} />
      </View>

    </View >
  );
}

const styles = StyleSheet.create({
  margincontainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F1F1F1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginBottom: 50
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#91AC9A',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1.2,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    color: 'gray',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});