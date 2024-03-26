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
import { Dimensions } from 'react-native';

export default function RankingList({ navigation, route }) {

  const getFreshModel = () => ({
    guildName: undefined,
    currentRegionID: 0,
    currentDistrictID: undefined,
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

  const [regionList, setRegionList] = useState([
    { regionID: 0, regionName: "Total" },
    { regionID: 1, regionName: "Hong Kong Island" },
    { regionID: 2, regionName: "Kowloon" },
    { regionID: 3, regionName: "New Territories" }]);

  const [districtList, setDistrictList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const districtResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getDistrict`);

      const [districtData] = await Promise.all([
        districtResponse,
      ]);

      setDistrictList(districtData.data);

    } catch (err) {
      console.log(err);
    }
  };

  const GuildCard = ({ guild, index }) => {
    return (
      <View style={styles.card}>

        <View style={{ flexDirection: 'row' }}>
          <TextInput
            style={{ fontSize: 20, color: 'orange', fontWeight: 'bold', marginLeft: 5, marginRight: 5 }}
            value={(index + 1).toString()}
          />
          <TextInput style={styles.input} value={guild.guildName} />
        </View>

        <View style={{ flexDirection: 'row' }}>
          {/* left */}
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.navigate('GuildDetailOther', { guild })}>
              <Image
                source={guild.guildLogo ? { uri: `data:image/jpeg;base64,${guild.guildLogo}` } : defaultLogoImage}
                style={styles.logo}
              />
            </TouchableOpacity>
          </View>

          {/* right */}
          <View style={{ flex: 1.5 }}>
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

        <View style={styles.InfoBox}>
          <Text style={styles.guildInfo}>{guild.guildIntro}</Text>
        </View>

      </View>
    );
  };

  const RegionGuildCard = ({ guild, index, regionID, districtID }) => {
    return (
      <>
        {regionID === guild.regionID && (districtID ? districtID === guild.districtID : true) && (
          <View style={styles.card}>

            <View style={{ flexDirection: 'row' }}>
              <TextInput
                style={{ fontSize: 20, color: 'orange', fontWeight: 'bold', marginLeft: 5, marginRight: 5 }}
                value={(index + 1).toString()}
              />
              <TextInput style={styles.input} value={guild.guildName} />
            </View>

            <View style={{ flexDirection: 'row' }}>
              {/* left */}
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => navigation.navigate('GuildDetailOther', { guild })}>
                  <Image
                    source={guild.guildLogo ? { uri: `data:image/jpeg;base64,${guild.guildLogo}` } : defaultLogoImage}
                    style={styles.logo}
                  />
                </TouchableOpacity>
              </View>

              {/* right */}
              <View style={{ flex: 1.5 }}>
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

            <View style={styles.InfoBox}>
              <Text style={styles.guildInfo}>{guild.guildIntro}</Text>
            </View>

          </View>
        )}
      </>
    );
  };

  function handleChangeTap(item) {
    setValues({
      ...values,
      currentRegionID: item.regionID,
      currentDistrictID: null
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>

      <Text style={styles.heading}>Guild Ranking</Text>

      <View style={styles.margincontainer}>

        {/* Tab */}
        <View style={{ backgroundColor: '#F1F1F1', borderBottomWidth: 1.5, borderBottomColor: '#999999' }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', height: 50, justifyContent: 'space-around', alignItems: 'center' }}>
              {/* Content of the row */}
              {regionList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleChangeTap(item)}
                  style={{ alignItems: 'center', marginLeft: 5, marginRight: 5 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#999999',
                      margin: 5,
                      fontWeight: item.regionID === values.currentRegionID ? 'bold' : 'normal',
                    }}
                  >
                    {item.regionName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        {/* Tab */}

        <ScrollView style={{ flex: 1, padding: 16 }}>
          <View style={{ paddingBottom: 20 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {districtList.map((item, index) => (
                (values.currentRegionID !== 0 && (values.currentRegionID === item.regionID)) && (
                  <TouchableOpacity
                    key={index}
                    style={{
                      height: 30,
                      borderColor: 'grey',
                      borderWidth: 1.2,
                      marginBottom: 10,
                      paddingHorizontal: 5,
                      borderRadius: 30,
                      marginRight: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: item.districtID === values.currentDistrictID ? '#999999' : null,
                    }}

                    onPress={() => {
                      setValues({
                        ...values,
                        currentDistrictID: item.districtID
                      });
                    }}
                  >
                    <Text style={{ fontSize: 12, color: item.districtID === values.currentDistrictID ? 'white' : 'grey' }}>{item.districtName}</Text>
                  </TouchableOpacity>
                )
              ))}
            </View>

            {allGuildRankingList.map((guild, index) => (
              (values.currentRegionID === 0) && <GuildCard key={guild.guildName} guild={guild} index={index} />
            ))}


            {/* show by the region */}
            {allGuildRankingList.map((guild, index) => (
              <RegionGuildCard key={guild.guildName} guild={guild} index={index} regionID={values.currentRegionID} districtID={values.currentDistrictID} />
            ))}
            {/* show by the region */}
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomBarContainer}>
        <BottomBar navigation={navigation} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  margincontainer: {
    flexGrow: 1,
    backgroundColor: '#F1F1F1',
    marginBottom: 50,
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