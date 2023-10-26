import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';

import BottomBar from "./BottomBar";
import GuildCard from "../components/GuildCard";

export default function Guild({ navigation}) {

  const getFreshModel = () => ({
    firstName: undefined,
    lastName: undefined,
    formatbirthday: undefined,
    gender: undefined,
    phoneNumber: undefined,
    email: undefined,
    password: undefined,
    loginName: undefined,
    confirmPassword: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const PlaceholderImage = require('../assets/loginbackground2.png');

  const [guildList, setGuildList] = useState([]);

  useEffect(() => {
   
  
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getGuild`)
        .then((res) => {
          console.log(res.data)
          setGuildList(res.data)
          

          /*if (res.data === 'failed') {
            alert('No existing record');
          } else {
            alert('Success');
            //console.log(res.data);

            setValues({
              ...values,
              firstName: res.data[0].firstName,
              lastName: res.data[0].lastName,
              formatbirthday: res.data[0].birthday,
              gender: res.data[0].gender,
              phoneNumber: res.data[0].phoneNumber,
              email: res.data[0].email
            })
          }*/

        })
        .catch((err) => console.log(err));
    
  }, []);

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <Text style={styles.heading}>Guild Page</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GuildCreate')}>
        <Text style={styles.buttonText}>Create your own guild!</Text>
      </TouchableOpacity>

      <FlatList
        data={guildList}
        renderItem={({ item }) => <GuildCard guild={item} />}
        keyExtractor={(item, index) => index.toString()}
        style={styles.cardList}
      />
    
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
  }
});