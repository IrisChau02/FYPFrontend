import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";

import { AntDesign } from '@expo/vector-icons';
import BottomBar from "./BottomBar";

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

export default function ProfileDetail({ navigation, route }) {

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
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const PlaceholderImage = require('../assets/loginbackground2.png');
  const defaultLogoImage = require('../assets/defaultLogo.png');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

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
        guildName: props.props.guildName
      })
    }
  }, [route]);

  const [districtList, setDistrictList] = useState([]);
  const [workingModeList, setWorkingModeList] = useState([]);
  const [sportsList, setSportsList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const districtResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getDistrict`);
      const workingModeResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getWorkingMode`);
      const sportsResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getSports`);

      const [districtData, workingModeData, sportsData] = await Promise.all([
        districtResponse,
        workingModeResponse,
        sportsResponse,
      ]);

      setDistrictList(districtData.data);
      setWorkingModeList(workingModeData.data);
      setSportsList(sportsData.data);
    } catch (err) {
      console.log(err);
    }
  };

  const validate = () => {
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
      console.log(values)

      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/updateUser`, values)
        .then((res) => {
          if (res.data === 'updated') {
            alert('success');
            navigation.navigate('Home');
          } else {
            alert('fail');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <View style={styles.container}>
      <Image source={PlaceholderImage} style={styles.image} />
      <ScrollView style={styles.margincontainer}>



        <Text style={styles.heading}>Profile Detail Page</Text>


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
          <RadioButtonItem value="M" label="Male" />
          <RadioButtonItem value="F" label="Female" />
          <RadioButtonItem value="NA" label="Prefer not to say" />
        </RadioButtonGroup>
        {error.gender && <Text style={styles.errorText}>{error.gender}</Text>}


        <TouchableOpacity style={styles.button} onPress={showDatePickerModal}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <AntDesign name="calendar" size={24} color="#fff" />
            <Text style={styles.buttonText}>Select Birthday</Text>
          </View>

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

        <View style={styles.divider} />
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
          <Text style={styles.buttonText}>Confirm Change</Text>
        </TouchableOpacity>

      </ScrollView>
      {/*<BottomBar navigation={navigation} />*/}
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
  cardContainer: {
    height: 200, // Set the desired fixed height for the card
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
    //borderColor: 'gray',
    //borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'lightgray', // Set the background color
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flex: 1, // Use flex: 1 to make the column take up remaining horizontal space
    marginLeft: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
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
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: 'brown',
    fontWeight: 'bold',
    marginBottom: 8,
  },

});