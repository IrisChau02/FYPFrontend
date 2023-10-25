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
import Home from "./layouts/Home";
import InitialAccount from "./layouts/InitialAccount";
import Mission from "./layouts/Mission";
import Guild from "./layouts/Guild";
import GuildCreate from "./layouts/GuildCreate";

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      {/*https://reactnavigation.org/docs/bottom-tab-navigator/*/}
      <Stack.Navigator initialRouteName="Login" screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="InitialAccount" component={InitialAccount} />
        <Stack.Screen name="Mission" component={Mission} />
        <Stack.Screen name="Guild" component={Guild} />
        <Stack.Screen name="GuildCreate" component={GuildCreate} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}

