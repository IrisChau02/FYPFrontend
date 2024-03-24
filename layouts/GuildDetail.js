import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, Linking } from 'react-native';
import axios from 'axios';
import BottomBar from "./BottomBar";
import { Divider } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { CurrentUserID } from './CurrentUserID';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { ProgressBar, MD3Colors } from 'react-native-paper';


export default function GuildDetail({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    guildLogo: undefined,
    guildName: undefined,
    masterUserID: undefined,
    masterName: undefined,
    guildIntro: undefined,
    districtID: undefined,
    level: undefined,
    maxMemberLimit: undefined,
    memberNo: undefined,
    groupID: undefined,
    totalCheckPoint: undefined,
    nextLevelCheckPoint: undefined,
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
    fetchGuildData();
  }, [forceUpdate]);

  useEffect(() => {
    setValues({
      ...values,
      userID: CurrentUserID
    })
  }, [CurrentUserID]);

  useEffect(() => {
    if (values.userID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserDataByID`, {
          params: {
            userID: values.userID,
          },
        })
        .then((res) => {
          if (res.data === 'failed') {
          } else {
            setValues({
              ...values,
              userID: res.data[0].userID,
              guildName: res.data[0].guildName,
            })
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.userID]);


  useEffect(() => {
    if (values.guildName) {
      fetchGuildData();
    }
  }, [values.guildName]);

  const fetchGuildData = async () => {
    try {
      const GuildDetailResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getGuildDetailByName`, {
        params: {
          guildName: values.guildName,
        },
      });

      const CheckPointResponse = axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getGuildCheckPoint`, {
        params: {
          guildName: values.guildName,
        },
      });

      const [GuildDetail, CheckPoint] = await Promise.all([
        GuildDetailResponse,
        CheckPointResponse,
      ]);

      let nextLevelCheckPoint = 0;

      switch (parseInt(GuildDetail.data[0].level)) {
        case 1:
          nextLevelCheckPoint = 7000;
          break;
        case 2:
          nextLevelCheckPoint = 21000;
          break;
        case 3:
          nextLevelCheckPoint = 42000;
          break;
        default:
          nextLevelCheckPoint = 70000;
          break;
      }

      setValues({
        ...values,
        guildLogo: GuildDetail.data[0].guildLogo,
        guildIntro: GuildDetail.data[0].guildIntro,
        masterUserID: GuildDetail.data[0].masterUserID,
        districtID: GuildDetail.data[0].districtID,
        level: GuildDetail.data[0].level,
        maxMemberLimit: GuildDetail.data[0].maxMemberLimit,
        memberNo: GuildDetail.data[0].memberNo,
        groupID: GuildDetail.data[0].groupID,
        totalCheckPoint: CheckPoint.data[0]?.totalCheckPoint,
        nextLevelCheckPoint: nextLevelCheckPoint
      })

    } catch (err) {
      console.log(err);
    }
  };

  //get master name
  useEffect(() => {
    if (values.masterUserID) {
      axios
        .get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/getUserDataByID`, {
          params: {
            userID: values.masterUserID,
          },
        })
        .then((res) => {
          setValues({
            ...values,
            masterName: res.data[0].loginName,
          })
        })
        .catch((err) => console.log(err));
    }
  }, [values.masterUserID]);

  const handleUpgradeButton = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/upgradeGuild`, values)
      .then((res) => {
        if (res.data === 'updated') {
          fetchGuildData();
        } else {
          alert('Failed to Upgrade.');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Guild</Text>
      <View style={styles.margincontainer}>

        <View style={styles.cardContainer}>
          <View style={styles.row}>
            <Image source={{ uri: `data:image/jpeg;base64,${values.guildLogo}` }} style={styles.logo} />
            <View style={styles.column}>

              {/* only master can edit the guild info */}
              {values.userID === values.masterUserID && (
                <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => navigation.navigate('GuildUpdate', values)}>
                  <Text><AntDesign name="edit" size={22} color="grey" /></Text>
                </TouchableOpacity>
              )}

              <Text style={styles.guildName}>{values.guildName}</Text>


              <Text style={{ fontSize: 16, color: 'grey' }}>
                <EvilIcons name="user" size={22} color="grey" />
                {values.masterName}
              </Text>

              <Text style={{ fontSize: 14, color: 'gray', paddingVertical: 5 }}>
                Member {values.memberNo}/{values.maxMemberLimit}
              </Text>


              <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                <Text style={{ fontSize: 16, color: 'grey' }}>
                  Lv {values.level}
                </Text>

                <MaterialIcons name="monetization-on" size={20} style={{ marginLeft: 20 }} color="#FFC000" />
                <Text style={{ fontSize: 16, color: 'grey' }}>{values.totalCheckPoint}</Text>

              </View>

              <ProgressBar
                progress={
                  values.totalCheckPoint && values.nextLevelCheckPoint ?
                    Number((values.totalCheckPoint / values.nextLevelCheckPoint).toFixed(4)) :
                    0
                }
                color="#FFC107" />

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Text style={{ color: 'grey', fontSize: 10 }}>
                  {values.nextLevelCheckPoint ? values.nextLevelCheckPoint : 0}
                </Text>
              </View>

              {values.userID === values.masterUserID && values.level !== 5 && (values.totalCheckPoint >= values.nextLevelCheckPoint) ? (
                <TouchableOpacity
                  style={{
                    height: 30,
                    marginBottom: 10,
                    paddingHorizontal: 10,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#db9e0f',
                  }}
                  onPress={handleUpgradeButton}
                >
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'white' }}>Upgrade</Text>
                </TouchableOpacity>
              ) : null}

              {values.userID === values.masterUserID && values.level === 5 ? (
                <TouchableOpacity
                  style={{
                    height: 30,
                    marginBottom: 10,
                    paddingHorizontal: 10,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#db9e0f',
                  }}

                >
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'white' }}>Max Level</Text>
                </TouchableOpacity>
              ) : null}

            </View>
          </View>

          <Divider style={{ margin: 5 }} />

          <View style={styles.InfoBox} >
            <Text style={styles.guildInfo}>{values.guildIntro}</Text>
          </View>


          {values.groupID && (
            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`https://chat.whatsapp.com/${values.groupID}`)}>
              <Text style={styles.buttonText}>Join WhatsApp Group <FontAwesome name="whatsapp" size={24} color="white" /> </Text>
            </TouchableOpacity>
          )}


          {/*
          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://wa.me/85265022979?text=Hello, nice to meet you!')}>
            <Text style={styles.buttonText}>Chat With Master <FontAwesome name="whatsapp" size={24} color="white" /> </Text>
          </TouchableOpacity>
          */}

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, }}>
          <TouchableOpacity style={styles.displaybutton} onPress={() => navigation.navigate('MemberList')}>
            <AntDesign name="team" size={24} color="white" />
            <Text style={styles.iconText}>Member List</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.displaybutton} onPress={() => navigation.navigate('Event', { guildName: values.guildName })}>
            <MaterialIcons name="event-note" size={24} color="white" />
            <Text style={styles.iconText}>Event</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, }}>
          <TouchableOpacity style={styles.displaybutton} onPress={() => navigation.navigate('Mission')}>
            <AntDesign name="calendar" size={24} color="white" />
            <Text style={styles.iconText}>Mission</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.displaybutton} onPress={() => navigation.navigate('RankingList', { guildName: values.guildName })}>
            <AntDesign name="barschart" size={24} color="white" />
            <Text style={styles.iconText}>Ranking</Text>
          </TouchableOpacity>
        </View>


      </View>

      <View style={styles.bottomBarContainer}>
        <BottomBar navigation={navigation} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  displaybutton: {
    width: '45%',
    height: 120,
    padding: 10,
    borderRadius: 20,
    borderColor: 'grey',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a9a9a9'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#F9F6F2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderColor: 'grey',
    borderWidth: 1.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 85,
    height: 85,
    marginBottom: 8,
    borderRadius: 90,
  },
  column: {
    flex: 1,
    marginLeft: 16,
  },
  guildName: {
    fontSize: 20,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 4,
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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#F5F5DC',
    fontWeight: 'bold',
    marginLeft: 5, // Add some spacing between the icon and text
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});