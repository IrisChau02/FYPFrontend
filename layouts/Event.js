import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

import BottomBar from "./BottomBar";
import { Card, Title, Paragraph, Divider } from 'react-native-paper';

import moment from 'moment';
import { Calendar, Agenda } from 'react-native-calendars';

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
        if (res.data) {
          setEventList(res.data)
        }
      })
      .catch((err) => console.log(err));
  };

  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const eventDates = {};

  eventList.forEach((event) => {
    const startDate = event.eventDate;
    if (!eventDates[startDate]) {
      eventDates[startDate] = [];
    }
    eventDates[startDate].push({
      eventName: event.eventName,
      start: event.startTime,
      end: event.endTime,
    });
  });

  const renderAgendaItem = (item) => (
    <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#CCCCCC' }}>

      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'gray', marginRight: 20 }}>
          {item.start} - {item.end}
        </Text>
        <TouchableOpacity style={{ backgroundColor: '#91AC9A', padding: 2, borderRadius: 30, width: 35 }} onPress={() => navigation.navigate('EventDetail', { event: item })}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <AntDesign name="search1" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={{ marginTop: 4, fontSize: 14, color: 'gray' }}>{item.eventName}</Text>

    </View>
  );

  const renderEmptyData = () => {
    if (Object.keys(eventDates).length === 0) {
      return renderEmptyDate();
    } else {
      return (
        <Text style={{ fontSize: 16, color: 'gray', textAlign: 'center', padding: 10 }}>
          No Event
        </Text>
      );
    }
  };

  const renderEmptyDate = () => (
    <Text style={{ fontSize: 16, color: 'gray', textAlign: 'center', padding: 10 }}>
          No Event
        </Text>
  );


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

      <View style={styles.margincontainer}>

        {/* Only join the guild can see the guild event card */}
        {!values.guildName && (
          <View style={{ marginTop: 100, justifyContent: 'center', alignItems: 'center', }}>
            <AntDesign name="warning" size={40} color="grey" />
            <Text style={{ marginTop: 20, fontSize: 20, color: 'grey', textAlign: 'center' }}> * Join a guild *</Text>
            <Text style={{ marginTop: 20, fontSize: 15, color: 'grey', textAlign: 'center' }}> * To unlock guild event function *</Text>
          </View>
        )}
        {/* Only join the guild can see the guild event card */}

        {/*   Agenda   */}
        <View style={{ flex: 1 }}>
          <Agenda
            items={eventDates}
            selected={selectedDate}
            renderItem={renderAgendaItem}
            renderEmptyData={renderEmptyData}
          />
        </View>

        <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1.2, marginVertical: 5 }} />

        {/*   Event card   */}
        <ScrollView style={{ flex: 1 }}>
          {
            eventList.map(event => {
              return (
                <Card style={{
                  height: 'auto',
                  backgroundColor: '#F1F1F1',
                  borderColor: 'grey',
                  borderWidth: 1.5,
                  justifyContent: 'center',
                  padding: 10,
                  marginBottom: 10,
                }} key={event.eventName}>

                  <Text style={styles.eventName}>{event.eventName}</Text>
                  <Text style={styles.eventInfo}>Initiator: {event.loginName}</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.eventInfo}>Date: {event.eventDate}  |  </Text>
                    <Text style={styles.eventInfo}>Time: {event.startTime} - {event.endTime}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.eventInfo}>Member: {event.currentNumber} / {event.memberNumber}  </Text>
                  </View>

                  <Text style={styles.eventInfo}>Venue: {event.venue}</Text>
                  <TouchableOpacity style={styles.eventbutton} onPress={() => navigation.navigate('EventDetail', { event: event })}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <AntDesign name="search1" size={24} color="white" />
                      <Text style={styles.buttonText}>View Details</Text>
                    </View>
                  </TouchableOpacity>

                </Card>
              );
            })
          }

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
  eventName: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventInfo: {
    fontSize: 16,
    marginBottom: 4,
    color: 'grey',
  },
  eventbutton: {
    backgroundColor: '#91AC9A',
    padding: 8,
    borderRadius: 30,
    margin: 10
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});