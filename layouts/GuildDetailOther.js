import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, Linking, ScrollView } from 'react-native';
import axios from 'axios';
import BottomBar from "./BottomBar";
import { Divider } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { CurrentUserID } from './CurrentUserID';
import { Feather } from '@expo/vector-icons';

import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import { Card, Title, Paragraph } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function GuildDetailOther({ navigation, route }) {

  const getFreshModel = () => ({
    guildLogo: undefined,
    guildName: undefined,
    masterUserID: undefined,
    masterName: undefined,
    guildIntro: undefined,
    districtID: undefined,
    districtName: undefined,
    level: undefined,
    maxMemberLimit: undefined,
    memberNo: undefined,
    totalCheckPoint: undefined,
    nextLevelCheckPoint: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const defaultLogoImage = require('../assets/defaultUserLogo.png');

  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setForceUpdate((prevValue) => !prevValue);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {

  }, [forceUpdate]);


  useEffect(() => {
    if (route && route.params) {
      const { guildLogo, guildName, masterUserID, guildIntro, districtID, districtName, level, maxMemberLimit, memberNo, totalCheckPoint } = route.params.guild;

      let nextLevelCheckPoint = 0;

      switch (parseInt(level)) {
        case 1:
          nextLevelCheckPoint = 7000;
          break;
        case 2:
          nextLevelCheckPoint = 21000;
          break;
        case 3:
          nextLevelCheckPoint = 42000;
          break;
        default:
          nextLevelCheckPoint = 70000;
          break;
      }

      setValues({
        ...values,
        guildLogo: guildLogo,
        guildName: guildName,
        masterUserID: masterUserID,
        guildIntro: guildIntro,
        districtID: districtID,
        districtName: districtName,
        level: level,
        maxMemberLimit: maxMemberLimit,
        memberNo: memberNo,
        totalCheckPoint: totalCheckPoint,
        nextLevelCheckPoint: nextLevelCheckPoint,
      })
    }
  }, [route]);

  //get master name
  useEffect(() => {
    if (values.masterUserID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserDataByID`, {
          params: {
            userID: values.masterUserID,
          },
        })
        .then((res) => {
          setValues({
            ...values,
            masterName: res.data[0].loginName,
          })
        })
        .catch((err) => console.log(err));
    }
  }, [values.masterUserID]);

  const [memberList, setMemberList] = useState([]);
  const [filterMemberList, setFilterMemberList] = useState([]);

  useEffect(() => {
    if (values.guildName) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getGuildMemberList`, {
          params: {
            guildName: values.guildName,
          },
        })
        .then((res) => {
          setMemberList(res.data)
          setFilterMemberList(res.data)
        })
        .catch((err) => console.log(err));
    }
  }, [values.guildName]);

  const [workingModeList, setWorkingModeList] = useState([]);
  const [sportsList, setSportsList] = useState([]);
  const [timeslotList, setTimeslotList] = useState([]);
  const [genderList, setGenderList] = useState([
    { id: 1, gender: 'M' },
    { id: 2, gender: 'F' }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const workingModeResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getWorkingMode`);
      const sportsResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getSports`);
      const timeslotResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getTimeslot`);

      const [workingModeData, sportsData, timeslotData] = await Promise.all([
        workingModeResponse,
        sportsResponse,
        timeslotResponse
      ]);

      setWorkingModeList(workingModeData.data);
      setSportsList(sportsData.data);
      setTimeslotList(timeslotData.data);
    } catch (err) {
      console.log(err);
    }
  };

  const [userFriendList, setUserFriendList] = useState([]);

  useEffect(() => {
    if (CurrentUserID) {
      fetch_User_Friend_Data()
    }
  }, [CurrentUserID]);

  const fetch_User_Friend_Data = () => {
    axios
      .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserFriendList`, {
        params: {
          userID: CurrentUserID,
        },
      })
      .then((res) => {
        setUserFriendList(res.data)
      })
      .catch((err) => console.log(err));
  }

  const handleAddFriend = (acceptUserID) => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/addFriend`, {
        requestUserID: CurrentUserID,
        acceptUserID: acceptUserID
      })
      .then((res) => {
        if (res.data == "added") {
          fetch_User_Friend_Data()
        } else {
          alert("fail to add")
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Guild</Text>
      <View style={styles.margincontainer}>

        <View style={styles.cardContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: `data:image/jpeg;base64,${values.guildLogo}` }} style={styles.logo} />
            <View style={{ flex: 1, marginLeft: 16 }}>

              <Text style={styles.guildName}>{values.guildName}</Text>

              <Text style={{ fontSize: 16, color: 'grey' }}>
                <EvilIcons name="user" size={22} color="grey" />
                {values.masterName}
              </Text>

              <Text style={{ fontSize: 14, color: 'gray', paddingVertical: 5 }}>
                Member {values.memberNo}/{values.maxMemberLimit}
              </Text>


              <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                <Text style={{ fontSize: 16, color: 'grey' }}>
                  Lv {values.level}
                </Text>

                <MaterialIcons name="monetization-on" size={20} style={{ marginLeft: 20 }} color="#FFC000" />
                <Text style={{ fontSize: 16, color: 'grey' }}>{values.totalCheckPoint}</Text>

              </View>

              <ProgressBar
                progress={
                  values.totalCheckPoint && values.nextLevelCheckPoint ?
                    Number((values.totalCheckPoint / values.nextLevelCheckPoint).toFixed(4)) :
                    0
                }
                color="#FFC107" />

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Text style={{ color: 'grey', fontSize: 10 }}>
                  {values.nextLevelCheckPoint ? values.nextLevelCheckPoint : 0}
                </Text>
              </View>

            </View>
          </View>

          <Divider style={{ margin: 5 }} />

          <View style={styles.InfoBox} >
            <Text style={styles.guildInfo}>{values.guildIntro}</Text>
          </View>

        </View>

        <View style={{ flexGrow: 1 }}>
          <ScrollView
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginBottom: 50,
              backgroundColor: '#B5CDC2',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              flex: 1,
            }}
          >

            {
              filterMemberList.map(member => {
                const workModeName = workingModeList.find(item => item.workModeID === member.workModeID).workModeName;

                const sportsID = member.sportsID;
                const sportsIDArray = sportsID.split(",").map(Number);

                const sportsNameArray = sportsList
                  .filter((item) => sportsIDArray.includes(item.sportsID))
                  .map((item) => item.sportsName);

                return (
                  <Card style={{
                    height: 'auto',
                    backgroundColor: '#F1F1F1',
                    borderColor: 'grey',
                    borderWidth: 1.5,
                    justifyContent: 'center',
                    padding: 10,
                    marginBottom: 15,
                  }} key={member.userID}>

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

                    {!userFriendList.some((friend) => friend.requestUserID === member.userID || friend.acceptUserID === member.userID)
                      && (
                        <TouchableOpacity onPress={() => handleAddFriend(member.userID)} style={[styles.button, { backgroundColor: 'green' }]}>
                          <Text style={styles.buttonText}>Add Friend</Text>
                        </TouchableOpacity>
                      )
                    }

                    {userFriendList.some((friend) => friend.requestUserID === CurrentUserID && friend.acceptUserID === member.userID && friend.isAccept === "0")
                      && (
                        <TouchableOpacity style={[styles.button, { backgroundColor: 'grey' }]}>
                          <Text style={styles.buttonText}>Requested</Text>
                        </TouchableOpacity>
                      )}

                    {userFriendList.some((friend) => friend.requestUserID === member.userID && friend.acceptUserID === CurrentUserID && friend.isAccept === "0")
                      && (
                        <TouchableOpacity style={[styles.button, { backgroundColor: 'grey' }]}>
                          <Text style={styles.buttonText}>Wait Accept</Text>
                        </TouchableOpacity>
                      )}

                    {userFriendList.some((friend) => (friend.requestUserID === member.userID || friend.acceptUserID === member.userID) && friend.isAccept === "1")
                      && (
                        <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]}>
                          <Text style={styles.buttonText}>Friend</Text>
                        </TouchableOpacity>
                      )}

                  </Card>
                );
              })
            }

          </ScrollView>
        </View>


      </View>

      <View style={styles.bottomBarContainer}>
        <BottomBar navigation={navigation} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  margincontainer: {
    flexGrow: 1,
    paddingTop: 16,
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
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  displaybutton: {
    width: '45%',
    height: 120,
    padding: 10,
    borderRadius: 20,
    borderColor: 'grey',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a9a9a9'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#F9F6F2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderColor: 'grey',
    borderWidth: 1.5,
    marginHorizontal: 16
  },
  logo: {
    width: 85,
    height: 85,
    marginBottom: 8,
    borderRadius: 90,
  },
  guildName: {
    fontSize: 20,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  InfoBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 5,
    padding: 10,
    borderColor: 'grey',
    borderWidth: 1.5,
  },
  guildInfo: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 8,
  },
  input: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    margin: 5,
    paddingHorizontal: 4,
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