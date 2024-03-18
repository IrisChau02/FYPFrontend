import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

import BottomBar from "./BottomBar";
import { CurrentUserID } from './CurrentUserID';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Divider } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

export default function RankingList({ navigation, route }) {

  const getFreshModel = () => ({
    guildName: undefined,
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const defaultLogoImage = require('../assets/defaultUserLogo.png');

  const [allGuildRankingList, setAllGuildRankingList] = useState([]);

  useEffect(() => {
    fetchGuildRanking();
  }, []);

  const fetchGuildRanking = () => {
    axios
      .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getAllGuildRanking`)
      .then((res) => {
        setAllGuildRankingList(res.data)
      })
      .catch((err) => console.log(err));
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>

      <Text style={styles.heading}>Guild Ranking</Text>

      <ScrollView style={styles.margincontainer}>

        <View style={{ marginBottom: 20 }}>

          {
            allGuildRankingList.map((guild, index) => {
              return (
                <Card style={styles.card} key={guild.guildName}>
                  <TextInput style={styles.input} value={(index + 1).toString()} />

                  <View style={{ flexDirection: 'row' }}>
                    {/* left */}
                    <View style={{ flex: 1 }}>
                      <Image source={guild.guildLogo ? { uri: `data:image/jpeg;base64,${guild.guildLogo}` } : defaultLogoImage} style={styles.logo} />
                    </View>

                    {/* right */}
                    <View style={{ flex: 1.5 }}>
                      <TextInput style={styles.input} value={guild.guildName} />

                      <Text style={{ fontSize: 14, color: 'gray' }}>
                        Lv {guild.level} | Member {guild.memberNo}/{guild.maxMemberLimit} |
                      </Text>

                      <View style={{ flexDirection: 'row' }}>
                        <MaterialIcons name="monetization-on" size={30} color="#FFC000" />
                        <Text style={{ fontSize: 16, color: 'grey', margin: 5 }}>{guild.totalCheckPoint}</Text>
                      </View>
                    </View>
                  </View>

                  <Divider style={{ margin: 5 }} />

                  <View style={styles.InfoBox} >
                    <Text style={styles.guildInfo}>{guild.guildIntro}</Text>
                  </View>

                </Card>
              );
            })
          }

        </View>
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  card: {
    flex: 1, //flexible in height
    backgroundColor: '#F9F6F2',
    borderRadius: 8,
    marginBottom: 10,
    borderColor: 'grey',
    borderWidth: 1.8,
    padding: 10,
    justifyContent: 'center',
  },
  InfoBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 5,
    padding: 10,
    borderColor: 'grey',
    borderWidth: 1.5,
  },
  guildInfo: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 8,
  },
  input: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    margin: 5,
    paddingHorizontal: 4,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 90,
  },
  button: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
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