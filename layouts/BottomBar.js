import React from 'react';
import { useEffect } from "react";
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { CurrentUserID } from './CurrentUserID';
import axios from 'axios';

export default function BottomBar({ navigation }) {

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

  const navigateToGuild = () => {
    if (values.guildName) {
      navigation.navigate('GuildDetail', { values });
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
          <View style={styles.iconContainer}>
            <AntDesign name="team" size={24} color="#F5F5DC" />
            <Text style={styles.iconText}>Guild</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Mission')} style={styles.button}>
          <View style={styles.iconContainer}>
            <AntDesign name="calendar" size={24} color="#F5F5DC" />
            <Text style={styles.iconText}>Mission</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
          <View style={styles.iconContainer}>
            <AntDesign name="user" size={24} color="#F5F5DC" />
            <Text style={styles.iconText}>Profile</Text>
          </View>
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
    marginLeft: 5, // Add some spacing between the icon and text
  },
});