import { useEffect, useRef } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

export default function InitialAccount({ navigation, route }) {

  const getFreshModel = () => ({
    isDistrict: true,
    isWorkingMode: false,
    isSport: false,
    isTimeslot: false,
    loginName: undefined,
    password: undefined,
    workModeID: undefined,
    districtID: undefined,
    sportsID: [],
    timeslotID: undefined,
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
  const [timeslotList, setTimeslotList] = useState([]);

  const fetchData = async () => {
    try {
      const districtResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getDistrict`);
      const workingModeResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getWorkingMode`);
      const sportsResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getSports`);
      const timeslotResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getTimeslot`);

      const [districtData, workingModeData, sportsData, timeslotData] = await Promise.all([
        districtResponse,
        workingModeResponse,
        sportsResponse,
        timeslotResponse
      ]);

      setDistrictList(districtData.data);
      setWorkingModeList(workingModeData.data);
      setSportsList(sportsData.data);
      setTimeslotList(timeslotData.data);
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
        isTimeslot: true
      })
    } else if (values.isTimeslot) {
      setValues({
        ...values,
        isTimeslot: false,
        isSport: true
      })
    }

  };

  const handleBackButton = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
    if (values.isSport) {
      setValues({
        ...values,
        isSport: false,
        isTimeslot: true
      })
    } else if (values.isTimeslot) {
      setValues({
        ...values,
        isTimeslot: false,
        isWorkingMode: true
      })
    } else if (values.isWorkingMode) {
      setValues({
        ...values,
        isWorkingMode: false,
        isDistrict: true
      })
    }
  };


  const handleConfirmButton = () => {
    if (!values.districtID || !values.workModeID || !values.sportsID || !values.timeslotID) {
      alert("District, Working Mode, Timeslot, and Favourite Sport must be selected.")
    } else {

      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/initiateAccount`, values)
        .then((res) => {
          if (res.data === 'updated') {
            //alert('Success');
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
        <TouchableOpacity style={styles.titleButton}>
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
        <TouchableOpacity style={styles.titleButton}>
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
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Initial User Account</Text>
      <ScrollView ref={scrollViewRef} style={styles.margincontainer}>

        {values.isDistrict ? (<Text style={styles.label}>Select Your District</Text>) : null}
        {values.isWorkingMode ? (<Text style={styles.label}>Select Your Working Mode</Text>) : null}
        {values.isTimeslot ? (<Text style={styles.label}>Select Your Favourite Timeslot</Text>) : null}
        {values.isSport ? (<Text style={styles.label}>Select Your Favourite Sports</Text>) : null}
        {values.isSport ? (<Text style={{ color: 'gray', fontSize: 12, textAlign: 'center' }}>(Max can choose 3)</Text>) : null}

        <View style={styles.divider} />

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


        {values.isTimeslot ? (
          timeslotList.map((item) => (
            <TouchableOpacity
              key={item.timeslotID}
              onPress={() =>
                setValues({
                  ...values,
                  timeslotID: item.timeslotID,
                })
              }
            >
              <View
                style={
                  values.timeslotID === item.timeslotID
                    ? styles.cardContainerSelected
                    : styles.cardContainer
                }
              >
                <Text style={styles.textInfo}>{item.timeslotName}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : null}


        {values.isSport ? (<SportsButton buttonText="Individual Sports" sportsModeID={1} />) : null}
        {values.isSport ? (<SportsButton buttonText="Team Sports" sportsModeID={2} />) : null}


        <View style={{ flexDirection: 'row' }}>
          {values.isWorkingMode || values.isTimeslot || values.isSport ? (
            <TouchableOpacity style={[styles.greenButton, { marginRight: 'auto' }]} onPress={handleBackButton}>
              <Text style={styles.whiteButtonText}>Back</Text>
            </TouchableOpacity>
          ) : null}

          {values.isDistrict || values.isWorkingMode || values.isTimeslot ? (
            <TouchableOpacity style={[styles.greenButton, { marginLeft: 'auto' }]} onPress={handleNextButton}>
              <Text style={styles.whiteButtonText}>Next</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {values.isSport ? (
            <TouchableOpacity style={styles.greenButton} onPress={handleConfirmButton}>
              <Text style={styles.whiteButtonText}>Confirm</Text>
            </TouchableOpacity>
          ) : null}
        </View>

      </ScrollView>
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
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  label: {
    fontSize: 20,
    color: 'grey',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    margin: 10,
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
  greenButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    width: 100
  },
  whiteButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  titleButton: {
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
  }
});