import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import axios from 'axios';

const formatDate = (date) => {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;

  return [year, month, day].join('-');
}

export default function Register({ navigation }) {
  const getFreshModel = () => ({
    firstName: undefined,
    lastName: undefined,
    birthday: new Date(),
    formatbirthday: undefined,
    gender: "M",
    phoneNumber: undefined,
    email: undefined,
    password: undefined,
    loginName: undefined,
    confirmPassword: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const PlaceholderImage = require('../assets/loginbackground.png');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  useEffect(() => {
    console.log(values)
  }, [values])

  const handleRegisterSubmit = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/register`, values)
      .then((res) => {
        if (res.data === 'added') {
          alert('success')
          navigation.navigate('Login')
        } else {
          alert('fail');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <ImageBackground source={PlaceholderImage} style={styles.image} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Register Page</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Personal Information</Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="First Name"
            value={values.firstName}
            onChangeText={(text) => handleInputChange('firstName', text)}
          />

          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Last Name"
            value={values.lastName}
            onChangeText={(text) => handleInputChange('lastName', text)}
          />
        </View>

        <RadioButtonGroup
          containerStyle={{ margin: 10 }}
          selected={values.gender}
          onSelected={(value) => handleInputChange('gender', value)}
          radioBackground="green"
        >
          <RadioButtonItem value="M" label="Male" />
          <RadioButtonItem value="F" label="Female" />
          <RadioButtonItem value="NA" label="N/A" />
        </RadioButtonGroup>


        <TouchableOpacity style={styles.button} onPress={showDatePickerModal}>
          <Text style={styles.buttonText}>Select Birthday</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={values.birthday}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              handleInputChange('birthday', selectedDate);
              handleInputChange('formatbirthday', formatDate(selectedDate));
            }}
          />
        )}

        <TextInput
          style={[styles.input]}
          placeholder="Birthday"
          value={values.formatbirthday}
        />


        <TextInput
          style={styles.input}
          placeholder="Email"
          value={values.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={values.phoneNumber}
          onChangeText={(text) => handleInputChange('phoneNumber', text)}
        />

        <View style={styles.divider} />
        <Text style={styles.label}>Login Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Login Name"
          value={values.loginName}
          onChangeText={(text) => handleInputChange('loginName', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={values.password}
          onChangeText={(text) => handleInputChange('password', text)}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={values.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
          secureTextEntry
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegisterSubmit}>
         <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'brown',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginVertical: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray', // Set the background color
  },
  registerButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});