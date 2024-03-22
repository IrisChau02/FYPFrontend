import React, { useState, useEffect } from 'react';
import useForm from '../hooks/useForm';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function Login({ navigation }) {

  const getFreshModel = () => ({
    username: '',
    password: '',
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
      setForceUpdate((prevValue) => !prevValue);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setValues({
      ...values,
      username: '',
      password: '',
    })
  }, [forceUpdate]);

  const IconImage = require('../assets/Exbond.png');

  const validate = () => {
    const temp = {};

    if (!values.username) {
      temp.username = "Username cannot be empty.";
    } else {
      temp.username = "";
    }

    if (!values.password) {
      temp.password = "Password cannot be empty.";
    } else {
      temp.password = "";
    }

    setErrors(temp);

    return Object.values(temp).every((x) => x === "");
  };

  const handleSubmit = () => {
    if (validate()) {
      axios
        .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/login`, values)
        .then((res) => {
          if (res.data === 'failed') {
            alert('There is no existing record. Please input again.');
          } else {
            if (res.data[0].districtID == null || res.data[0].workModeID == null || res.data[0].sportsID == null) {
              //if user is first log in
              navigation.navigate('InitialAccount', {
                loginName: res.data[0].loginName,
                password: res.data[0].password,
              });
            } else {
              //if all the user info is filled
              navigation.navigate('Home', {
                loginName: res.data[0].loginName,
                password: res.data[0].password,
              });
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <View style={styles.container}>
      <Image source={IconImage} style={{ width: 100, height: 100, padding: 10 }} />

      <Text style={styles.text}>Please enter your login information</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={values.username}
        onChangeText={(text) => handleInputChange('username', text)}
        onFocus={() => setErrors({ ...error, username: '' })}
      />
      {error.username && <Text style={styles.errorText}>{error.username}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={values.password}
        onChangeText={(text) => handleInputChange('password', text)}
        secureTextEntry
        onFocus={() => setErrors({ ...error, password: '' })}
      />
      {error.password && <Text style={styles.errorText}>{error.password}</Text>}

      <Text style={styles.text}>If you do not have an account</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.button}>
        <Text style={styles.buttonText}>Go to Register Page</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Login</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    margin: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  text: {
    color: 'gray',
    fontSize: 13,
    margin: 5
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 5,
    backgroundColor: 'lightgray', // Set the background color
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
  },
});

