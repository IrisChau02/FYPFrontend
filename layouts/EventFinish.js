import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import axios from 'axios';
import { CurrentUserID } from './CurrentUserID';
import * as ImagePicker from 'expo-image-picker';

import BottomBar from "./BottomBar";

import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useRef } from 'react';

import { AntDesign } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function EventFinish({ navigation, route }) {

  const getFreshModel = () => ({
    eventName: undefined,
    guildName: undefined,
    eventPhoto: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const defaultLogoImage = require('../assets/defaultLogo.png');

  const viewRef = useRef(null);

  useEffect(() => {
    if (route && route.params) {
      setValues({
        ...values,
        eventName: route.params.eventName,
        guildName: route.params.guildName,
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
        eventPhoto: result.assets[0].base64,
      })

    } else {
      alert('You need to provide pictures of the event.');
    }
  };


  const handleFinishEvent = () => {
    if (values.eventPhoto) {
      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/finishGuildEvent`, values)
        .then((res) => {
          if (res.data === 'updated') {
            shareViewToWhatsApp();

            setTimeout(() => {
              navigation.navigate('Event')
            }, 1000);

          } else {
            alert('Failed to update');
          }
        })
        .catch((err) => console.log(err));
    } else {
      alert('Event photo need to be uploaded.');
    }
  }

  const shareViewToWhatsApp = async () => {
    try {
      // Get the reference to the view
      const view = viewRef.current;

      // Capture the specific part of the view as a base64 image
      const captureOptions = {
        format: 'png',
        quality: 0.6
      };
      const imageURI = await captureRef(view, captureOptions);

      // Share the image to WhatsApp
      await Sharing.shareAsync(imageURI, { mimeType: 'image/png', dialogTitle: 'Share to WhatsApp' });
    } catch (error) {
      console.error('Error sharing image to WhatsApp:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>

      <Text style={styles.heading}>Finish Event</Text>

      <View style={styles.margincontainer}>

        <ScrollView style={{ marginBottom: 100 }}>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Event Photo</Text>
          </TouchableOpacity>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>

            <View ref={viewRef} style={{ aspectRatio: 1, width: 300, height: 300 }}>
              <ImageBackground source={values.eventPhoto ? { uri: `data:image/jpeg;base64,${values.eventPhoto}` } : defaultLogoImage}
                style={{ width: '100%', height: '100%' }} />
            </View>
          </View>

          <TouchableOpacity
            onPress={pickImageAsync}
            style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
          >
            <AntDesign name="camera" size={50} color="grey" />
          </TouchableOpacity>

          <TouchableOpacity style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, margin: 10 }} onPress={handleFinishEvent}>
            <Text style={styles.buttonText}>Finish</Text>
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
    width: 100
  },
  submitButtonText: {
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