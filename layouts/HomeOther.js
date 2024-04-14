import { useEffect, useRef } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Divider } from 'react-native-paper';
import axios from 'axios';

import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { CurrentUserID } from './CurrentUserID'; //current userID

import BottomBar from "./BottomBar";

export default function HomeOther({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined, //not current user, is the user by passed params
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
    timeslotID: undefined,
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

  const PlaceholderImage = require('../assets/background.png');
  const defaultLogoImage = require('../assets/defaultUserLogo.png');

  useEffect(() => {
    if (route && route.params) {
      const { userID } = route.params;

      setValues({
        ...values,
        userID: userID
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

  useEffect(() => {
    fetchUserData();
  }, [values.userID, values.password, districtList, workingModeList, sportsList]);

  const fetchUserData = async () => {
    if (values.userID !== undefined && districtList.length !== 0 && workingModeList.length !== 0 && sportsList.length !== 0) {

      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserDataByID`, {
          params: {
            userID: values.userID,
          },
        })
        .then((res) => {
          if (res.data !== 'failed') {
            const selectedDistrict = districtList.find(item => item.districtID === res.data[0].districtID);
            const selectedworkMode = workingModeList.find(item => item.workModeID === res.data[0].workModeID);

            const sportsID = res.data[0].sportsID;
            const sportsIDArray = sportsID.split(",").map(Number);

            const sportsNameArray = sportsList
              .filter(item => sportsIDArray.includes(item.sportsID))
              .map(item => item.sportsName);

            setValues({
              ...values,
              userID: res.data[0].userID,
              loginName: res.data[0].loginName,
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
              timeslotID: res.data[0].timeslotID,
              sportsID: sportsIDArray,
              sportsName: sportsNameArray,
              guildName: res.data[0].guildName,
            })
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    fetchIsFriend();
  }, [values.userID, CurrentUserID]);

  const fetchIsFriend = async () => {
    if (values.userID && CurrentUserID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserIsFriendWithUser`, {
          params: {
            user1ID: values.userID,
            user2ID: CurrentUserID
          },
        })
        .then((res) => {
          //console.log(res.data) //not friend: []
          if (res.data.length !== 0) { //have data in the array
            setIsFriend(true)
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={PlaceholderImage} style={styles.image} />

      <View style={styles.margincontainer}>

        <View style={{
          height: 'auto',
          marginTop: 30,
          marginBottom: 16,
        }}>

          <Card style={{
            height: 'auto',
            padding: 10,
            backgroundColor: '#F1F1F1',
            justifyContent: 'center',
          }}>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Image
                  source={values.userLogo ? { uri: `data:image/jpeg;base64,${values.userLogo}` } : defaultLogoImage}
                  style={styles.logo}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TextInput style={styles.input} value={values.loginName} />

              {values.gender !== 'NA' && (
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 90,
                    backgroundColor: values.gender === 'F' ? 'pink' : '#1E90FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10
                  }}
                >
                  {values.gender === 'F' ? (
                    <Ionicons name="female" size={24} color="white" />
                  ) : (
                    <Ionicons name="male" size={24} color="white" />
                  )}
                </View>
              )}

              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 90,
                  backgroundColor: values.timeslotID === 1 ? 'orange' : values.timeslotID === 2 ? '#EED202' : values.timeslotID === 3 ? '#FFAE42' : '#30106B',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {values.timeslotID === 1 ? (
                  <Feather name="sunrise" size={24} color="white" />
                ) : null}

                {values.timeslotID === 2 ? (
                  <Feather name="sun" size={24} color="white" />
                ) : null}

                {values.timeslotID === 3 ? (
                  <Feather name="sunset" size={24} color="white" />
                ) : null}

                {values.timeslotID === 4 ? (
                  <Feather name="moon" size={24} color="white" />
                ) : null}
              </View>

            </View>


            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              {values.sportsName.map((item, index) => (
                <View key={index} style={{
                  height: 30,
                  borderColor: 'grey',
                  borderWidth: 1.2,
                  marginBottom: 10,
                  paddingHorizontal: 5,
                  borderRadius: 30,
                  marginRight: 5,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 12, color: 'grey' }}>{item}</Text>
                </View>
              ))}
            </View>

            <Divider style={{ margin: 10 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <AntDesign name="idcard" size={24} color="grey" />
              <Text style={{ fontSize: 16, color: 'grey', margin: 5 }}>{values.workModeName}</Text>
            </View>

            <Divider style={{ margin: 10 }} />

            <View style={{ justifyContent: 'center', alignItems: 'center', margin: 5 }}>
              <View style={{ flexDirection: 'row' }}>
                <Feather name="map-pin" size={24} color="grey" />
                <Text style={{ fontSize: 16, color: 'grey', fontWeight: 'bold' }}>{values.districtName}</Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <AntDesign name="team" size={24} color="grey" />
                <Text style={{ fontSize: 16, color: 'grey' }}>{values.guildName ? values.guildName : "No guild"}</Text>
              </View>
            </View>

            <Divider style={{ margin: 10 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TextInput
                style={styles.messageInput}
                placeholder="He/She does not input any message."
                value={values.userIntro}
                multiline={true}
                editable={false}
              />
            </View>

            {isFriend && (
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  Linking.openURL(`https://wa.me/852${values.phoneNumber}?text=Hello, nice to meet you!`)
                }
              >
                <Text style={styles.buttonText}>
                  Chat <FontAwesome name="whatsapp" size={24} color="white" />
                </Text>
              </TouchableOpacity>
            )}

          </Card>

        </View>

      </View>

      <View style={styles.bottomBarContainer}>
        <BottomBar navigation={navigation} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  margincontainer: {
    margin: 10
  },
  cardContainer: {
    height: 'auto',
    marginBottom: 16,
  },
  input: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    margin: 5,
    paddingHorizontal: 4,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 90,
  },
  button: {
    backgroundColor: 'green',
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
    fontSize: 16,
    color: 'grey',
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
    width: '80%',
    borderColor: '#ccc',
    color: 'grey',
    borderWidth: 1.3,
    padding: 5
  },
});