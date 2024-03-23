import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { CurrentUserID } from './CurrentUserID';

import BottomBar from "./BottomBar";

import { AntDesign } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import SelectDropdown from 'react-native-select-dropdown'

export default function MissionCreate({ navigation }) {

  const getFreshModel = () => ({
    userID: undefined,
    missionName: undefined,
    missionDetail: undefined,
    missionDifficulty: undefined,
    missionMode: undefined,
    isFinish: false,
    MaxDailyCount: 3,
    MaxWeeklyCount: 2,
    MaxMonthlyCount: 1,
    MaxOneTimeCount: 4,
    DailyCount: 0,
    WeeklyCount: 0,
    MonthlyCount: 0,
    OneTimeCount: 0,
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
      fetchData();
    }
  }, [values.userID]);

  const fetchData = async () => {
    try {
      const DailyCount = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getMissionNumByMode`, {
        params: {
          userID: values.userID,
          missionMode: "Daily"
        },
      });

      const WeeklyCount = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getMissionNumByMode`, {
        params: {
          userID: values.userID,
          missionMode: "Weekly"
        },
      });

      const MonthlyCount = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getMissionNumByMode`, {
        params: {
          userID: values.userID,
          missionMode: "Monthly"
        },
      });

      const OneTimeCount = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getMissionNumByMode`, {
        params: {
          userID: values.userID,
          missionMode: "One Time"
        },
      });

      const [DailyCountData, WeeklyCountData, MonthlyCountData, OneTimeCountData] = await Promise.all([
        DailyCount,
        WeeklyCount,
        MonthlyCount,
        OneTimeCount,
      ]);

      setValues({
        ...values,
        DailyCount: DailyCountData.data[0]['count(*)'],
        WeeklyCount: WeeklyCountData.data[0]['count(*)'],
        MonthlyCount: MonthlyCountData.data[0]['count(*)'],
        OneTimeCount: OneTimeCountData.data[0]['count(*)'],
      })

    } catch (err) {
      console.log(err);
    }
  };

  const missionDifficultyList = [{ id: 1, difficulty: "Easy" }, { id: 2, difficulty: "Normal" }, { id: 3, difficulty: "Medium" }, { id: 4, difficulty: "Hard" }]
  const missionModeList = [{ id: 1, mode: "Daily" }, { id: 2, mode: "Weekly" }, { id: 3, mode: "Monthly" }, { id: 4, mode: "One Time" }]


  const validate = () => {
    const temp = {};

    if (!values.missionName) {
      temp.missionName = "Mission Name cannot be empty.";
    } else {
      temp.missionName = "";
    }

    if (!values.missionDetail) {
      temp.missionDetail = "Mission Detail cannot be empty.";
    } else if (values.missionDetail.length > 50) {
      temp.missionDetail = "Max 50 characters.";
    } else {
      temp.missionDetail = "";
    }

    if (!values.missionDifficulty) {
      temp.missionDifficulty = "Mission Difficulty should be selected.";
    } else {
      temp.missionDifficulty = "";
    }


    if (!values.missionMode) {
      temp.missionMode = "Mission Mode should be selected.";
    } else {
      switch (values.missionMode) {
        case "Daily":
          temp.missionMode = values.DailyCount >= values.MaxDailyCount ? "Max 3 daily missions can be created." : "";
          break;
        case "Weekly":
          temp.missionMode = values.WeeklyCount >= values.MaxWeeklyCount ? "Max 2 weekly missions can be created." : "";
          break;
        case "Monthly":
          temp.missionMode = values.MonthlyCount >= values.MaxMonthlyCount ? "Max 1 monthly mission can be created." : "";
          break;
        case "One Time":
          temp.missionMode = values.OneTimeCount >= values.MaxOneTimeCount ? "Max 4 OneTime missions can be created." : "";
          break;
        default:
          temp.missionMode = "";
          break;
      }
    }

    setErrors(temp);

    return Object.values(temp).every((x) => x === "");
  };

  const handleCreateButton = () => {
    if (validate()) {
      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/createMission`, values)
        .then((res) => {
          if (res.data === 'added') {
            navigation.navigate('Mission');
          } else {
            alert('Failed to create the Mission.');
          }
        })
        .catch((err) => console.log(err));
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>

      <Text style={styles.heading}>Create Mission</Text>

      <View style={styles.margincontainer}>

        <ScrollView style={{ marginBottom: 100 }}>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Mission Name</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input]}
            placeholder="Mission Name"
            value={values.missionName}
            onChangeText={(text) => handleInputChange('missionName', text)}
          />
          {error.missionName && <Text style={styles.errorText}>{error.missionName}</Text>}


          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Mission Detail</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input]}
            placeholder="Mission Detail"
            value={values.missionDetail}
            onChangeText={(text) => handleInputChange('missionDetail', text)}
            multiline={true}
            keyboardType="ascii-capable"
            height={70}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ color: 'grey', fontSize: 10 }}>
              {values.missionDetail ? values.missionDetail.length : 0} / 50
            </Text>
          </View>
          {error.missionDetail && <Text style={styles.errorText}>{error.missionDetail}</Text>}


          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Mission Difficulty</Text>
          </TouchableOpacity>
          {
            missionDifficultyList.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  setValues({
                    ...values,
                    missionDifficulty: item.difficulty,
                  })
                }
              >
                <View style={values.missionDifficulty === item.difficulty ? styles.cardContainerSelected : styles.cardContainer}>

                  <Text style={styles.textInfo}>{item.difficulty}</Text>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {item.difficulty === 'Easy' && (
                      <AntDesign name="star" size={24} color="grey" />
                    )}
                    {item.difficulty === 'Normal' && (
                      <>
                        <AntDesign name="star" size={24} color="grey" />
                        <AntDesign name="star" size={24} color="grey" />
                      </>
                    )}
                    {item.difficulty === 'Medium' && (
                      <>
                        <AntDesign name="star" size={24} color="grey" />
                        <AntDesign name="star" size={24} color="grey" />
                        <AntDesign name="star" size={24} color="grey" />
                      </>
                    )}
                    {item.difficulty === 'Hard' && (
                      <>
                        <AntDesign name="star" size={24} color="grey" />
                        <AntDesign name="star" size={24} color="grey" />
                        <AntDesign name="star" size={24} color="grey" />
                        <AntDesign name="star" size={24} color="grey" />
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          }

          {error.missionDifficulty && <Text style={styles.errorText}>{error.missionDifficulty}</Text>}


          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Mission Mode</Text>
          </TouchableOpacity>
          <SelectDropdown
            data={missionModeList}
            onSelect={(item) => setValues({
              ...values,
              missionMode: item.mode,
            })}
            buttonTextAfterSelection={(selectedItem) => selectedItem.mode}
            rowTextForSelection={(item) => item.mode}

            buttonStyle={{ width: '80%', height: 40, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1.3, borderColor: 'grey', width: '100%' }}
            buttonTextStyle={{ color: 'grey', textAlign: 'left' }}
            rowStyle={{ backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' }}
            rowTextStyle={{ color: 'grey', textAlign: 'left' }}

            defaultButtonText={'Select mission mode'}

            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'grey'} size={18} />;
            }}
          />
          {error.missionMode && <Text style={styles.errorText}>{error.missionMode}</Text>}

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ color: 'grey', fontSize: 10 }}>
              | | Daily: {values.DailyCount} / {values.MaxDailyCount} | |
              Weekly: {values.WeeklyCount} / {values.MaxWeeklyCount}  | |
              Monthly: {values.MonthlyCount} / {values.MaxMonthlyCount}  | |
              One Time: {values.OneTimeCount} / {values.MaxOneTimeCount}  | |
            </Text>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleCreateButton}>
            <Text style={styles.submitButtonText}>Create</Text>
          </TouchableOpacity>

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
    marginBottom: 30
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1.2,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#91AC9A',
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
  cardContainer: {
    backgroundColor: '#F9F6F2',
    borderRadius: 30,
    padding: 10,
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 2,
  },
  cardContainerSelected: {
    backgroundColor: '#B5CDC2',
    borderRadius: 30,
    padding: 10,
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 2,
  },
  textInfo: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
    color: 'grey',
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 100
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 10,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});