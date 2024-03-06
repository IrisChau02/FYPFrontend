import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView, Linking } from 'react-native';
import axios from 'axios';

import BottomBar from "./BottomBar";
import { Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useRef } from 'react';
import Draggable from 'react-native-draggable';
import * as ImagePicker from 'expo-image-picker';

import { AntDesign } from '@expo/vector-icons';

import { CurrentUserID } from './CurrentUserID';

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

export default function EventCreate({ navigation, route }) {

  const getFreshModel = () => ({
    userID: undefined,
    guildName: undefined,
    eventName: undefined,
    eventDetail: undefined,
    eventDate: new Date(),
    formateventDate: undefined,
    startTime: undefined,
    endTime: undefined,
    memberNumber: undefined,
    currentNumber: 1,
    venue: undefined,

    //making poster
    isFilling: true,
    isFormat: false,
    bgcolour: undefined
  })

  const {
    values,
    setValues,
    error,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  const PlaceholderImage = require('../assets/loginbackground2.png');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

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


  const viewRef = useRef(null);
  //custom ratio
  const [ratio, setRatio] = useState(1);
  const buttonRatio = [
    { ratio: 16 / 9, label: '16:9' },
    { ratio: 1, label: '1:1' },
    { ratio: 9 / 12, label: '9:12' },
  ];
  const handleRatioChange = (ratio) => {
    setRatio(ratio);
  };

  //custom background colour
  const [selectedbgColor, setSelectedbgColor] = useState('#E5C1CD');
  const buttonColors = [
    { color: '#E5C1CD', label: '' }, //Pink
    { color: '#F3DBCF', label: '' }, //Orange
    { color: '#7E9680', label: '' }, //Green
    { color: '#AAC9C2', label: '' }, //Blue
    { color: '#B6B4C2', label: '' }, //Purple
    { color: '#E4DFD9', label: '' }, //Gray
  ];

  const handlebgColorChange = (color) => {
    setSelectedbgColor(color);
  };

  //custom font size
  const [fontSize, setFontSize] = useState(16);
  const buttonSizes = [
    { size: 12, label: '12' },
    { size: 13, label: '13' },
    { size: 14, label: '14' },
    { size: 15, label: '15' },
    { size: 16, label: '16' },
    { size: 17, label: '17' },
  ];
  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  //custom font colour
  const [fontColor, setFontColor] = useState('black');
  const buttonfontColour = [
    { color: '#000000', label: '' }, //Black
    { color: '#FFFFFF', label: '' }, //White
    { color: '#333333', label: '' }, //Dark Gray
    { color: '#666666', label: '' }, //Gray
    { color: '#999999', label: '' }, //Light Gray
    { color: '#AAAAAA', label: '' }, //Silver
    { color: '#BBBBBB', label: '' }, //Light Silver
    { color: '#CCCCCC', label: '' }, //Pale Gray
  ];
  const handleFontColorChange = (color) => {
    setFontColor(color);
  };

  //custom border Style
  const [borderStyle, setBorderStyle] = useState(null);
  const defaultBorderStyle = [
    { border: null, label: 'Line' },
    { border: 'dotted', label: 'Dotted' },
    { border: 'dashed', label: 'Dashed' },
  ];

  const handleBorderStyleChange = (border) => {
    setBorderStyle(border);
  };

  const handleNextButton = () => {
    setValues({
      ...values,
      isFilling: false,
      isFormat: true
    })
  };

  const handleBackButton = () => {
    setValues({
      ...values,
      isFilling: true,
      isFormat: false
    })
  };

  const handleCreateEvent = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/createGuildEvent`, values)
      .then((res) => {
        if (res.data === 'added') {
          shareViewToWhatsApp();
          //navigation.navigate('GuildDetail');
        } else {
          alert('Failed to create the event.');
        }
      })
      .catch((err) => console.log(err));
  };

  const shareViewToWhatsApp = async () => {
    try {
      // Get the reference to the view
      const view = viewRef.current;

      // Capture the specific part of the view as a base64 image
      const captureOptions = {
        format: 'png',
        quality: 0.8,
      };
      const imageURI = await captureRef(view, captureOptions);

      // Share the image to WhatsApp
      await Sharing.shareAsync(imageURI, { mimeType: 'image/png', dialogTitle: 'Share to WhatsApp' });
    } catch (error) {
      console.error('Error sharing image to WhatsApp:', error);
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //ensure the type is image
      allowsEditing: true,
      quality: 0.3, // Adjust the quality parameter (0-1) to reduce image size
      base64: true, // Set base64 to true to get the image data in base64 format
    });

    if (!result.canceled) {
      delete result.cancelled;

      setValues({
        ...values,
        bgcolour: result.assets[0].base64,
      })

    } else {
      alert('You did not select any image.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Create Event</Text>


      <ScrollView style={styles.margincontainer}>
        <View style={{ marginBottom: 30 }}>
          {values.isFilling && (
            <>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Event Name</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Event Name"
                value={values.eventName}
                onChangeText={(text) => handleInputChange('eventName', text)}
              />

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Event Detail</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Event Detail"
                value={values.eventDetail}
                onChangeText={(text) => handleInputChange('eventDetail', text)}
                multiline={true}
                keyboardType="ascii-capable"
              />


              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Event Date</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row' }}>

                <View style={{ flex: 4 }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Event Time"
                    value={values.formateventDate}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={{
                    backgroundColor: '#91AC9A',
                    padding: 10,
                    borderRadius: 30,
                    width: 45,
                    marginLeft: 10,
                    marginBottom: 10
                  }} onPress={showDatePickerModal}>
                    <AntDesign name="calendar" size={24} color="white" />
                  </TouchableOpacity>

                </View>
              </View>

              {showDatePicker && (
                    <DateTimePicker
                      value={values.eventDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        handleInputChange('eventDate', selectedDate);
                        handleInputChange('formateventDate', formatDate(selectedDate));
                      }}
                    />
                  )}

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Event Start Time</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Event Start Time"
                value={values.startTime}
                onChangeText={(text) => handleInputChange('startTime', text)}
              />


              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Event Finished Time</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Event Finished Time"
                value={values.endTime}
                onChangeText={(text) => handleInputChange('endTime', text)}
              />


              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Member Number Limit</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Member Number Limit"
                value={values.memberNumber}
                onChangeText={(text) => handleInputChange('memberNumber', text)}
              />


              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Venue</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Venue"
                value={values.venue}
                onChangeText={(text) => handleInputChange('venue', text)}
              />

              <TouchableOpacity style={styles.greenbutton} onPress={handleNextButton}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>

            </>
          )}


          {values.isFormat && (
            <>
              <Text style={styles.label}>Poster to whatsapp Group</Text>


              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Ratio</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {buttonRatio.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRatioChange(button.ratio)}
                    style={{ backgroundColor: 'gray', margin: 5, padding: 10, flex: 1 }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: button.size }}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>


              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Background Colour</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {buttonColors.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlebgColorChange(button.color)}
                    style={{ backgroundColor: button.color, margin: 5, padding: 10, flex: 1 }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center' }}>{button.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <AntDesign name="camera" size={24} color="grey" onPress={pickImageAsync} />


              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Font Size</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {buttonSizes.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleFontSizeChange(button.size)}
                    style={{ backgroundColor: 'gray', margin: 5, padding: 10, flex: 1 }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: button.size }}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Font Colour</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {buttonfontColour.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleFontColorChange(button.color)}
                    style={{ backgroundColor: button.color, margin: 5, padding: 10, flex: 1 }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center' }}>{button.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Border Style</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {defaultBorderStyle.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleBorderStyleChange(button.border)}
                    style={{ backgroundColor: 'gray', margin: 5, padding: 10, flex: 1 }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center' }}>{button.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/**padding: 10, margin: 10 
                 <Draggable
                  x={20}
                  y={30}
                  renderColor='red'
                  renderText='B'
                  dragStartThreshold={100}
                  onShortPressRelease={() => alert('Hold long and drag')}
                  style={{ position: 'absolute', zIndex: 1 }}
                />
                */}

              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "grey" }}>* Can Hold the element and move to desired location.</Text>

              <View ref={viewRef} style={{ aspectRatio: ratio, backgroundColor: selectedbgColor }}>

                <View style={[{ padding: 10, borderWidth: 2, borderColor: 'grey', borderStyle: borderStyle, width: '100%', height: '100%' }]}>
        
                  <Draggable x={10} y={10}>
                    <Text style={{ fontSize: fontSize, color: fontColor }}>Event Name: {values.eventName}</Text>
                  </Draggable>

                  <Draggable x={10} y={30}>
                    <Text style={{ fontSize: fontSize, color: fontColor }}>Event Date: {values.formateventDate}</Text>
                  </Draggable>

                  <Draggable x={10} y={50}>
                    <Text style={{ fontSize: fontSize, color: fontColor }}>Event Start Time: {values.startTime}</Text>
                  </Draggable>

                  <Draggable x={10} y={70}>
                    <Text style={{ fontSize: fontSize, color: fontColor }}>Event End Time: {values.endTime}</Text>
                  </Draggable>

                  <Draggable x={10} y={90}>
                    <Text style={{ fontSize: fontSize, color: fontColor }}>Event Venue: {values.venue}</Text>
                  </Draggable>

                  <Draggable x={10} y={110}>
                    <Text style={{ fontSize: fontSize, color: fontColor }}>Event Member Limit: {values.memberNumber}</Text>
                  </Draggable>

                  <Draggable x={10} y={130}>
                    <Text style={{ fontSize: fontSize, color: fontColor }}>Event Detail: {values.eventDetail}</Text>
                  </Draggable>

                </View>

              </View>

              <TouchableOpacity style={styles.greenbutton} onPress={handleBackButton}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.greenbutton} onPress={handleCreateEvent}>
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>

            </>
          )}
        </View>
      </ScrollView>

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
    backgroundColor: '#91AC9A',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  greenbutton: {
    backgroundColor: 'green',
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
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1.2,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    color: '#91AC9A',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
  },
});