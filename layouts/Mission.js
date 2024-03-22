import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

import { Card, Title, Paragraph } from 'react-native-paper';

import BottomBar from "./BottomBar";
import { CurrentUserID } from './CurrentUserID';

import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Mission({ navigation, route }) {

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
      setForceUpdate(true);
      fetchUserData();
      fetchData();
    });

    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    if (forceUpdate) {
      fetchUserData();
      fetchData();
      setForceUpdate(false);
    }
  }, [forceUpdate]);

  useEffect(() => {
    setValues({
      ...values,
      userID: CurrentUserID
    })
  }, [CurrentUserID]);

  const [missionList, setMissionList] = useState([]);

  useEffect(() => {
    if (values.userID) {
      fetchUserData();
      fetchData();
    }
  }, [values.userID]);

  const fetchUserData = () => {
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
              guildName: res.data[0].guildName,
            })
          }
        })
        .catch((err) => console.log(err));
  };


  const fetchData = async () => {
    try {
      const SystemMissionListResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getSystemMissionList`, {
        params: {
          userID: values.userID,
        },
      });

      const SelfDefineMissionListResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getSelfDefineMissionList`, {
        params: {
          userID: values.userID,
        },
      });

      const [SystemMissionData, SelfDefineMissionData] = await Promise.all([
        SystemMissionListResponse,
        SelfDefineMissionListResponse,
      ]);

      const combinedMissionArray = SystemMissionData.data.concat(SelfDefineMissionData.data);

      setMissionList(combinedMissionArray)

    } catch (err) {
      console.log(err);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Mission</Text>
      <View style={styles.margincontainer}>

        <ScrollView style={{ marginBottom: 100 }}>

          {/* Only join the guild can see the guild mission card */}
          {!values.guildName && (
            <>
              <View style={{ marginTop: 100, justifyContent: 'center', alignItems: 'center', }}>
                <AntDesign name="warning" size={40} color="grey" />
                <Text style={{ marginTop: 20, fontSize: 20, color: 'grey', textAlign: 'center' }}> * Join a guild *</Text>
                <Text style={{ marginTop: 20, fontSize: 15, color: 'grey', textAlign: 'center' }}> * To unlock guild mission function *</Text>

              </View>
            </>
          )}
          {/* Only join the guild can see the guild mission card */}

          {values.guildName && (
            <>
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

                          {mission.missionMode === 'Daily' && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <MaterialIcons name="local-fire-department" size={24} color="#FFF" style={{ marginLeft: 10 }} />
                              <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>{mission.missionKeepTime} day</Text>
                            </View>
                          )}

                          {mission.missionMode === 'Weekly' && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <MaterialIcons name="local-fire-department" size={24} color="#FFF" style={{ marginLeft: 10 }} />
                              <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>{mission.missionKeepTime} week</Text>
                            </View>
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

                      {!mission.isFinish ? (
                        <TouchableOpacity
                          onPress={() => navigation.navigate('MissionFinish', { mission: mission })}
                          style={{
                            backgroundColor: '#91AC9A',
                            padding: 8,
                            borderRadius: 30,
                            margin: 10
                          }}
                        >
                          <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>Finish</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'grey',
                            padding: 8,
                            borderRadius: 30,
                            margin: 10,
                            flex: 1,
                            alignItems: 'center'
                          }}
                        >
                          <AntDesign name="checkcircle" size={24} color="#fff" />
                        </TouchableOpacity>
                      )}


                    </Card>
                  );
                })
              }
            </>
          )}

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