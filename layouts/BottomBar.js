import React, { useState } from 'react';
import { useEffect } from "react";
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { CurrentUserID } from './CurrentUserID';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function BottomBar({ navigation, route }) {

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

  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData()
      setForceUpdate(true);
    });

    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    if (forceUpdate) {
      fetchData()
      setForceUpdate(false); // Reset forceUpdate to false after the rerender
    }
  }, [forceUpdate]);

  useEffect(() => {
    setValues({
      ...values,
      userID: CurrentUserID
    })
  }, [CurrentUserID]);

  useEffect(() => {
    if (values.userID) {
      fetchData()
    }
  }, [values.userID]);

  const fetchData = () => {
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
  };

  const navigateToGuild = () => {
    if (values.guildName) {
      navigation.navigate('GuildDetail');
    } else {
      navigation.navigate('Guild');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>

      </View>
      <View style={styles.bottomBar}>

        <TouchableOpacity onPress={navigateToGuild} style={styles.button}>
          <AntDesign name="team" size={24} color="#F5F5DC" />
          <Text style={styles.iconText}>Guild</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Event', { guildName: values.guildName })}
          style={styles.button}>
          <MaterialIcons name="event-note" size={24} color="#F5F5DC" />
          <Text style={styles.iconText}>Event</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Mission')} style={styles.button}>
          <AntDesign name="calendar" size={24} color="#F5F5DC" />
          <Text style={styles.iconText}>Mission</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('FriendList')} style={styles.button}>
          <AntDesign name="addusergroup" size={24} color="#F5F5DC" />
          <Text style={styles.iconText}>Friend</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
          <AntDesign name="user" size={24} color="#F5F5DC" />
          <Text style={styles.iconText}>Profile</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#728C69',//F5F5DC
    height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#F5F5DC',
    fontWeight: 'bold',
    fontSize: 12
  },
});