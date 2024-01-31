import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

import { Card, Title, Paragraph } from 'react-native-paper';

import BottomBar from "./BottomBar";
import { CurrentUserID } from './CurrentUserID';

import { AntDesign } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Mission({ navigation }) {

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

  useEffect(() => {
    setValues({
      ...values,
      userID: CurrentUserID
    })
  }, [CurrentUserID]);

  const [missionList, setMissionList] = useState([]);

  useEffect(() => {
    if (values.userID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getMissionList`, {
          params: {
            userID: values.userID,
          },
        })
        .then((res) => {
          setMissionList(res.data)
        })
        .catch((err) => console.log(err));
    }
  }, [values.userID]);

  const PlaceholderImage = require('../assets/loginbackground2.png');

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <View style={styles.margincontainer}>
        <Text style={styles.heading}>Mission Page</Text>

        <ScrollView style={{ marginBottom: 100 }}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MissionCreate')}>
            <Text style={styles.buttonText}>Create Mission</Text>
          </TouchableOpacity>


          {
            missionList.map(mission => {


              return (
                <Card style={styles.card} key={mission.missionName}>

                  <View style={{
                    backgroundColor: 'grey',
                    padding: 10,
                    borderRadius: 5,
                    width: '100%',
                    marginTop: 10,
                    marginBottom: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>

                    <View style={{
                      backgroundColor: '#fff',
                      padding: 10,
                      borderRadius: 5,
                      width: '80%',
                      marginTop: 10,
                      marginBottom: 10,

                    }}>
                      <Text style={{ color: 'grey', fontSize: 16, textAlign: 'center' }}>{mission.missionMode}</Text>
                    </View>

                    <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>{mission.missionDifficulty}</Text>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      {mission.missionDifficulty === 'Easy' && (
                        <AntDesign name="star" size={24} color="#FFF" />
                      )}
                      {mission.missionDifficulty === 'Normal' && (
                        <>
                          <AntDesign name="star" size={24} color="#FFF" />
                          <AntDesign name="star" size={24} color="#FFF" />
                        </>
                      )}
                      {mission.missionDifficulty === 'Medium' && (
                        <>
                          <AntDesign name="star" size={24} color="#FFF" />
                          <AntDesign name="star" size={24} color="#FFF" />
                          <AntDesign name="star" size={24} color="#FFF" />
                        </>
                      )}
                      {mission.missionDifficulty === 'Hard' && (
                        <>
                          <AntDesign name="star" size={24} color="#FFF" />
                          <AntDesign name="star" size={24} color="#FFF" />
                          <AntDesign name="star" size={24} color="#FFF" />
                          <AntDesign name="star" size={24} color="#FFF" />
                        </>
                      )}
                    </View>

                  </View>

                  <View style={{

                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: 18,
                      color: 'grey',
                      fontWeight: 'bold',
                      marginBottom: 8,
                    }}>Name: {mission.missionName}</Text>
                    <Text style={{
                      fontSize: 15,
                      color: 'grey',
                      marginBottom: 8,
                    }}>Detail: {mission.missionDetail}</Text>
                  </View>


                </Card>
              );
            })
          }

        </ScrollView>

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
  margincontainer: { // Corrected style name
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
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    margin: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    height: 'auto',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 10
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});