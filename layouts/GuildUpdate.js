import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { CurrentUserID } from './CurrentUserID';
import * as ImagePicker from 'expo-image-picker';

import BottomBar from "./BottomBar";

import { AntDesign } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function GuildUpdate({ navigation, route }) {

  const getFreshModel = () => ({
    guildName: undefined,
    guildIntro: undefined,
    guildLogo: undefined,
    groupID: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const defaultLogoImage = require('../assets/defaultLogo.png');

  useEffect(() => {
    if (route && route.params) {
      setValues({
        ...values,
        guildName: route.params.guildName,
        guildIntro: route.params.guildIntro,
        guildLogo: route.params.guildLogo,
        groupID: route.params.groupID
      })
    }
  }, [route]);


  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //ensure the type is image
      allowsEditing: true,
      quality: 0.3,
      base64: true, // Set base64 to true to get the image data in base64 format
    });


    if (!result.canceled) {
      delete result.cancelled;

      setValues({
        ...values,
        guildLogo: result.assets[0].base64,
      })

    } else {
      alert('You do not select any guild logo.');
    }
  };

  const validate = () => {
    const temp = {};

    if (!values.guildName) {
      temp.guildName = "Guild Name cannot be empty.";
    } else {
      temp.guildName = "";
    }

    if (!values.guildIntro) {
      temp.guildIntro = "Guild Introduction cannot be empty.";
    } else if (values.guildIntro.length > 100) {
      temp.guildIntro = "Max 100 characters.";
    } else {
      temp.guildIntro = "";
    }

    setErrors(temp);

    return Object.values(temp).every((x) => x === "");
  };

  const handleGuildUpdate = () => {
    if (validate()) {
      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/updateGuild`, values)
        .then((res) => {
          if (res.data === 'updated') {
            //alert('Update successfully')
            navigation.navigate('GuildDetail')
          } else {
            alert('Failed to update');
          }
        })
        .catch((err) => console.log(err));
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>

      <Text style={styles.heading}>Update Guild</Text>

      <View style={styles.margincontainer}>

        <ScrollView style={{ marginBottom: 100 }}>

          <View style={styles.button}>
            <Text style={styles.buttonText}>Guild Name</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Input Guild Name..."
            value={values.guildName}
            editable={false}
          />
          {error.guildName && <Text style={styles.errorText}>{error.guildName}</Text>}

          <View style={styles.button}>
            <Text style={styles.buttonText}>Guild Introduction</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Input Guild Introduction..."
            value={values.guildIntro}
            onChangeText={(text) => handleInputChange('guildIntro', text)}
            multiline={true}
            keyboardType="ascii-capable"
            height={100}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ color: 'grey', fontSize: 10 }}>
              {values.guildIntro ? values.guildIntro.length : 0} / 100
            </Text>
          </View>
          {error.guildIntro && <Text style={styles.errorText}>{error.guildIntro}</Text>}


          <View style={styles.button} onPress={pickImageAsync}>
            <Text style={styles.buttonText}>Guild Logo</Text>
          </View>

          <TouchableOpacity onPress={pickImageAsync} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image source={values.guildLogo ? { uri: `data:image/jpeg;base64,${values.guildLogo}` } : defaultLogoImage}
              style={{ width: 200, height: 200, borderWidth: 2, borderColor: 'grey', borderRadius: 100, }} />
          </TouchableOpacity>

          <View style={styles.button}>
            <Text style={styles.buttonText}>Guild WhatsApp Group ID</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Input WhatsApp Group ID..."
            value={values.groupID}
            onChangeText={(text) => handleInputChange('groupID', text)}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleGuildUpdate}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>

        </ScrollView>

      </View>

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
    paddingBottom: 50
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1.2,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#91AC9A',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#F9F6F2',
    borderRadius: 30,
    padding: 10,
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 2,
  },
  cardContainerSelected: {
    backgroundColor: '#B5CDC2',
    borderRadius: 30,
    padding: 10,
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 2,
  },
  textInfo: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
    color: 'grey',
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 10,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});