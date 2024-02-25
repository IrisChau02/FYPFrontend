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


  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Mission</Text>
      <View style={styles.margincontainer}>


        <ScrollView style={{ marginBottom: 100 }}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MissionCreate')}>
            <Text style={styles.buttonText}>Create Mission</Text>
          </TouchableOpacity>

          {
            missionList.map(mission => {
              return (
                <Card style={styles.card} key={mission.missionName}>

                  <View
                    style={{
                      padding: 5,
                      borderRadius: 7,
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:
                        mission.missionDifficulty === 'Easy'
                          ? '#919492'
                          : mission.missionDifficulty === 'Normal'
                            ? '#ACB984'
                            : mission.missionDifficulty === 'Medium'
                              ? '#E7C27D'
                              : mission.missionDifficulty === 'Hard'
                                ? '#F2ACB9'
                                : 'light grey'
                    }}
                  >

                    <View style={{
                      backgroundColor: '#fff',
                      padding: 7,
                      borderRadius: 30,
                      width: '60%',
                      marginTop: 10,
                      marginBottom: 10,

                    }}>
                      <Text style={{ color: 'grey', fontSize: 16, textAlign: 'center' }}>{mission.missionMode}</Text>
                    </View>


                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>{mission.missionDifficulty} </Text>

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

                  <View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>

                    <Text style={{
                      fontSize: 18,
                      color: 'grey',
                      fontWeight: 'bold',
                      marginBottom: 5,
                    }}>{mission.missionName}</Text>

                    <Text style={{
                      fontSize: 12,
                      color: 'grey',
                      marginBottom: 5,
                    }}>{mission.missionDetail}</Text>

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
  margincontainer: { // Corrected style name
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F1F1F1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 30
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
    margin: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    flex: 1, //flexible in height
    backgroundColor: '#F9F6F2',
    borderRadius: 8,
    marginBottom: 16,
    borderColor: 'grey',
    borderWidth: 1.8,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});