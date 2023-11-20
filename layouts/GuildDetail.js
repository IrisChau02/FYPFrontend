import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, Linking } from 'react-native';
import axios from 'axios';
import BottomBar from "./BottomBar";
import GuildCard from "../components/GuildCard";

import { A } from '@expo/html-elements';

export default function GuildDetail({ navigation, route }) {

  const getFreshModel = () => ({
    guildLogo: undefined,
    guildName: undefined,
    guildIntro: undefined,
    district: undefined,
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
    if (route && route.params) {
      const { guild } = route.params;
      //console.log(guild)

      setValues({
        ...values,
        guildName: guild.guildName,
        guildIntro: guild.guildIntro,
        level: guild.level,
        memberNo: guild.memberNo,
      })
    }
  }, [route]);

  const PlaceholderImage = require('../assets/loginbackground2.png');
  const defaultLogoImage = require('../assets/defaultLogo.png');

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <Text style={styles.heading}>Guild Detail Page</Text>

      <View style={styles.cardContainer}>
        <View style={styles.row}>
          <Image source={defaultLogoImage} style={styles.logo} />
          <View style={styles.column}>
            <Text style={styles.guildName}>Name: {values.guildName}</Text>
            <Text style={styles.guildInfo}>Introduction: {values.guildIntro}</Text>
            <Text style={styles.guildDetails}>
              Level: {values.level} | Members: {values.memberNo}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://chat.whatsapp.com/BbKplYG4XqHGGvsjzJx895')}>
          <Text style={styles.buttonText}>Join WhatsApp Group</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://wa.me/85298245007?text=Hello, nice to meet you!')}>
          <Text style={styles.buttonText}>Chat With Master</Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Event', { guildName: values.guildName})}>
          <Text style={styles.buttonText}>Event</Text>
        </TouchableOpacity>

        


      <BottomBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
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
});