import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, Linking } from 'react-native';
import axios from 'axios';
import BottomBar from "./BottomBar";
import { Divider } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { CurrentUserID } from './CurrentUserID';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

export default function GuildDetail({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    guildLogo: undefined,
    guildName: undefined,
    masterUserID: undefined,
    masterName: undefined,
    guildIntro: undefined,
    districtID: undefined,
    level: undefined,
    maxMemberLimit: undefined,
    memberNo: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  useEffect(() => {
    setValues({
      ...values,
      userID: CurrentUserID
    })
  }, [CurrentUserID]);

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
    }
  }, [values.userID]);


  useEffect(() => {
    if (values.guildName) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getGuildDetailByName`, {
          params: {
            guildName: values.guildName,
          },
        })
        .then((res) => {
          if (res.data === 'failed') {
          } else {
            setValues({
              ...values,
              guildLogo: res.data[0].guildLogo,
              guildIntro: res.data[0].guildIntro,
              masterUserID: res.data[0].masterUserID,
              districtID: res.data[0].districtID,
              level: res.data[0].level,
              maxMemberLimit: res.data[0].maxMemberLimit,
              memberNo: res.data[0].memberNo,
            })
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.guildName]);

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

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Guild</Text>
      <View style={styles.margincontainer}>

        <View style={styles.cardContainer}>
          <View style={styles.row}>
            <Image source={{ uri: `data:image/jpeg;base64,${values.guildLogo}` }} style={styles.logo} />
            <View style={styles.column}>

              {/* only master can edit the guild info */}
              {values.userID === values.masterUserID && (
                <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => { }}>
                  <Text><AntDesign name="edit" size={22} color="grey" /></Text>
                </TouchableOpacity>
              )}

              <Text style={styles.guildName}>Name: {values.guildName}</Text>


              <Text style={{ fontSize: 16, color: 'grey' }}>
                <EvilIcons name="user" size={22} color="grey" />
                {values.masterName}
              </Text>

              <Text style={styles.guildDetails}>
                Lv {values.level} | Member {values.memberNo}/{values.maxMemberLimit} |
              </Text>

            </View>
          </View>

          <Divider style={{ margin: 5 }} />

          <View style={styles.InfoBox} >
            <Text style={styles.guildInfo}>{values.guildIntro}</Text>
          </View>

          {/*
          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://chat.whatsapp.com/BbKplYG4XqHGGvsjzJx895')}>
            <Text style={styles.buttonText}>Join WhatsApp Group <FontAwesome name="whatsapp" size={24} color="white" /> </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://wa.me/85265022979?text=Hello, nice to meet you!')}>
            <Text style={styles.buttonText}>Chat With Master <FontAwesome name="whatsapp" size={24} color="white" /> </Text>
          </TouchableOpacity>
          */}

        </View>

        <TouchableOpacity style={styles.greybutton} onPress={() => navigation.navigate('Event', { guildName: values.guildName })}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="event-note" size={24} color="white" />
            <Text style={styles.iconText}>Event </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.greybutton} onPress={() => navigation.navigate('MemberList')}>
          <View style={styles.iconContainer}>
            <AntDesign name="team" size={24} color="white" />
            <Text style={styles.iconText}>Member List </Text>
          </View>
        </TouchableOpacity>


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
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  greybutton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    margin: 10,
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 85,
    height: 85,
    marginBottom: 8,
    borderRadius: 90,
  },
  column: {
    flex: 1,
    marginLeft: 16,
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
  guildDetails: {
    fontSize: 14,
    color: 'gray',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#F5F5DC',
    fontWeight: 'bold',
    marginLeft: 5, // Add some spacing between the icon and text
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});