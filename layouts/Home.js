import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';

//import { TextField, Button, Card, CardContent } from '@mui/material';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Divider } from 'react-native-paper';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import BottomBar from "./BottomBar";
import { setCurrentUserID } from './CurrentUserID';

export default function Home({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    firstName: undefined,
    lastName: undefined,
    formatbirthday: undefined,
    gender: undefined,
    phoneNumber: undefined,
    email: undefined,
    password: undefined,
    loginName: undefined,
    districtName: undefined,
    workModeID: undefined,
    workModeName: undefined,
    sportsID: [],
    sportsName: [],
    userLogo: undefined,
    userIntro: undefined,
    guildName: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const PlaceholderImage = require('../assets/loginbackground2.png');
  const defaultLogoImage = require('../assets/defaultUserLogo.png');

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

  const [waitingFriendList, setWaitingFriendList] = useState([]);

  useEffect(() => {
    if (values.userID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getWaitingFriendList`, {
          params: {
            userID: values.userID,
          },
        })
        .then((res) => {
          if (res.data.length !== 0) {
            setWaitingFriendList(res.data); // Update the waitingFriendList state
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.userID]);

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

  useEffect(() => {
    if (values.loginName !== undefined && values.password !== undefined && districtList.length !== 0 && workingModeList.length !== 0 && sportsList.length !== 0) {

      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserData`, {
          params: {
            loginName: values.loginName,
            password: values.password,
          },
        })
        .then((res) => {
          if (res.data === 'failed') {
            //alert('No existing record');
          } else {

            const selectedDistrict = districtList.find(item => item.districtID === res.data[0].districtID);
            const selectedworkMode = workingModeList.find(item => item.workModeID === res.data[0].workModeID);

            const sportsID = res.data[0].sportsID;
            const sportsIDArray = sportsID.split(",").map(Number);

            const sportsNameArray = sportsList
              .filter(item => sportsIDArray.includes(item.sportsID))
              .map(item => item.sportsName);

            setCurrentUserID(res.data[0].userID)

            setValues({
              ...values,
              userID: res.data[0].userID,
              firstName: res.data[0].firstName,
              lastName: res.data[0].lastName,
              formatbirthday: res.data[0].birthday,
              gender: res.data[0].gender,
              phoneNumber: res.data[0].phoneNumber,
              email: res.data[0].email,
              userLogo: res.data[0].userLogo,
              userIntro: res.data[0].userIntro,
              districtName: selectedDistrict.districtName,
              workModeID: res.data[0].workModeID,
              workModeName: selectedworkMode.workModeName,
              sportsID: sportsIDArray,
              sportsName: sportsNameArray,
              guildName: res.data[0].guildName,
            })

          }
        })
        .catch((err) => console.log(err));
    }
  }, [values, districtList, workingModeList, sportsList]); //values.loginName, values.password, values.userLogo

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <View style={styles.margincontainer}>
        <Text style={styles.heading}>Home Page</Text>

        <ScrollView style={{ marginBottom: 100 }}>

          <View style={styles.cardContainer}>

            <Card style={styles.card}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <AntDesign name="user" size={24} color="grey" />
                <Text style={styles.label}>Profile</Text>
                <AntDesign name="form" size={24} color="grey" onPress={() => navigation.navigate('ProfileDetail', { props: values })} />
              </View>

              <Divider style={{ marginBottom: 10 }} />

              <View style={styles.row}>
                <View style={styles.column}>
                  <Image source={values.userLogo ? { uri: `data:image/jpeg;base64,${values.userLogo}` } : defaultLogoImage} style={styles.logo} />
                  <AntDesign name="camera" size={24} color="grey" onPress={() => navigation.navigate('ProfileLogoUpdate', { props: values })} />
                </View>
                <View style={styles.column}>
                  <TextInput
                    style={styles.input}
                    value={values.loginName}
                  />
                  <TextInput
                    style={styles.input}
                    value={values.gender}
                  />
                  <TextInput
                    style={styles.input}
                    value={values.formatbirthday}
                  />

                </View>
              </View>

              <Divider style={{ marginTop: 10, marginBottom: 10 }} />

              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <AntDesign name="message1" size={24} color="grey" />

                <TextInput
                  style={styles.messageInput}
                  placeholder="Type your message here..."
                  value={values.userIntro}
                  multiline={true}
                />

              </View>
            </Card>
          </View>

          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <AntDesign name="addusergroup" size={24} color="grey" />
                <Text style={styles.label} >Friend List</Text>
                {/*
                 <MaterialCommunityIcons name="account-details" size={24} color="grey" />
                */}
              </View>
              <Divider />


              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FriendList')}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.buttonText}>Details</Text>
                    <AntDesign name="search1" size={24} color="#FFF" />
                  </View>

                  {waitingFriendList.length !== 0 && (
                    <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 30, marginTop: 1, marginBottom: 1, borderWidth: 2, borderColor: 'white' }}>
                      <MaterialCommunityIcons name="alarm-plus" size={24} color="#FFF" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>


            </Card>
          </View>

          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <AntDesign name="idcard" size={24} color="grey" />
                <Text style={styles.label} >Working Mode</Text>
                <AntDesign name="form" size={24} color="grey" onPress={() => navigation.navigate('ProfileWMUpdate', { props: values })} />
              </View>
              <Divider />
              <View style={styles.button}>
                <Text style={styles.buttonText}>{values.workModeName}</Text>
              </View>
            </Card>
          </View>


          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <AntDesign name="heart" size={24} color="grey" />
                <Text style={styles.label} >Favourite Sports</Text>
                <AntDesign name="form" size={24} color="grey" onPress={() => navigation.navigate('ProfileSportsUpdate', { props: values })} />
              </View>
              <Divider />
              {values.sportsName.map((item, index) => (
                <View key={index} style={styles.button}>
                  <Text style={styles.buttonText}>{item}</Text>
                </View>
              ))}

            </Card>
          </View>

        </ScrollView>
      </View>
      <View style={styles.bottomBarContainer}>
        <BottomBar navigation={navigation} />
      </View>
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
    height: 'auto',
    marginBottom: 16,
  },
  card: {
    height: 'auto',
    padding: 16,
    backgroundColor: 'white',
    // Set any other styles for the card if needed
  },
  input: {
    height: 40,
    //borderColor: 'gray',
    //borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray', // Set the background color
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flex: 1, // Use flex: 1 to make the column take up remaining horizontal space
    //marginLeft: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  button: {
    backgroundColor: 'grey',
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
  label: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  messageInput: {
    flex: 1,
    height: 'auto',
    borderWidth: 2,
    borderColor: '#ccc',
    paddingHorizontal: 5,
    color: "grey",
    marginTop: 10,
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
  },
});

/*
https://docs.expo.dev/versions/latest/sdk/sharing/
https://www.volcengine.com/theme/6356016-Z-7-1

group
https://stackoverflow.com/questions/43518482/react-native-send-a-message-to-specific-whatsapp-number
https://stackoverflow.com/questions/68435788/whatsapp-share-using-expo-sharing-library-in-androidreact-native
*/