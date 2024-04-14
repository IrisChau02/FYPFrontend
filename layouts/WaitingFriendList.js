import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

import BottomBar from "./BottomBar";
import { CurrentUserID } from './CurrentUserID';

import { Card, Title, Paragraph } from 'react-native-paper';
import { Divider } from 'react-native-paper';

import { Feather } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function WaitingFriendList({ navigation, route }) {

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

  useEffect(() => {
    setValues({
      ...values,
      userID: CurrentUserID
    })
  }, [CurrentUserID]);

  const [waitingFriendList, setWaitingFriendList] = useState([]);

  useEffect(() => {
    if (values.userID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getWaitingFriendListWithDetail`, {
          params: {
            userID: values.userID,
          },
        })
        .then((res) => {
          if (res.data.length !== 0) {
            setWaitingFriendList(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.userID]);

  const handleAddFriend = (acceptUserID) => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/confirmAddFriend`, {
        requestUserID: acceptUserID,
        acceptUserID: values.userID //current user
      })
      .then((res) => {
        if (res.data == "updated") {
          alert("updated")
          navigation.navigate('FriendList');
        } else {
          alert("fail to update")
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Waiting Friend List</Text>
      <ScrollView style={styles.margincontainer}>

        {
          waitingFriendList.map(member => {
            //const workModeName = workingModeList.find(item => item.workModeID === member.workModeID).workModeName;

            return (
              <Card style={styles.card} key={member.userID}>
                <View style={{ flexDirection: 'row' }}>

                  {/* left */}
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('HomeOther', { userID: member.userID })}>
                      <Image
                        source={member.userLogo ? { uri: `data:image/jpeg;base64,${member.userLogo}` } : defaultLogoImage}
                        style={styles.logo}
                      />
                    </TouchableOpacity>
                  </View>


                  {/* center */}
                  <View style={{ flex: 2.5 }}>

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
                  </View>

                  {/* right */}
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => handleAddFriend(member.userID)} style={styles.button}>
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>



              </Card>
            );
          })
        }

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
    width: 70,
    height: 70,
    marginBottom: 8,
    borderRadius: 90,
  },
  button: {
    backgroundColor: 'green',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});