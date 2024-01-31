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


  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    if (values.userID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getFriendListWithDetail`, {
          params: {
            userID: values.userID,
          },
        })
        .then((res) => {
          if (res.data.length !== 0) {
            setFriendList(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.userID]);



  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <ScrollView style={styles.margincontainer}>
        <Text style={styles.heading}>Friend List Page</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('WaitingFriendList')}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.buttonText}>Requested</Text>
            </View>
            {waitingFriendList.length !== 0 && (
              <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 30, marginTop: 1, marginBottom: 1, borderWidth: 2, borderColor: 'white' }}>
                <MaterialCommunityIcons name="alarm-plus" size={24} color="#FFF" />
              </View>
            )}
          </View>
        </TouchableOpacity>


        {
          friendList.map(member => {
        
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