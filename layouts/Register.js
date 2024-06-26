import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

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
    isPersonal: true,
    isLogin: false,
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const validatePersonal = () => {
    const temp = {};

    if (!values.firstName) {
      temp.firstName = "First Name cannot be empty.";
    } else {
      temp.firstName = "";
    }

    if (!values.lastName) {
      temp.lastName = "Last Name cannot be empty.";
    } else {
      temp.lastName = "";
    }

    if (!values.formatbirthday) {
      temp.formatbirthday = "Birthday should be selected.";
    } else {
      temp.formatbirthday = "";
    }

    if (!values.gender) {
      temp.gender = "Gender should be selected.";
    } else {
      temp.gender = "";
    }

    if (!values.email) {
      temp.email = "Email cannot be empty.";
    } else if (!values.email.includes("@")) {
      temp.email = "Email must be a valid email address.";
    } else {
      temp.email = "";
    }

    if (!values.phoneNumber) {
      temp.phoneNumber = "Phone Number cannot be empty.";
    } else if (!Number.isInteger(parseInt(values.phoneNumber))) {
      temp.phoneNumber = "Phone Number must be a valid integer.";
    } else {
      temp.phoneNumber = "";
    }

    setErrors(temp);

    return Object.values(temp).every((x) => x === "");
  };

  const validateLogin = () => {
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

  const handleNext = () => {
    if (validatePersonal()) {
      setValues({
        ...values,
        isPersonal: false,
        isLogin: true
      });
    }
  };

  const handleRegisterSubmit = () => {
    if (validateLogin()) {
      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/register`, values)
        .then((res) => {
          if (res.data === 'added') {
            alert('Success. Please Login again.');
            navigation.navigate('Login');
          } else {
            alert('fail');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Register</Text>
      <ScrollView contentContainerStyle={styles.container}>

        {values.isPersonal && (
          <>
            <Text style={styles.label}>Personal Information</Text>
            <TextInput
              style={[styles.input]}
              placeholder="First Name"
              value={values.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
            />
            {error.firstName && <Text style={styles.errorText}>{error.firstName}</Text>}

            <TextInput
              style={[styles.input]}
              placeholder="Last Name"
              value={values.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
            />

            {error.lastName && <Text style={styles.errorText}>{error.lastName}</Text>}

            <RadioButtonGroup
              containerStyle={{ margin: 10 }}
              selected={values.gender}
              onSelected={(value) => handleInputChange('gender', value)}
              radioBackground="green"
            >
              <RadioButtonItem value="M" label={<Text style={{ fontSize: 14, color: 'grey' }}>Male</Text>} />
              <RadioButtonItem value="F" label={<Text style={{ fontSize: 14, color: 'grey' }}>Female</Text>} />
              <RadioButtonItem value="NA" label={<Text style={{ fontSize: 14, color: 'grey' }}>Prefer not to say</Text>} />
            </RadioButtonGroup>
            {error.gender && <Text style={styles.errorText}>{error.gender}</Text>}

            <TouchableOpacity style={styles.birthdaybutton} onPress={showDatePickerModal}>
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
            {error.formatbirthday && <Text style={styles.errorText}>{error.formatbirthday}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={values.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
            {error.email && <Text style={styles.errorText}>{error.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={values.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
            />
            {error.phoneNumber && <Text style={styles.errorText}>{error.phoneNumber}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}


        {values.isLogin && (
          <>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Text style={styles.label}>Login Information</Text>

              <View style={{ marginLeft: 'auto' }}>
                <TouchableOpacity
                  onPress={() => setValues({
                    ...values,
                    isPersonal: true,
                    isLogin: false
                  })}
                >

                  <Ionicons name="arrow-back-circle" size={30} color="grey" />
                </TouchableOpacity>
              </View>
            </View>

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


            <TouchableOpacity style={styles.button} onPress={handleRegisterSubmit}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F1F1F1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    margin: 15,
  },
  label: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 8,
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
    backgroundColor: '#D89353',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  birthdaybutton: {
    backgroundColor: 'grey',
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
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 10,
  },
});