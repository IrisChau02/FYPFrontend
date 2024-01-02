import { useEffect, useRef } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
//import { TextField, Button, Card, CardContent } from '@mui/material';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';

export default function InitialAccount({ navigation, route }) {

  const getFreshModel = () => ({
    isDistrict: true,
    isWorkingMode: false,
    isSport: false,
    loginName: undefined,
    password: undefined,
    workModeID: undefined,
    districtID: undefined,
    sportsID: [],
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const PlaceholderImage = require('../assets/loginbackground2.png');
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (route && route.params) {
      const { loginName, password } = route.params;

      setValues({
        ...values,
        loginName: loginName,
        password: password
      })
    }
  }, [route]);

  const [districtList, setDistrictList] = useState([]);
  const [workingModeList, setWorkingModeList] = useState([]);
  const [sportsList, setSportsList] = useState([]);

  const fetchData = async () => {
    try {
      const districtResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getDistrict`);
      const workingModeResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getWorkingMode`);
      const sportsResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getSports`);

      const [districtData, workingModeData, sportsData] = await Promise.all([
        districtResponse,
        workingModeResponse,
        sportsResponse,
      ]);

      setDistrictList(districtData.data);
      setWorkingModeList(workingModeData.data);
      setSportsList(sportsData.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNextButton = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
    if (values.isDistrict) {
      setValues({
        ...values,
        isDistrict: false,
        isWorkingMode: true,
      })
    } else if (values.isWorkingMode) {
      setValues({
        ...values,
        isWorkingMode: false,
        isSport: true
      })
    }


  };

  const handleBackButton = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
    if (values.isWorkingMode) {
      setValues({
        ...values,
        isWorkingMode: false,
        isDistrict: true
      })
    } else if (values.isSport) {
      setValues({
        ...values,
        isSport: false,
        isWorkingMode: true
      })
    }

  };


  const handleConfirmButton = () => {
    if (!values.districtID || !values.workModeID || !values.sportsID) {
      alert("District, Work Mode, Favourite Sport cannot be empty.")
    } else {

      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/initiateAccount`, values)
        .then((res) => {
          if (res.data === 'updated') {
            alert('Success');
            navigation.navigate('Login')
          }
        })
        .catch((err) => console.log(err));
    }

  };

  const DistrictButton = ({ buttonText, regionID }) => {
    const filteredList = values.isDistrict
      ? districtList.filter(item => item.regionID === regionID)
      : [];

    return (
      <>
        <TouchableOpacity style={styles.subbutton}>
          {values.isDistrict ? <Text style={styles.buttonText}>{buttonText}</Text> : null}
        </TouchableOpacity>

        {values.isDistrict ? (
          filteredList.map(item => (
            <TouchableOpacity
              key={item.districtID}
              onPress={() =>
                setValues({
                  ...values,
                  districtID: item.districtID,
                })
              }
            >
              <View
                style={
                  values.districtID === item.districtID
                    ? styles.cardContainerSelected
                    : styles.cardContainer
                }
              >

                <Text style={styles.textInfo}>{item.districtName}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : null}
      </>
    );
  };

  const SportsButton = ({ buttonText, sportsModeID }) => {
    const filteredList = values.isSport
      ? sportsList.filter(item => item.sportsModeID === sportsModeID)
      : [];

    return (
      <>
        <TouchableOpacity style={styles.subbutton}>
          {values.isSport ? <Text style={styles.buttonText}>{buttonText}</Text> : null}
        </TouchableOpacity>

        {values.isSport ? (
          filteredList.map(item => (
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
              <View
                style={
                  values.sportsID.includes(item.sportsID)
                    ? styles.cardContainerSelected
                    : styles.cardContainer
                }
              >
                <Text style={styles.textInfo}>{item.sportsName}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : null}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <ScrollView ref={scrollViewRef} style={styles.margincontainer}>
        <Text style={styles.heading}>Initial User Account Page</Text>

        <TouchableOpacity style={styles.button}>
          {values.isDistrict ? (<Text style={styles.buttonText}>Select Your District</Text>) : null}
          {values.isWorkingMode ? (<Text style={styles.buttonText}>Select Your Working Mode</Text>) : null}
          {values.isSport ? (<Text style={styles.buttonText}>Select Your Favourite Sports</Text>) : null}
          {values.isSport ? (<Text style={{
            color: '#fff',
            fontSize: 12,
            textAlign: 'center',
          }}>(Max can choose 3)</Text>) : null}
        </TouchableOpacity>

        {values.isDistrict ? (<DistrictButton buttonText="Hong Kong Island" regionID={1} />) : null}
        {values.isDistrict ? (<DistrictButton buttonText="Kowloon" regionID={2} />) : null}
        {values.isDistrict ? (<DistrictButton buttonText="New Territories" regionID={3} />) : null}

        {values.isWorkingMode ? (
          workingModeList.map((item) => (
            <TouchableOpacity
              key={item.workModeID}
              onPress={() =>
                setValues({
                  ...values,
                  workModeID: item.workModeID,
                })
              }
            >
              <View
                style={
                  values.workModeID === item.workModeID
                    ? styles.cardContainerSelected
                    : styles.cardContainer
                }
              >
                <Text style={styles.textInfo}>{item.workModeName}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : null}




        {values.isSport ? (<SportsButton buttonText="Individual Sports" sportsModeID={1} />) : null}
        {values.isSport ? (<SportsButton buttonText="Team Sports" sportsModeID={2} />) : null}


        <View style={{ flexDirection: 'row' }}>
          {values.isWorkingMode || values.isSport ? (
            <TouchableOpacity style={[styles.submitButton, { marginRight: 'auto' }]} onPress={handleBackButton}>
              <Text style={styles.submitButtonText}>Back</Text>
            </TouchableOpacity>
          ) : null}

          {values.isDistrict || values.isWorkingMode ? (
            <TouchableOpacity style={[styles.submitButton, { marginLeft: 'auto' }]} onPress={handleNextButton}>
              <Text style={styles.submitButtonText}>Next</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {values.isSport ? (
            <TouchableOpacity style={styles.submitButton} onPress={handleConfirmButton}>
              <Text style={styles.submitButtonText}>Confirm</Text>
            </TouchableOpacity>
          ) : null}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  margincontainer: { // Corrected style name
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
  cardContainerSelected: {
    backgroundColor: 'green', // Rice color
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
  textInfo: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
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
  button: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  subbutton: {
    backgroundColor: '#91AC9A',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    borderColor: '#9C9885', // Gray border color
    borderWidth: 4, // Border width
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});