import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import BottomBar from "./BottomBar";

export default function GuildCreate({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    loginName: undefined,
    guildLogo: null,
    guildName: undefined,
    guildIntro: undefined,
    districtID: undefined,
    districtName: undefined,
    level: 1,
    member: 1
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
      const props = route.params;

      setValues({
        ...values,
        userID: props.props.userID,
      })
    }
  }, [route]);

  const defaultLogoImage = require('../assets/defaultLogo.png');

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
      alert('You did not select any image.');
    }
  };

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
              loginName: res.data[0].loginName,
              districtID: res.data[0].districtID,
            })
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.userID]);

  useEffect(() => {
    if (values.districtID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getDistrict`)
        .then((res) => {
          if (res.data === 'failed') {
            console.log('No existing record');
          } else {
            const matchingDistrict = res.data.find(
              (district) => district.districtID === values.districtID
            );
            setValues({
              ...values,
              districtName: matchingDistrict ? matchingDistrict.districtName : null
            })
          }
        })
        .catch((err) => console.log(err));
    }

  }, [values.districtID]);


  const handleGuildCreate = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/createGuild`, values)
      .then((res) => {
        if (res.data === 'added') {
          alert('Create successfully')
          navigation.navigate('GuildDetail')
        } else {
          alert('Failed to create');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Create Guild</Text>

      <ScrollView style={styles.margincontainer}>

        <View style={styles.button} onPress={pickImageAsync}>
          <Text style={styles.buttonText}>Guild Logo</Text>
        </View>
        <TouchableOpacity onPress={pickImageAsync} style={styles.imageContainer}>
          <Image source={values.guildLogo ? { uri: `data:image/jpeg;base64,${values.guildLogo}` } : defaultLogoImage}
            style={{ width: 150, height: 150, borderWidth: 1.5, borderColor: 'grey', borderRadius: 90 }} />
        </TouchableOpacity>


        <View style={styles.button}>
          <Text style={styles.buttonText}>Guild Name</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Input Guild Name..."
          value={values.guildName}
          onChangeText={(text) => handleInputChange('guildName', text)}
        />


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
        />


        <View style={styles.button}>
          <Text style={styles.buttonText}>Master</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Level"
          value={values.loginName}
          editable={false}
        />


        <View style={styles.button}>
          <Text style={styles.buttonText}>District</Text>
        </View>
        <TextInput
          style={styles.input}
          value={values.districtName}
          editable={false}
        />


        <View style={styles.button}>
          <Text style={styles.buttonText}>Level</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Level"
          value={values.level.toString()}
          editable={false}
        />


        <View style={styles.button}>
          <Text style={styles.buttonText}>Member</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Member"
          value={values.member.toString()}
          editable={false}
        />

        <TouchableOpacity style={styles.greenbutton} onPress={handleGuildCreate}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </ScrollView>

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
    backgroundColor: '#91AC9A',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  greenbutton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1.2,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});