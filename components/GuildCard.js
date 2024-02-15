import React from 'react';
import { useEffect } from "react";
import useForm from '../hooks/useForm';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import { CurrentUserID } from '../layouts/CurrentUserID';
import axios from 'axios';
import { EvilIcons } from '@expo/vector-icons';

const defaultLogoImage = require('../assets/defaultLogo.png');

const GuildCard = ({ guild, navigation }) => {

  const getFreshModel = () => ({
    userID: undefined,
    masterName: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);


 /* 
 // do with get master name, otherwise, 2 set value have error
  useEffect(() => {
    setValues({
      ...values,
      userID: CurrentUserID
    })
  }, [CurrentUserID]);*/

  //get master name
  useEffect(() => {
    if (guild.masterUserID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserDataByID`, {
          params: {
            userID: guild.masterUserID,
          },
        })
        .then((res) => {
          setValues({
            ...values,
            masterName: res.data[0].loginName,
            userID: CurrentUserID
          })
        })
        .catch((err) => console.log(err));
    }
  }, [guild.masterUserID, CurrentUserID]);

  const handleJoinGuild = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/joinGuild`, {
        userID: values.userID,
        guildName: guild.guildName,
        memberNo: guild.memberNo,
      })
      .then((res) => {
        if (res.data === 'updated') {
          alert('Join successfully');
          navigation.navigate('GuildDetail');
        } else {
          alert('Failed to join');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <Image source={{ uri: `data:image/jpeg;base64,${guild.guildLogo}` }} style={styles.logo} />
        <View style={styles.column}>
          <Text style={styles.guildName}>{guild.guildName}</Text>

          <Text style={{ fontSize: 16, color: 'grey' }}>
            <EvilIcons name="user" size={22} color="grey" />
            {values.masterName}
          </Text>

          <Text style={styles.guildDetails}>
            Lv {guild.level} | Member {guild.memberNo}/{guild.maxMemberLimit} |
          </Text>

        </View>
      </View>

      <Divider style={{ margin: 5 }} />

      <View style={styles.InfoBox} >
        <Text style={styles.guildInfo}>{guild.guildIntro}</Text>
      </View>

      <TouchableOpacity onPress={handleJoinGuild} style={styles.button}>
        <Text style={styles.buttonText}>Join</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1, //flexible in height
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
  button: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GuildCard;