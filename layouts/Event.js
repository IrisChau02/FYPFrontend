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
          setEventList(res.data)
        })
        .catch((err) => console.log(err));


    }
  }, [values.guildName]);



  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Event</Text>

      <FlatList
        data={[{ key: 'eventPage' }]}
        renderItem={() => (
          <SafeAreaView>


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
        style={styles.margincontainer}
      />

      <View style={styles.bottomBarContainer}>
        <BottomBar navigation={navigation} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  margincontainer: { // Corrected style name
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
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    margin: 10,
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
});