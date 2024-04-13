import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView, Linking } from 'react-native';
import axios from 'axios';
import { Entypo } from '@expo/vector-icons';

import { Dimensions } from 'react-native';
import BottomBar from "./BottomBar";

import { CurrentUserID } from './CurrentUserID';
import MapView, { Marker } from 'react-native-maps';

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
    latitude: undefined,
    longitude: undefined,
    guildName: undefined,
    initiatorID: undefined,
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

  const [region, setRegion] = useState({
    latitude: 22.3193,
    longitude: 114.1694,
    latitudeDelta: 0.0461 * 0.1,
    longitudeDelta: 0.0210 * 0.1,
  });

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
            startTime: res.data[0].startTime,
            endTime: res.data[0].endTime,
            memberNumber: res.data[0].memberNumber.toString(),
            currentNumber: res.data[0].currentNumber.toString(),
            venue: res.data[0].venue,
            latitude: res.data[0].latitude,
            longitude: res.data[0].longitude,
            guildName: res.data[0].guildName,
            initiatorID: res.data[0].initiatorID,
          })

          setRegion(prevRegion => ({
            ...prevRegion,
            latitude: res.data[0].latitude,
            longitude: res.data[0].longitude,
          }));
        })
        .catch((err) => console.log(err));
    }
  }, [values.eventName]);

  const [memberList, setMemberList] = useState([]);
  const [memberNameList, setMemberNameList] = useState([]);

  useEffect(() => {
    if (values.eventName && values.guildName) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getGuildEventMember`, {
          params: {
            eventName: values.eventName,
            guildName: values.guildName
          },
        })
        .then((res) => {
          if (res.data) {
            const userIDs = res.data.map(item => item.userID);
            const userNames = res.data.map(item => item.loginName);
            setMemberList(userIDs)
            setMemberNameList(userNames)
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.eventName, values.guildName]);

  const handleJoinEvent = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/joinEvent`, {
        userID: CurrentUserID,
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

  const handleLeaveEvent = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/leaveEvent`, {
        userID: CurrentUserID,
        guildName: values.guildName,
        eventName: values.eventName,
      })
      .then((res) => {
        if (res.data === 'updated') {
          alert('Leave successfully');
          navigation.navigate('Event');
        } else {
          alert('Failed to Leave');
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
              <Text style={styles.buttonText}>Member List</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Member List"
              value={memberNameList.join(',')}
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

            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MapView
                region={region}
                style={{ width: 300, height: 300 }}
              >
                <Marker coordinate={region} />
              </MapView>
            </View>


            {/* initiator cannot join the event */}
            {CurrentUserID !== values.initiatorID &&
              (memberList.includes(CurrentUserID) ? (
                <>
                  <TouchableOpacity style={{ backgroundColor: 'grey', padding: 10, borderRadius: 5, width: '100%', marginTop: 10, marginBottom: 10 }}>
                    <Text style={styles.buttonText}>Joined</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleLeaveEvent} style={{ backgroundColor: 'grey', padding: 10, borderRadius: 5, width: 45, marginTop: 10, marginBottom: 10 }}>
                    <Entypo name="log-out" size={24} color="white" />
                  </TouchableOpacity>
                </>
              ) : (
                parseInt(values.currentNumber) < parseInt(values.memberNumber) ? (

                  <TouchableOpacity onPress={handleJoinEvent} style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, width: '100%', marginTop: 10, marginBottom: 10 }}>
                    <Text style={styles.buttonText}>Join</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={{ backgroundColor: 'grey', padding: 10, borderRadius: 5, width: '100%', marginTop: 10, marginBottom: 10 }}>
                    <Text style={styles.buttonText}>Full</Text>
                  </TouchableOpacity>
                )
              ))}

            {CurrentUserID === values.initiatorID && (
              <TouchableOpacity onPress={() => navigation.navigate('EventFinish', values)} style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, width: '100%', marginTop: 10, marginBottom: 10 }}>
                <Text style={styles.buttonText}>Finish</Text>
              </TouchableOpacity>
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