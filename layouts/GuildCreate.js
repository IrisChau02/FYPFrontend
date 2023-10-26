import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import BottomBar from "./BottomBar";
import SelectDropdown from 'react-native-select-dropdown'
import { Dimensions } from 'react-native';

export default function GuildCreate({ navigation }) {

  const getFreshModel = () => ({
    guildLogo: null,
    guildName: undefined,
    guildIntro: undefined,
    districtDropdown: null,
    districtID: undefined,
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
          //console.log(res.data);
          setDistrictList(res.data)

        }
      })
      .catch((err) => console.log(err));

  }, []);

  const handleGuildCreate = () => {
    console.log(values)
    
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/createGuild`, values)
      .then((res) => {
        if (res.data === 'added') {
          alert('success')
          navigation.navigate('Guild')
        } else {
          alert('fail');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <Text style={styles.heading}>Guild Create Page</Text>

      <View style={styles.row}>
        <View style={styles.col}>
          <TouchableOpacity style={styles.button} onPress={pickImageAsync}>
            <Text style={styles.buttonText}>Import Guild Logo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.col}>
          <View style={styles.imageContainer}>
            <Image source={values.guildLogo ? { uri: values.guildLogo } : defaultLogoImage}
              style={{
                width: 150, height: 150, borderWidth: 3,
                borderColor: 'grey',
              }} />
          </View>
        </View>
      </View>


      <View style={styles.row}>
        <View style={styles.col}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Guild Name</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.col}>
          <TextInput
            style={styles.input}
            placeholder="Guild Name"
            value={values.guildName}
            onChangeText={(text) => handleInputChange('guildName', text)}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Guild Introduction</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.col}>
          <TextInput
            style={styles.input}
            placeholder="Guild Introduction"
            value={values.guildIntro}
            onChangeText={(text) => handleInputChange('guildIntro', text)}
            multiline={true}
            keyboardType="ascii-capable"
          />
        </View>
      </View>


      <View style={styles.row}>
        <View style={styles.col}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Select District</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.col}>
          <SelectDropdown
            data={districtList}
            onSelect={(selectedItem, index) => {
              //console.log(selectedItem, index);

              setValues({
                ...values,
                districtDropdown: selectedItem,
                districtID: selectedItem?.districtID
              })

            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // Return the districtName as the label after item is selected
              return selectedItem.districtName;
            }}
            rowTextForSelection={(item, index) => {
              // Return the districtName to represent each item in the dropdown
              return item.districtName;
            }}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Level</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.col}>
          <TextInput
            style={styles.input}
            placeholder="Level"
            value={values.level.toString()}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Member</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.col}>
          <TextInput
            style={styles.input}
            placeholder="Member"
            value={values.member.toString()}
          />
        </View>
      </View>

      <View style={styles.row}>
      <TouchableOpacity style={styles.button} onPress={handleGuildCreate}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,

  },
  col: {
    flexDirection: 'row',
    alignItems: 'center',
    //margin: 10,
    width: Dimensions.get('window').width / 2,
    justifyContent: 'center'
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
    width: 150,
    //margin: 20,
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
    width: 150,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray', // Set the background color
  },
});