import React from 'react';
import { useEffect } from "react";
import useForm from '../hooks/useForm';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
      <Text style={styles.eventInfo}>Date: {event.eventDate}</Text>
      <Text style={styles.eventInfo}>Time: {event.startTime} - {event.endTime}</Text>
      <Text style={styles.eventInfo}>Venue: {event.venue}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EventDetail', { event: event })}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
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
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventInfo: {
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default GuildEventCard;