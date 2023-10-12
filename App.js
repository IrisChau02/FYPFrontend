import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from './hooks/useForm';
import { TextField, Button, Card, CardContent } from '@mui/material';

import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from "./layouts/Register";
import Login from "./layouts/Login";

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Login" screenOptions={{
            headerShown: false,
          }}>
    <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  </NavigationContainer>
  )
  
}

