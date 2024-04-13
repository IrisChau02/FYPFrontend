import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { CurrentUserID } from './CurrentUserID';
import * as ImagePicker from 'expo-image-picker';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useRef } from 'react';

import BottomBar from "./BottomBar";

import { AntDesign } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function MissionFinish({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    missionID: undefined,
    missionName: undefined,
    missionDetail: undefined,
    missionMode: undefined,
    missionDifficulty: undefined,
    isSystem: undefined,
    isFinish: undefined,
    missionPhoto: undefined,
    missionLastDate: undefined,
    missionKeepTime: undefined,
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
        userID: route.params.mission.userID,
        missionID: route.params.mission.missionID,
        missionName: route.params.mission.missionName,
        missionDetail: route.params.mission.missionDetail,
        missionMode: route.params.mission.missionMode,
        missionDifficulty: route.params.mission.missionDifficulty,
        isSystem: route.params.mission.isSystem,
        isFinish: route.params.mission.isFinish,
        missionLastDate: route.params.mission.missionLastDate,
        missionKeepTime: route.params.mission.missionKeepTime
      })

    }
  }, [route]);

  const viewRef = useRef(null);

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
        missionPhoto: result.assets[0].base64,
      })

    } else {
      alert('You need to provide pictures of doing the mission.');
    }
  };

  const shareViewToWhatsApp = async () => {
    try {
      // Get the reference to the view
      const view = viewRef.current;

      // Capture the specific part of the view as a base64 image
      const captureOptions = {
        format: 'png',
        quality: 0.3
      };
      const imageURI = await captureRef(view, captureOptions);

      // Share the image to WhatsApp
      await Sharing.shareAsync(imageURI, { mimeType: 'image/png', dialogTitle: 'Share to WhatsApp' });
    } catch (error) {
      console.error('Error sharing image to WhatsApp:', error);
    }
  };


  const handleFinishMission = () => {
    if (values.missionPhoto) {

      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/finishMission`, values)
        .then((res) => {
          if (res.data === 'updated') {
            shareViewToWhatsApp();

            setTimeout(() => {
              //only Daily and weekly have cumulative
              if (values.missionMode === 'Daily' || values.missionMode === 'Weekly') {
                alert(
                  `Mission Difficulty: ${values.missionDifficulty}\nMission Keep Time: ${values.missionKeepTime + 1}\nCheckpoint gain = ${values.missionDifficulty === "Easy" ? 1 : values.missionDifficulty === "Normal" ? 2 : values.missionDifficulty === "Medium" ? 3 : values.missionDifficulty === "Hard" ? 4 : 0} * ${values.missionKeepTime + 1}`
                );
              } else {
                alert(
                  `Mission Difficulty: ${values.missionDifficulty}\nCheckpoint gain = ${values.missionDifficulty === "Easy" ? 1 : values.missionDifficulty === "Normal" ? 2 : values.missionDifficulty === "Medium" ? 3 : values.missionDifficulty === "Hard" ? 4 : 0}`
                );
              }

              navigation.navigate('Mission')
            }, 1000);

          } else {
            alert('Failed to update');
          }
        })
        .catch((err) => console.log(err));

    } else {
      alert('Mission photo need to be uploaded.');
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>

      <Text style={styles.heading}>Finish Mission</Text>

      <View style={styles.margincontainer}>

        <ScrollView style={{ marginBottom: 100 }}>

          <View style={styles.button}>
            <Text style={styles.buttonText}>Mission Name</Text>
          </View>

          <TextInput
            style={[styles.input]}
            placeholder="Mission Name"
            value={values.missionName}
            multiline={true}
            editable={false}
          />

          <View style={styles.button}>
            <Text style={styles.buttonText}>Mission Detail</Text>
          </View>

          <TextInput
            style={[styles.input]}
            placeholder="Mission Detail"
            value={values.missionDetail}
            multiline={true}
            editable={false}
          />

          <View style={styles.button}>
            <Text style={styles.buttonText}>Mission Mode</Text>
          </View>

          <TextInput
            style={[styles.input]}
            placeholder="Mission Mode"
            value={values.missionMode}
            editable={false}
          />

          <View style={styles.button}>
            <Text style={styles.buttonText}>Mission Difficulty</Text>
          </View>

          <TextInput
            style={[styles.input]}
            placeholder="Mission Difficulty"
            value={values.missionDifficulty}
            editable={false}
          />

          <View style={styles.button} onPress={pickImageAsync}>
            <Text style={styles.buttonText}>Mission Photo</Text>
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View ref={viewRef} style={{ aspectRatio: 1, width: 300, height: 300 }}>
              <Image source={values.missionPhoto ? { uri: `data:image/jpeg;base64,${values.missionPhoto}` } : defaultLogoImage}
                style={{ width: '100%', height: '100%' }} />
            </View>
          </View>

          <TouchableOpacity
            onPress={pickImageAsync}
            style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
          >
            <AntDesign name="camera" size={50} color="grey" />
          </TouchableOpacity>

          <TouchableOpacity style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, margin: 10 }} onPress={handleFinishMission}>
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