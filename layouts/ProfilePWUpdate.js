import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';

import { AntDesign } from '@expo/vector-icons';
import BottomBar from "./BottomBar";


export default function ProfilePWUpdate({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    firstName: undefined,
    lastName: undefined,
    birthday: undefined,
    formatbirthday: undefined,
    gender: undefined,
    phoneNumber: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
    loginName: undefined,
    userLogo: undefined,
    districtName: undefined,
    workModeName: undefined,
    sportsName: [],
    userLogo: undefined,
    guildName: undefined,
    userIntro: undefined
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  useEffect(() => {
    if (route && route.params) {
      const props = route.params;

      setValues({
        ...values,
        userID: props.props.userID,
        firstName: props.props.firstName,
        lastName: props.props.lastName,
        birthday: new Date(props.props.formatbirthday),
        formatbirthday: props.props.formatbirthday,
        gender: props.props.gender,
        phoneNumber: props.props.phoneNumber.toString(), //from db it is int
        email: props.props.email,
        password: props.props.password,
        loginName: props.props.loginName,
        userLogo: props.props.userLogo,
        districtName: props.props.districtName,
        workModeName: props.props.workModeName,
        sportsName: props.props.sportsName,
        userLogo: props.props.userLogo,
        guildName: props.props.guildName,
        userIntro: props.props.userIntro
      })
    }
  }, [route]);

  const validate = () => {
    const temp = {};

    if (!values.loginName) {
      temp.loginName = "Login Name cannot be empty.";
    } else {
      temp.loginName = "";
    }

    if (!values.password) {
      temp.password = "Password cannot be empty.";
    } else if (values.password.length < 8 || !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/.test(values.password)) {
      temp.password = "Password must be at least 8 characters long and contain at least one letter, one number, and one symbol.";
    } else {
      temp.password = "";
    }

    if (!values.confirmPassword) {
      temp.confirmPassword = "Confirm Password cannot be empty.";
    } else if (values.confirmPassword !== values.password) {
      temp.confirmPassword = "Confirm Password must be the same as the Password.";
    } else {
      temp.confirmPassword = "";
    }

    setErrors(temp);

    return Object.values(temp).every((x) => x === "");
  };

  const handleChange = () => {
    if (validate()) {
      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/updateUser`, values)
        .then((res) => {
          if (res.data === 'updated') {
            alert('success.');
            navigation.navigate('Login');
          } else {
            alert('fail');
          }
        })
        .catch((err) => console.log(err)
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>

      <Text style={styles.heading}>Update LoginName & Password</Text>

      <ScrollView style={styles.margincontainer}>
        <Text style={styles.label}>Login Information</Text>

        <TextInput
          style={styles.input}
          placeholder="User Login Name"
          value={values.loginName}
          onChangeText={(text) => handleInputChange('loginName', text)}
        />
        {error.loginName && <Text style={styles.errorText}>{error.loginName}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={values.password}
          onChangeText={(text) => handleInputChange('password', text)}
          secureTextEntry
        />
        {error.password && <Text style={styles.errorText}>{error.password}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={values.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
          secureTextEntry
        />
        {error.confirmPassword && <Text style={styles.errorText}>{error.confirmPassword}</Text>}


        <TouchableOpacity style={styles.button} onPress={handleChange}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>

      </ScrollView>

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
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  cardContainer: {
    height: 200,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    // Set any other styles for the card if needed
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
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  messageInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1.2,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});