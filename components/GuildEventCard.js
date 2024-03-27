import React from 'react';
import { useEffect } from "react";
import useForm from '../hooks/useForm';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

const GuildEventCard = ({ event, navigation }) => {

  const getFreshModel = () => ({
    userID: undefined,
    loginName: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  useEffect(() => {
    setValues({
      ...values,
      userID: event.initiatorID
    })
  }, [event]);

  useEffect(() => {
    if (values.userID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserDataByID`, {
          params: {
            userID: values.userID,
          },
        })
        .then((res) => {
          if (res.data === 'failed') {
          } else {
            setValues({
              ...values,
              userID: res.data[0].userID,
              loginName: res.data[0].loginName,
            })
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.userID]);



  return (
    <View style={styles.cardContainer}>

      <Text style={styles.eventName}>{event.eventName}</Text>
      <Text style={styles.eventInfo}>Initiator: {values.loginName}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.eventInfo}>Date: {event.eventDate}  |  </Text>
        <Text style={styles.eventInfo}>Time: {event.startTime} - {event.endTime}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.eventInfo}>Member: {event.currentNumber} / {event.memberNumber}  </Text>
      </View>

      <Text style={styles.eventInfo}>Venue: {event.venue}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EventDetail', { event: event })}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <AntDesign name="search1" size={24} color="white" />
          <Text style={styles.buttonText}>View Details</Text>
        </View>
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1, //flexible in height
    backgroundColor: '#F9F6F2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderColor: 'grey',
    borderWidth: 1.5,
  },
  eventName: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventInfo: {
    fontSize: 16,
    marginBottom: 4,
    color: 'grey',
  },
  button: {
    backgroundColor: '#91AC9A',
    padding: 8,
    borderRadius: 30,
    margin: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default GuildEventCard;