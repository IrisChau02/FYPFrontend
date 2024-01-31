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

  const missionDifficultyList = [{ id: 1, difficulty: "Easy" }, { id: 2, difficulty: "Normal" }, { id: 3, difficulty: "Medium" }, { id: 4, difficulty: "Hard" }]
  const missionModeList = [{ id: 1, mode: "Daily" }, { id: 2, mode: "Weekly" }, { id: 3, mode: "Monthly" }, { id: 4, mode: "One Time" }]

  const handleCreateButton = () => {
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
  };


  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <View style={styles.margincontainer}>
        <Text style={styles.heading}>Mission Create Page</Text>

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
          />

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

            buttonStyle={{ width: '80%', height: 50, backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#444', width: '100%' }}
            buttonTextStyle={{ color: '#444', textAlign: 'left' }}
            rowStyle={{ backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' }}
            rowTextStyle={{ color: '#444', textAlign: 'left' }}

            defaultButtonText={'Select mission mode'}

            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
            }}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleCreateButton}>
            <Text style={styles.submitButtonText}>Create</Text>
          </TouchableOpacity>



        </ScrollView>

      </View>
      <BottomBar navigation={navigation} />
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray', // Set the background color
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
  cardContainer: {
    backgroundColor: '#F9F6F2', // Rice color
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    borderColor: 'gray', // Gray border color
    borderWidth: 4, // Border width
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContainerSelected: {
    backgroundColor: '#D4D4D4', // Rice color
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    borderColor: 'gray', // Gray border color
    borderWidth: 4, // Border width
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  textInfo: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
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
});