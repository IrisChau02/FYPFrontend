import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import BottomBar from "./BottomBar";

export default function GuildCreate({ navigation }) {

  const getFreshModel = () => ({
    guildLogo: null,
    guildName: undefined,
    guildIntro: undefined,
    districtDropdown: null,
    districtID: undefined,
    level: 1,
    member: 0
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const PlaceholderImage = require('../assets/loginbackground2.png');
  const defaultLogoImage = require('../assets/defaultLogo.png');

  //receives an object in which different options are specified. 
  //This object is an ImagePickerOptions object. 
  //We can pass the object to specify different options when invoking the method.
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      delete result.cancelled;
      //console.log(result);
      //console.log(result.assets[0].uri);

      setValues({
        ...values,
        guildLogo: result.assets[0].uri,
      })

    } else {
      alert('You did not select any image.');
    }
  };

  const [districtList, setDistrictList] = useState([]);

  useEffect(() => {

    axios
      .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getDistrict`)
      .then((res) => {
        if (res.data === 'failed') {
          console.log('No existing record');
        } else {
          console.log(res.data);
          setDistrictList(res.data)

        }
      })
      .catch((err) => console.log(err));

  }, []);

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <Text style={styles.heading}>Guild Create Page</Text>

      <TouchableOpacity style={styles.button} onPress={pickImageAsync}>
        <Text style={styles.buttonText}>Import Guild Logo</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <Image source={values.guildLogo ? { uri: values.guildLogo } : defaultLogoImage}
          style={{
            width: 150, height: 150, borderWidth: 3,
            borderColor: 'grey',
          }} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Guild Name"
        value={values.guildName}
        onChangeText={(text) => handleInputChange('guildName', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Guild Introduction"
        value={values.guildIntro}
        onChangeText={(text) => handleInputChange('guildIntro', text)}
      />

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
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  imageContainer: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray', // Set the background color
  },
});