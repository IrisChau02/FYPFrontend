import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

import BottomBar from "./BottomBar";
import { CurrentUserID } from './CurrentUserID';

import { Card, Title, Paragraph } from 'react-native-paper';
import { Divider } from 'react-native-paper';

import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function FriendList({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
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

  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setForceUpdate(true);
      fetchData();
    });

    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    if (forceUpdate) {
      fetchData();
      setForceUpdate(false); // Reset forceUpdate to false after the rerender
    }
  }, [forceUpdate]);

  useEffect(() => {
    setValues({
      ...values,
      userID: CurrentUserID
    })
  }, [CurrentUserID]);

  const [waitingFriendList, setWaitingFriendList] = useState([]);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    if (values.userID) {
      fetchData()
    }
  }, [values.userID]);

  const fetchData = async () => {
    try {
      const WaitingFriendListResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getWaitingFriendList`, {
        params: {
          userID: values.userID,
        },
      });
      const FriendListResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getFriendListWithDetail`, {
        params: {
          userID: values.userID,
        },
      });

      const FriendRequestListResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getRequestFriendListWithDetail`, {
        params: {
          userID: values.userID,
        },
      });

      const [WaitingFriendListData, FriendListData, FriendRequestListData] = await Promise.all([
        WaitingFriendListResponse,
        FriendListResponse,
        FriendRequestListResponse,
      ]);

      const combinedFriendArray = FriendListData.data.concat(FriendRequestListData.data);

      setWaitingFriendList(WaitingFriendListData.data);
      setFriendList(combinedFriendArray);
    } catch (err) {
      console.log(err);
    }
  };

  const [sportsList, setSportsList] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getSports`)
      .then((res) => {
        if (res.data) {
          setSportsList(res.data)
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>

      <Text style={styles.heading}>Friend List Page</Text>

      <ScrollView style={styles.margincontainer}>
        <View style={{ marginBottom: 70 }}>
          <TouchableOpacity style={{
            backgroundColor: '#F9F6F2',
            borderRadius: 30,
            padding: 10,
            marginBottom: 16,
            borderColor: 'gray',
            borderWidth: 2,
          }} onPress={() => navigation.navigate('WaitingFriendList')}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, marginBottom: 4, textAlign: 'center', color: 'grey', }}>Waiting List</Text>
              </View>

              {waitingFriendList.length !== 0 && (
                <View style={{ backgroundColor: '#B9020A', padding: 5, borderRadius: 30 }}>
                  <MaterialCommunityIcons name="alarm-plus" size={24} color="#FFF" />
                </View>
              )}
            </View>
          </TouchableOpacity>


          {
            friendList.map(member => {
              const sportsID = member.sportsID;
              const sportsIDArray = sportsID.split(",").map(Number);

              const sportsNameArray = sportsList
                .filter((item) => sportsIDArray.includes(item.sportsID))
                .map((item) => item.sportsName);

              return (
                <Card style={styles.card} key={member.userID}>

                  <View style={{ flexDirection: 'row' }}>

                    {/* left */}
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity onPress={() => navigation.navigate('HomeOther', { userID: member.userID })}>
                        <Image source={member.userLogo ? { uri: `data:image/jpeg;base64,${member.userLogo}` } : defaultLogoImage} style={styles.logo} />
                      </TouchableOpacity>
                    </View>

                    {/* right */}
                    <View style={{ flex: 1.5 }}>
                      <View style={{ flexDirection: 'row' }}>

                        <TextInput
                          style={styles.input}
                          value={member.loginName}
                        />

                        {member.gender !== 'NA' && (
                          <View
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 90,
                              backgroundColor: member.gender === 'F' ? 'pink' : '#1E90FF',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 10
                            }}
                          >
                            {member.gender === 'F' ? (
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
                            backgroundColor: member.timeslotID === 1 ? 'orange' : member.timeslotID === 2 ? '#EED202' : member.timeslotID === 3 ? '#FFAE42' : '#30106B',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {member.timeslotID === 1 ? (
                            <Feather name="sunrise" size={24} color="white" />
                          ) : null}

                          {member.timeslotID === 2 ? (
                            <Feather name="sun" size={24} color="white" />
                          ) : null}

                          {member.timeslotID === 3 ? (
                            <Feather name="sunset" size={24} color="white" />
                          ) : null}

                          {member.timeslotID === 4 ? (
                            <Feather name="moon" size={24} color="white" />
                          ) : null}
                        </View>

                      </View>

                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                        {sportsNameArray.map((item, index) => (
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

                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput
                      style={styles.messageInput}
                      value={member.userIntro ?? "There is no message."}
                      multiline={true}
                      editable={false}
                    />
                  </View>

                </Card>
              );
            })
          }
        </View>
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
  card: {
    height: 'auto',
    backgroundColor: '#F1F1F1',
    borderColor: 'grey',
    borderWidth: 1.5,
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
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
  messageInput: {
    flex: 1,
    height: 'auto',
    width: '80%',
    borderColor: '#ccc',
    color: 'grey',
    borderWidth: 1.3,
    padding: 5
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});