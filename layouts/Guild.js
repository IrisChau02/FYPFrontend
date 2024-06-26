import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';

import BottomBar from "./BottomBar";
import GuildCard from "../components/GuildCard";
import { CurrentUserID } from './CurrentUserID';

export default function Guild({ navigation }) {

  const getFreshModel = () => ({
    userID: undefined,
    districtID: undefined,
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
            //alert('No existing record');
          } else {
            setValues({
              ...values,
              userID: res.data[0].userID,
              districtID: res.data[0].districtID,
            })
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.userID]);

  const [guildList, setGuildList] = useState([]);

  useEffect(() => {
    if (values.districtID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getGuildByDistrict`, {
          params: {
            districtID: values.districtID,
          },
        })
        .then((res) => {
          setGuildList(res.data)
        })
        .catch((err) => console.log(err));
    }
  }, [values.districtID]);


  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Guild</Text>
      
      <FlatList
        data={[{ key: 'guildPage' }]}
        renderItem={() => (
         
          <SafeAreaView>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GuildCreate', { props: values })}>
              <Text style={styles.buttonText}>Create your own guild!</Text>
            </TouchableOpacity>

            <FlatList
              data={guildList}
              renderItem={({ item }) => <GuildCard guild={item} navigation={navigation} />}
              keyExtractor={(item, index) => index.toString()}
              style={styles.cardList}
            />

          </SafeAreaView>
        )}
        keyExtractor={(item) => item.key}
        style={styles.margincontainer}
      />

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
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});