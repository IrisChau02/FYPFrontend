import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, Linking } from 'react-native';
import axios from 'axios';
import BottomBar from "./BottomBar";
import GuildCard from "../components/GuildCard";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { CurrentUserID } from './CurrentUserID';

export default function GuildDetail({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    guildLogo: undefined,
    guildName: undefined,
    guildIntro: undefined,
    districtID: undefined,
    level: undefined,
    memberNo: undefined,
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
      userID: CurrentUserID
    })
  }, [CurrentUserID]);

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
              guildName: res.data[0].guildName,
            })
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.userID]);


  useEffect(() => {
    if (values.guildName) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getGuildDetailByName`, {
          params: {
            guildName: values.guildName,
          },
        })
        .then((res) => {
          if (res.data === 'failed') {
          } else {
            //console.log(res.data)

            setValues({
              ...values,
              guildLogo: res.data[0].guildLogo,
              guildIntro: res.data[0].guildIntro,
              districtID: res.data[0].districtID,
              level: res.data[0].level,
              memberNo: res.data[0].memberNo,
            })
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.guildName]);

  /*
  useEffect(() => {
    if (route && route.params) {
      const { guild } = route.params;

      setValues({
        ...values,
        guildName: guild.guildName,
        guildIntro: guild.guildIntro,
        guildLogo: guild.guildLogo,
        level: guild.level,
        memberNo: guild.memberNo,
      })
    }
  }, [route]);*/

  const PlaceholderImage = require('../assets/loginbackground2.png');

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <View style={styles.margincontainer}>

        <Text style={styles.heading}>Guild Detail Page</Text>

        <View style={styles.cardContainer}>
          <View style={styles.row}>
            <Image source={{ uri: `data:image/jpeg;base64,${values.guildLogo}` }} style={styles.logo} />
            <View style={styles.column}>
              <Text style={styles.guildName}>Name: {values.guildName}</Text>
              <Text style={styles.guildInfo}>Detail: {values.guildIntro}</Text>
              <Text style={styles.guildDetails}>
                Level: {values.level} | Members: {values.memberNo}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://chat.whatsapp.com/BbKplYG4XqHGGvsjzJx895')}>

            <Text style={styles.buttonText}>Join WhatsApp Group <FontAwesome name="whatsapp" size={24} color="white" /> </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://wa.me/85265022979?text=Hello, nice to meet you!')}>
            <Text style={styles.buttonText}>Chat With Master <FontAwesome name="whatsapp" size={24} color="white" /> </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.greybutton} onPress={() => navigation.navigate('Event', { guildName: values.guildName })}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="event-note" size={24} color="white" />
            <Text style={styles.iconText}>Event </Text>
          </View>
        </TouchableOpacity>



      </View>
      <BottomBar navigation={navigation} />
    </View>
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
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  greybutton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  column: {
    flex: 1,
    marginLeft: 16,
  },
  guildName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  guildInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  guildDetails: {
    fontSize: 14,
    color: 'gray',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#F5F5DC',
    fontWeight: 'bold',
    marginLeft: 5, // Add some spacing between the icon and text
  },
});