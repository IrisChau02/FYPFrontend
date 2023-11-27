import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';

import BottomBar from "./BottomBar";
import GuildEventCard from "../components/GuildEventCard";

export default function Event({ navigation, route }) {

  const getFreshModel = () => ({
    guildName: undefined
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
      const { guildName } = route.params;

      setValues({
        ...values,
        guildName: guildName,
      })
    }
  }, [route]);

  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    if (values.guildName !== undefined) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getGuildEvent`, {
          params: {
            guildName: values.guildName
          },
        })
        .then((res) => {
          if (res.data === 'failed') {
            alert('No existing record');
          } else {
            //alert('Success');
            setEventList(res.data)
          }
        })
        .catch((err) => console.log(err));


    }
  }, [values.guildName]);



  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />

      <FlatList
        data={[{ key: 'eventPage' }]}
        renderItem={() => (
          <SafeAreaView style={styles.margincontainer}>
            <Text style={styles.heading}>Event Page</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EventCreate', { guildName: values.guildName })}>
              <Text style={styles.buttonText}>Create Event</Text>
            </TouchableOpacity>

            <FlatList
              data={eventList}
              renderItem={({ item }) => <GuildEventCard event={item} navigation={navigation} />}
              keyExtractor={(item, index) => index.toString()}
              style={styles.cardList}
            />

          </SafeAreaView>
        )}
        keyExtractor={(item) => item.key}
        style={{ flex: 1 }}
      />
      
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
    fontWeight: 'bold',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});