import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

import { AntDesign } from '@expo/vector-icons';

import BottomBar from "./BottomBar";

export default function ProfileSportsUpdate({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    sportsID: undefined,
    sportsName: undefined,

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
      const props = route.params;

      setValues({
        ...values,
        userID: props.props.userID,
        sportsID: props.props.sportsID,
        sportsName: props.props.sportsName
        
      })
    }
  }, [route]);


  const [sportsList, setSportsList] = useState([]);

  const fetchData = async () => {
    try {

      const sportsResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getSports`);

      const [sportsData] = await Promise.all([
        sportsResponse,
      ]);

      setSportsList(sportsData.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmButton = () => {
    if (values.sportsID.length === 0) {
      alert("Favourite Sport cannot be empty.")
    } else {

      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/updateSportsID`, values)
        .then((res) => {
          if (res.data === 'updated') {
            alert('Success');
            navigation.navigate('Home')
          }
        })
        .catch((err) => console.log(err));
    }

  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Update Favourite Sports</Text>
      <ScrollView style={styles.margincontainer}>
        
        <TouchableOpacity style={styles.subbutton}>
          <Text style={styles.buttonText}>Individual Sports</Text>
        </TouchableOpacity>
        {
          sportsList.filter(item => item.sportsModeID === 1).map(item => (
            <TouchableOpacity
              key={item.sportsID}
              onPress={() => {
                if (values.sportsID.includes(item.sportsID)) {
                  // If the sportsID is already selected, remove it from the array
                  setValues({
                    ...values,
                    sportsID: values.sportsID.filter(id => id !== item.sportsID),
                  });
                } else if (values.sportsID.length < 3) {
                  // If the sportsID is not selected and the maximum limit (3) is not reached, add it to the array
                  setValues({
                    ...values,
                    sportsID: [...values.sportsID, item.sportsID],
                  });
                }
              }}
            >
              <View style={
                values.sportsID.includes(item.sportsID)
                  ? styles.cardContainerSelected
                  : styles.cardContainer
              }>
                <Text style={styles.textInfo}>{item.sportsName}</Text>
              </View>
            </TouchableOpacity>
          ))
        }


        <TouchableOpacity style={styles.subbutton}>
          <Text style={styles.buttonText}>Team Sports</Text>
        </TouchableOpacity>
        {
          sportsList.filter(item => item.sportsModeID === 2).map(item => (
            <TouchableOpacity
              key={item.sportsID}
              onPress={() => {
                if (values.sportsID.includes(item.sportsID)) {
                  // If the sportsID is already selected, remove it from the array
                  setValues({
                    ...values,
                    sportsID: values.sportsID.filter(id => id !== item.sportsID),
                  });
                } else if (values.sportsID.length < 3) {
                  // If the sportsID is not selected and the maximum limit (3) is not reached, add it to the array
                  setValues({
                    ...values,
                    sportsID: [...values.sportsID, item.sportsID],
                  });
                }
              }}
            >
              <View style={
                values.sportsID.includes(item.sportsID)
                  ? styles.cardContainerSelected
                  : styles.cardContainer
              }>
                <Text style={styles.textInfo}>{item.sportsName}</Text>
              </View>
            </TouchableOpacity>
          ))
        }

        <TouchableOpacity style={styles.submitButton} onPress={handleConfirmButton}>
          <Text style={styles.submitButtonText}>Confirm</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.bottomBarContainer}>
        <BottomBar navigation={navigation} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  margincontainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F1F1F1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
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
  subbutton: {
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
    fontWeight: 'bold'
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 80,
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