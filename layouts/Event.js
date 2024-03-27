import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

import BottomBar from "./BottomBar";
import GuildEventCard from "../components/GuildEventCard";

export default function Event({ navigation, route }) {

  const getFreshModel = () => ({
    guildName: undefined
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
      fetchGuildEventData();
      setForceUpdate(true);
    });

    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    if (forceUpdate) {
      fetchGuildEventData();
      setForceUpdate(false);
    }
  }, [forceUpdate]);

  useEffect(() => {
    if (route && route.params) {
      const { guildName } = route.params;

      setValues({
        ...values,
        guildName: guildName,
      })
    }
  }, [route]);

  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    if (values.guildName !== undefined) {
      fetchGuildEventData();
    }
  }, [values.guildName]);

  const fetchGuildEventData = () => {
    axios
      .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getGuildEvent`, {
        params: {
          guildName: values.guildName
        },
      })
      .then((res) => {
        setEventList(res.data)
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
        paddingHorizontal: 10
      }}>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Event</Text>
        </View>


        {values.guildName && (
          <View style={{ marginLeft: 'auto' }}>
            <TouchableOpacity onPress={() => navigation.navigate('EventCreate', { guildName: values.guildName })}>
              <AntDesign name="pluscircle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Only join the guild can see the guild event card */}
      {!values.guildName && (
        <View style={styles.margincontainer}>

          <View style={{ marginTop: 100, justifyContent: 'center', alignItems: 'center', }}>
            <AntDesign name="warning" size={40} color="grey" />
            <Text style={{ marginTop: 20, fontSize: 20, color: 'grey', textAlign: 'center' }}> * Join a guild *</Text>
            <Text style={{ marginTop: 20, fontSize: 15, color: 'grey', textAlign: 'center' }}> * To unlock guild event function *</Text>

          </View>
        </View>
      )}
      {/* Only join the guild can see the guild event card */}

      {values.guildName && (
        <FlatList
          data={[{ key: 'eventPage' }]}
          renderItem={() => (

            <SafeAreaView>
              <View style={{ marginBottom: 30 }}>

                <FlatList
                  data={eventList}
                  renderItem={({ item }) => <GuildEventCard event={item} navigation={navigation} />}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.cardList}
                />
              </View>
            </SafeAreaView>

          )}
          keyExtractor={(item) => item.key}
          style={styles.margincontainer}
        />
      )}

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
    marginBottom: 50
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
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});