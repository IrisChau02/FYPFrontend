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

import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MemberList() {

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

  const fetchData = async () => {
    try {
      const workingModeResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getWorkingMode`);
      const sportsResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getSports`);

      const [workingModeData, sportsData] = await Promise.all([
        workingModeResponse,
        sportsResponse,
      ]);

      setWorkingModeList(workingModeData.data);
      setSportsList(sportsData.data);
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
  }, [values.userID]);

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
          alert("added")
        } else {
          alert("fail to add")
        }
      })
      .catch((err) => console.log(err));
  }

  const [selectedWorkMode, setSelectedWorkMode] = useState();
  const [selectedSports, setSelectedSports] = useState();

  const handleFilterMember = () => {
    let filteredMembers = memberList;

    if (selectedWorkMode !== undefined && selectedWorkMode !== null) {
      filteredMembers = filteredMembers.filter(member => parseInt(member.workModeID) === selectedWorkMode);
    }
    
    if (selectedSports !== undefined && selectedSports !== null) {
      filteredMembers = filteredMembers.filter(member => member.sportsID.split(",").map(Number).includes(selectedSports));
    }

    setFilterMemberList(filteredMembers)
  };

  const handleCancelFilterMember = () => {
    setFilterMemberList(memberList)
  };

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <ScrollView style={styles.margincontainer}>
        <Text style={styles.heading}>Member List Page</Text>

        <View style={{ marginBottom: 10 }}>
          <SelectDropdown
            data={workingModeList}
            onSelect={(item) => setSelectedWorkMode(item.workModeID)}
            buttonTextAfterSelection={(selectedItem) => selectedItem.workModeName}
            rowTextForSelection={(item) => item.workModeName}

            buttonStyle={{ width: '80%', height: 50, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#444', width: '100%' }}
            buttonTextStyle={{ color: '#444', textAlign: 'left' }}
            rowStyle={{ backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' }}
            rowTextStyle={{ color: '#444', textAlign: 'left' }}

            defaultButtonText={'Select working mode'}

            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
            }}
          />
        </View>

        <View style={{ marginBottom: 10 }}>
          <SelectDropdown

            data={sportsList}
            onSelect={(item) => setSelectedSports(item.sportsID)}
            buttonTextAfterSelection={(selectedItem) => selectedItem.sportsName}
            rowTextForSelection={(item) => item.sportsName}

            buttonStyle={{ width: '80%', height: 50, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#444', width: '100%' }}
            buttonTextStyle={{ color: '#444', textAlign: 'left' }}
            rowStyle={{ backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' }}
            rowTextStyle={{ color: '#444', textAlign: 'left' }}

            defaultButtonText={'Select sports'}

            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={handleFilterMember} style={[styles.button, { backgroundColor: 'green' }]}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCancelFilterMember} style={[styles.button, { backgroundColor: 'gray' }]}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        </View>
       

        <Divider style={{ borderWidth: 2, borderColor: 'gray', marginBottom: 10 }} />

        {
          filterMemberList.map(member => {
            const workModeName = workingModeList.find(item => item.workModeID === member.workModeID).workModeName;

            const sportsID = member.sportsID;
            const sportsIDArray = sportsID.split(",").map(Number);

            const sportsNameArray = sportsList
              .filter((item) => sportsIDArray.includes(item.sportsID))
              .map((item) => item.sportsName);

            return (
              <Card style={styles.card} key={member.userID}>

                <View style={styles.row}>
                  <View style={styles.column}>
                    <Image source={member.userLogo ? { uri: `data:image/jpeg;base64,${member.userLogo}` } : defaultLogoImage} style={styles.logo} />

                  </View>
                  <View style={styles.column}>

                    <TextInput
                      style={styles.input}
                      value={member.loginName}
                    />
                    <TextInput
                      style={styles.input}
                      value={member.gender}
                    />

                    <TextInput
                      style={styles.input}
                      value={member.birthday}
                    />

                  </View>
                </View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <AntDesign name="message1" size={24} color="grey" />
                  <TextInput
                    style={styles.messageInput}
                    value={member.userIntro ?? "There is no message."}
                    multiline={true}
                  />

                </View>

                <Text style={styles.label} >Working Mode</Text>

                <View style={[styles.button, { backgroundColor: '#728C69' }]}>
                  <Text style={styles.buttonText}>{workModeName}</Text>
                </View>

                <Text style={styles.label} >Favourite Sports</Text>

                {sportsNameArray.map((item, index) => (
                  <View key={index} style={[styles.button, { backgroundColor: '#728C69' }]}>
                    <Text style={styles.buttonText}>{item}</Text>
                  </View>
                ))}


                {values.userID !== member.userID && !userFriendList.some((friend) => friend.acceptUserID === member.userID)
                  && (
                    <TouchableOpacity onPress={() => handleAddFriend(member.userID)} style={[styles.button, { backgroundColor: 'green' }]}>
                      <Text style={styles.buttonText}>Add Friend</Text>
                    </TouchableOpacity>
                  )
                }

                {values.userID !== member.userID && userFriendList.some((friend) => friend.acceptUserID === member.userID && friend.isAccept === "0")
                  && (
                    <TouchableOpacity style={[styles.button, { backgroundColor: 'gray' }]}>
                      <Text style={styles.buttonText}>Requested</Text>
                    </TouchableOpacity>
                  )}

                {values.userID !== member.userID && userFriendList.some((friend) => friend.acceptUserID === member.userID && friend.isAccept === "1")
                  && (
                    <TouchableOpacity style={[styles.button, { backgroundColor: 'gray' }]}>
                      <Text style={styles.buttonText}>Friend</Text>
                    </TouchableOpacity>
                  )}

              </Card>
            );
          })

        }

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  margincontainer: {
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
  card: {
    height: 'auto',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 10
  },
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flex: 1
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
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
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