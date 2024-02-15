import { useEffect, useRef } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';
import Dialog, { SlideAnimation, DialogContent, DialogButton, DialogTitle, DialogFooter } from 'react-native-popup-dialog';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Divider } from 'react-native-paper';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
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

  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setForceUpdate(true);
      fetchUserData();
    });

    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    if (forceUpdate) {
      console.log('Home component has been rerendered');
      setIsShow(false); //set the dialog as close
      setForceUpdate(false); // Reset forceUpdate to false after the rerender
    }
  }, [forceUpdate]);

  const PlaceholderImage = require('../assets/background.png');
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
  }, [forceUpdate]);

  useEffect(() => {
    fetchUserData();
  }, [values, districtList, workingModeList, sportsList]); //values.loginName, values.password, values.userLogo


  const fetchUserData = async () => {
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
  };


  const [isShow, setIsShow] = useState(false);

  const hideModal = () => {
    setIsShow(false);
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

          {/*
          <TouchableOpacity onPress={() => setIsShow(true)}>
            <AntDesign name="setting" size={25} color="grey" style={{ alignSelf: 'flex-end', padding: 2, marginBottom: 2 }} />
          </TouchableOpacity>
          */}


          <Modal
            animationType="slide"
            transparent={true}
            visible={isShow}
          >
            <Pressable
              onPress={hideModal}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <View
                style={{
                  width: '100%',
                  height: 400,
                  backgroundColor: 'white',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfileLogoUpdate', { props: values })}
                  style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                >
                  <AntDesign name="camera" size={24} color="grey" />
                  <Text style={styles.label}> Change Icon</Text>
                </TouchableOpacity>

                <Divider style={{ margin: 10 }} />

                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfileDetail', { props: values })}
                  style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                >
                  <AntDesign name="form" size={24} color="grey" />
                  <Text style={styles.label}> Edit Profile</Text>
                </TouchableOpacity>

                <Divider style={{ margin: 10 }} />

                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfileSportsUpdate', { props: values })}
                  style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                >
                  <AntDesign name="heart" size={24} color="grey" />
                  <Text style={styles.label}> Change Favourite Sports</Text>
                </TouchableOpacity>

                <Divider style={{ margin: 10 }} />

                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfileWMUpdate', { props: values })}
                  style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                >
                  <AntDesign name="idcard" size={24} color="grey" />
                  <Text style={styles.label}> Change Working Mode</Text>
                </TouchableOpacity>

                <Divider style={{ margin: 10 }} />

              </View>
            </Pressable>
          </Modal>


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

              <TouchableOpacity onPress={() => setIsShow(true)} style={{ position: 'absolute', top: 0, right: 0 }}>
                <AntDesign name="setting" size={25} color="grey" />
              </TouchableOpacity>
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
                  }}
                >
                  {values.gender === 'F' ? (
                    <Ionicons name="female" size={24} color="white" />
                  ) : (
                    <Ionicons name="male" size={24} color="white" />
                  )}
                </View>
              )}
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
              <TextInput
                style={styles.messageInput}
                placeholder="You do not input any message."
                value={values.userIntro}
                multiline={true}
                editable={false}
              />
            </View>

          </Card>

          <Card style={{
            height: 'auto',
            padding: 5,
            marginTop: 10,
            backgroundColor: '#F1F1F1',
            justifyContent: 'center',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <AntDesign name="idcard" size={24} color="grey" />
              <Text style={{ fontSize: 16, color: 'grey', margin: 5 }}>{values.workModeName}</Text>
            </View>
          </Card>

        </View>

      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            padding: 10,
            backgroundColor: '#F1F1F1',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            flex: 1,
          }}
        >

          <TouchableOpacity
            onPress={() => navigation.navigate('FriendList')}
            style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
          >
            <AntDesign name="team" size={24} color="grey" />
            <Text style={styles.label}> Friend List </Text>

            {waitingFriendList.length !== 0 && (
              <View style={{ backgroundColor: '#B9020A', padding: 5, borderRadius: 30 }}>
                <MaterialCommunityIcons name="alarm-plus" size={24} color="#FFF" />
              </View>
            )}

            <View style={{ marginLeft: 'auto' }}>
              <AntDesign name="right" size={24} color="grey" />
            </View>
          </TouchableOpacity>

          <Divider style={{ margin: 10 }} />


        </View>
      </ScrollView>

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