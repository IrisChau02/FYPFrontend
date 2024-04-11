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
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MemberList({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
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
    setValues({
      ...values,
      userID: CurrentUserID
    })
  }, [CurrentUserID]);

  const [workingModeList, setWorkingModeList] = useState([]);
  const [sportsList, setSportsList] = useState([]);
  const [timeslotList, setTimeslotList] = useState([]);
  const [genderList, setGenderList] = useState([
    { id: 1, gender: 'M' },
    { id: 2, gender: 'F' }
  ]);

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

  useEffect(() => {
    fetchData();
  }, []);

  const [userFriendList, setUserFriendList] = useState([]);

  useEffect(() => {
    if (values.userID) {
      fetch_User_Friend_Data()
    }
  }, [values.userID]);

  const fetch_User_Friend_Data = () => {
    axios
      .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserDataByID`, {
        params: {
          userID: values.userID,
        },
      })
      .then((res) => {
        if (res.data === 'failed') {
        } else {
          setValues({
            ...values,
            userID: res.data[0].userID,
            guildName: res.data[0].guildName,
          })
        }
      })
      .catch((err) => console.log(err));

    axios
      .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserFriendList`, {
        params: {
          userID: values.userID,
        },
      })
      .then((res) => {
        setUserFriendList(res.data)
      })
      .catch((err) => console.log(err));
  }

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

  const handleAddFriend = (acceptUserID) => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/addFriend`, {
        requestUserID: values.userID,
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


  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [selectedSports, setSelectedSports] = useState(null);


  useEffect(() => {
    let filteredMembers = memberList;

    //filter gender
    if (selectedGender !== undefined && selectedGender !== null) {
      filteredMembers = filteredMembers.filter(member => member.gender === selectedGender);
    }

    //filter timeslot
    if (selectedTimeslot !== undefined && selectedTimeslot !== null) {
      filteredMembers = filteredMembers.filter(member => parseInt(member.timeslotID) === selectedTimeslot);
    }

    //filter sport
    if (selectedSports !== undefined && selectedSports !== null) {
      filteredMembers = filteredMembers.filter(member => member.sportsID.split(",").map(Number).includes(selectedSports));
    }

    setFilterMemberList(filteredMembers)
  }, [selectedSports, selectedGender, selectedTimeslot]);

  const handleCancelFilterMember = () => {
    setSelectedGender(null);
    setSelectedTimeslot(null);
    setSelectedSports(null);
    setFilterMemberList(memberList);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>

      <Text style={styles.heading}>Member List</Text>

      <ScrollView style={styles.margincontainer}>

        <View style={{ marginBottom: 20 }}>

          <View style={{ marginBottom: 10 }}>
            <SelectDropdown
              data={genderList}
              onSelect={(item) => setSelectedGender(item.gender)}
              buttonTextAfterSelection={(selectedItem) => {
                if (selectedGender !== null) {
                  return selectedItem.gender;
                } else {
                  return "Select Gender";
                }
              }}
              rowTextForSelection={(item) => item.gender}

              buttonStyle={{ width: '80%', height: 40, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#444', width: '100%' }}
              buttonTextStyle={{ color: '#444', textAlign: 'left' }}
              rowStyle={{ backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' }}
              rowTextStyle={{ color: '#444', textAlign: 'left' }}

              defaultButtonText={'Select Gender'}

              renderDropdownIcon={isOpened => {
                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
              }}
            />
          </View>


          <View style={{ marginBottom: 10 }}>
            <SelectDropdown
              data={timeslotList}
              onSelect={(item) => setSelectedTimeslot(item.timeslotID)}
              buttonTextAfterSelection={(selectedItem) => {
                if (selectedTimeslot !== null) {
                  return selectedItem.timeslotName;
                } else {
                  return "Select Timeslot";
                }
              }}

              rowTextForSelection={(item) => item.timeslotName}

              buttonStyle={{ width: '80%', height: 40, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#444', width: '100%' }}
              buttonTextStyle={{ color: '#444', textAlign: 'left' }}
              rowStyle={{ backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' }}
              rowTextStyle={{ color: '#444', textAlign: 'left' }}

              defaultButtonText={'Select Timeslot'}

              renderDropdownIcon={isOpened => {
                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
              }}
            />
          </View>


          <View style={{ marginBottom: 10 }}>
            <SelectDropdown
              data={sportsList}
              onSelect={(item) => setSelectedSports(item.sportsID)}
              buttonTextAfterSelection={(selectedItem) => {
                if (selectedSports !== null) {
                  return selectedItem.sportsName;
                } else {
                  return "Select Sports";
                }
              }}
              rowTextForSelection={(item) => item.sportsName}

              buttonStyle={{ width: '80%', height: 40, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#444', width: '100%' }}
              buttonTextStyle={{ color: '#444', textAlign: 'left' }}
              rowStyle={{ backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' }}
              rowTextStyle={{ color: '#444', textAlign: 'left' }}

              defaultButtonText={'Select Sports'}

              renderDropdownIcon={isOpened => {
                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
              }}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={handleCancelFilterMember}
              style={{
                width: 30,
                height: 30,
                borderRadius: 90,
                backgroundColor: 'grey',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8
              }}
            >
              <MaterialIcons name="cancel" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <Divider style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10 }} />

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
                  marginBottom: 10,
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

                  {values.userID !== member.userID && !userFriendList.some((friend) => friend.requestUserID === member.userID || friend.acceptUserID === member.userID)
                    && (
                      <TouchableOpacity onPress={() => handleAddFriend(member.userID)} style={[styles.button, { backgroundColor: 'green' }]}>
                        <Text style={styles.buttonText}>Add Friend</Text>
                      </TouchableOpacity>
                    )
                  }

                  {values.userID !== member.userID && userFriendList.some((friend) => friend.requestUserID === values.userID && friend.acceptUserID === member.userID && friend.isAccept === "0")
                    && (
                      <TouchableOpacity style={[styles.button, { backgroundColor: 'grey' }]}>
                        <Text style={styles.buttonText}>Requested</Text>
                      </TouchableOpacity>
                    )}

                  {values.userID !== member.userID && userFriendList.some((friend) => friend.requestUserID === member.userID && friend.acceptUserID === values.userID && friend.isAccept === "0")
                    && (
                      <TouchableOpacity style={[styles.button, { backgroundColor: 'grey' }]}>
                        <Text style={styles.buttonText}>Wait Accept</Text>
                      </TouchableOpacity>
                    )}

                  {values.userID !== member.userID && userFriendList.some((friend) => (friend.requestUserID === member.userID || friend.acceptUserID === member.userID) && friend.isAccept === "1")
                    && (
                      <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]}>
                        <Text style={styles.buttonText}>Friend</Text>
                      </TouchableOpacity>
                    )}

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
    marginBottom: 50
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
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
  button: {
    padding: 10,
    borderRadius: 5,
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