import { useEffect } from "react";
import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { View, Text, ImageBackground, StyleSheet, Image, Pressable, TextInput, TouchableOpacity, FlatList, ScrollView, SafeAreaView, Linking, Modal } from 'react-native';
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
    isFormat: false
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
  const scrollViewRef = useRef(null);

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

  //custom font size
  const [fontSize, setFontSize] = useState(16);
  const buttonSizes = [
    { size: 12, label: '12' },
    { size: 13, label: '13' },
    { size: 14, label: '14' },
    { size: 15, label: '15' },
    { size: 16, label: '16' },
    { size: 17, label: '17' },
    { size: 18, label: '18' },
    { size: 19, label: '19' },
    { size: 20, label: '20' },
    { size: 21, label: '21' },
  ];

  //custom font colour
  const [fontColor, setFontColor] = useState('black');
  const buttonfontColour = [
    { color: '#FFFFFF', label: '' }, // White
    { color: '#CCCCCC', label: '' }, // Pale Gray
    { color: '#999999', label: '' }, // Light Gray
    { color: '#666666', label: '' }, // Gray
    { color: '#000000', label: '' }, // Black
    //pink theme
    { color: '#ffe8d5', label: '' }, // #ffe8d5
    { color: '#f8b4aa', label: '' }, // #f8b4aa
    { color: '#f08080', label: '' }, // #f08080
    { color: '#dc90a9', label: '' }, // #dc90a9
    { color: '#c7a0d2', label: '' },  // #c7a0d2
    //yellow brown theme 
    { color: '#ffdbac', label: '' },  // #ffdbac
    { color: '#f1c27d', label: '' }, // #f1c27d
    { color: '#e0ac69', label: '' }, // #e0ac69
    { color: '#c68642', label: '' }, // #c68642
    { color: '#8d5524', label: '' }, // #8d5524
    //green theme
    { color: '#c1d08a', label: '' }, // #c1d08a
    { color: '#7cb46b', label: '' }, // #7cb46b
    { color: '#769a6e', label: '' }, // #769a6e
    { color: '#b0c1b3', label: '' }, // #b0c1b3
    { color: '#96845a', label: '' },  // #96845a
    //blue theme
    { color: '#b3cde0', label: '' },  // #b3cde0
    { color: '#6497b1', label: '' }, // #6497b1
    { color: '#005b96', label: '' }, // #005b96
    { color: '#03396c', label: '' }, // #03396c
    { color: '#011f4b', label: '' }, // #011f4b
  ];

  const handleNextButton = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
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
          setTimeout(() => {
            navigation.navigate('GuildDetail');
          }, 1000); 
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

  //open the dialog
  const [isShow, setIsShow] = useState(false);

  const hideModal = () => {
    setIsShow(false);
  };

  //open the Custom all dialog
  const [isCustomAllFont, setIsCustomAllFont] = useState(false);


  const hideCustomAllModal = () => {
    setIsCustomAllFont(false);
  };

  //open the Custom dialog
  const [isCustomFont, setIsCustomFont] = useState(false);
  const [customItem, setCustomItem] = useState('');

  const hideCustomModal = () => {
    setIsCustomFont(false);
  };

  const template1 = require('../assets/template_1.png');
  const template2 = require('../assets/template_2.png');
  const template3 = require('../assets/template_3.png');
  const template4 = require('../assets/template_4.png');
  const template5 = require('../assets/template_5.png');
  const template6 = require('../assets/template_6.png');
  const template7 = require('../assets/template_7.png');
  const template8 = require('../assets/template_8.png');
  const template9 = require('../assets/template_9.png');
  const template10 = require('../assets/template_10.png');

  const [backgroundImg, setBackgroundImg] = useState(null);

  const [draggableItems, setDraggableItems] = useState({
    EventName: {
      x: 10 + 30,
      y: 10 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    EventNameValue: {
      x: 160 + 30,
      y: 10 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    EventDate: {
      x: 10 + 30,
      y: 30 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    EventDateValue: {
      x: 160 + 30,
      y: 30 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    StartTime: {
      x: 10 + 30,
      y: 50 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    StartTimeValue: {
      x: 160 + 30,
      y: 50 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    EndTime: {
      x: 10 + 30,
      y: 70 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    EndTimeValue: {
      x: 160 + 30,
      y: 70 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    EventVenue: {
      x: 10 + 30,
      y: 90 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    EventVenueValue: {
      x: 160 + 30,
      y: 90 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    MemberLimit: {
      x: 10 + 30,
      y: 110 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    MemberLimitValue: {
      x: 160 + 30,
      y: 110 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    EventDetail: {
      x: 10 + 30,
      y: 130 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    },
    EventDetailValue: {
      x: 160 + 30,
      y: 130 + 50,
      fontSize: 16,
      fontColor: '#000000',
      fontWeight: null
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#5EAF88' }}>
      <Text style={styles.heading}>Create Event</Text>

      {/* choose the template */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShow}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: '100%',
              height: 400,
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
            }}
          >
            <TouchableOpacity onPress={hideModal} style={styles.button}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <ScrollView>

              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { setBackgroundImg(template1) }}>
                  <Image style={styles.template} source={template1} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setBackgroundImg(template2) }}>
                  <Image style={styles.template} source={template2} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { setBackgroundImg(template3) }}>
                  <Image style={styles.template} source={template3} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setBackgroundImg(template4) }}>
                  <Image style={styles.template} source={template4} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { setBackgroundImg(template5) }}>
                  <Image style={styles.template} source={template5} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setBackgroundImg(template6) }}>
                  <Image style={styles.template} source={template6} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { setBackgroundImg(template7) }}>
                  <Image style={styles.template} source={template7} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setBackgroundImg(template8) }}>
                  <Image style={styles.template} source={template8} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { setBackgroundImg(template9) }}>
                  <Image style={styles.template} source={template9} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setBackgroundImg(template10) }}>
                  <Image style={styles.template} source={template10} />
                </TouchableOpacity>
              </View>

            </ScrollView>

          </View>
        </Pressable>
      </Modal>
      {/* choose the template */}

      {/* choose the all font size */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCustomAllFont}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <View
            style={{
              width: '100%',
              height: 300,
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
            }}
          >
            <TouchableOpacity onPress={hideCustomAllModal} style={styles.button}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>

            <ScrollView>


              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'gray', marginBottom: 5, fontSize: 18 }}>Font Size</Text>
              <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }}>
                {buttonSizes.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      const updatedDraggableItems = Object.keys(draggableItems).reduce((acc, key) => {
                        const item = draggableItems[key];
                        const updatedItem = { ...item, fontSize: button.size };
                        return { ...acc, [key]: updatedItem };
                      }, {});

                      setDraggableItems(updatedDraggableItems);
                    }}
                    style={{ backgroundColor: 'gray', margin: 5, padding: 10, flexBasis: '15%', borderRadius: 30 }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 14 }}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'gray', marginBottom: 5, fontSize: 18 }}>Font Weight</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{ borderRadius: 30, backgroundColor: 'gray', margin: 5, padding: 10, flex: 1 }}
                  onPress={() => {
                    const updatedDraggableItems = Object.keys(draggableItems).reduce((acc, key) => {
                      const item = draggableItems[key];
                      const updatedItem = { ...item, fontWeight: 'bold' };
                      return { ...acc, [key]: updatedItem };
                    }, {});

                    setDraggableItems(updatedDraggableItems);
                  }}
                >
                  <Text style={{ color: 'white', textAlign: 'center' }}>Bold</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ borderRadius: 30, backgroundColor: 'gray', margin: 5, padding: 10, flex: 1 }}
                  onPress={() => {
                    const updatedDraggableItems = Object.keys(draggableItems).reduce((acc, key) => {
                      const item = draggableItems[key];
                      const updatedItem = { ...item, fontWeight: null };
                      return { ...acc, [key]: updatedItem };
                    }, {});

                    setDraggableItems(updatedDraggableItems);
                  }}
                >
                  <Text style={{ color: 'white', textAlign: 'center' }}>Unbold</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'gray', marginBottom: 5, fontSize: 18 }}>Font Color</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {buttonfontColour.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      const updatedDraggableItems = Object.keys(draggableItems).reduce((acc, key) => {
                        const item = draggableItems[key];
                        const updatedItem = { ...item, fontColor: button.color };
                        return { ...acc, [key]: updatedItem };
                      }, {});

                      setDraggableItems(updatedDraggableItems);
                    }}
                    style={{
                      height: 40,
                      borderRadius: 30,
                      borderWidth: 1.5,
                      borderColor: '#ccc',
                      backgroundColor: button.color,
                      margin: 4,
                      padding: 10,
                      flexBasis: '15%' // 100% divided by 6 buttons
                    }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center' }}>{button.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

            </ScrollView>

          </View>
        </Pressable>
      </Modal>
      {/* choose the all font size */}

      {/* choose the font size */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCustomFont}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <View
            style={{
              width: '100%',
              height: 300,
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
            }}
          >
            <TouchableOpacity onPress={hideCustomModal} style={styles.button}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>

            <ScrollView>


              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'gray', marginBottom: 5, fontSize: 18 }}>Font Size</Text>
              <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }}>
                {buttonSizes.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      setDraggableItems((prevState) => ({
                        ...prevState,
                        [customItem]: {
                          ...prevState[customItem],
                          fontSize: button.size,
                        },
                      }))
                    }
                    style={{ backgroundColor: 'gray', margin: 5, padding: 10, flexBasis: '15%', borderRadius: 30 }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 14 }}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'gray', marginBottom: 5, fontSize: 18 }}>Font Weight</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ borderRadius: 30, backgroundColor: 'gray', margin: 5, padding: 10, flex: 1 }}
                  onPress={() =>
                    setDraggableItems(prevState => ({
                      ...prevState,
                      [customItem]: {
                        ...prevState[customItem],
                        fontWeight: 'bold'
                      }
                    }))
                  }
                >
                  <Text style={{ color: 'white', textAlign: 'center' }}>Bold</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ borderRadius: 30, backgroundColor: 'gray', margin: 5, padding: 10, flex: 1 }}
                  onPress={() =>
                    setDraggableItems(prevState => ({
                      ...prevState,
                      [customItem]: {
                        ...prevState[customItem],
                        fontWeight: null
                      }
                    }))
                  }
                >
                  <Text style={{ color: 'white', textAlign: 'center' }}>Unbold</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'gray', marginBottom: 5, fontSize: 18 }}>Font Color</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {buttonfontColour.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      setDraggableItems((prevState) => ({
                        ...prevState,
                        [customItem]: {
                          ...prevState[customItem],
                          fontColor: button.color
                        }
                      }))
                    }
                    style={{
                      height: 40,
                      borderRadius: 30,
                      borderWidth: 1.5,
                      borderColor: '#ccc',
                      backgroundColor: button.color,
                      margin: 4,
                      padding: 10,
                      flexBasis: '15%' // 100% divided by 6 buttons
                    }}
                  />
                ))}
              </View>

            </ScrollView>

          </View>
        </Pressable>
      </Modal>
      {/* choose the font size */}

      <ScrollView ref={scrollViewRef} style={styles.margincontainer}>
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

              <TouchableOpacity onPress={() => setIsShow(true)} style={styles.button}>
                <Text style={styles.buttonText}>Select Template</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsCustomAllFont(true)} style={styles.button}>
                <Text style={styles.buttonText}>Custom Font Style</Text>
              </TouchableOpacity>

              <Text style={{ fontSize: 10, textAlign: 'center', fontWeight: 'bold', color: "grey" }}>* Can Hold the element and move to desired location.</Text>
              <Text style={{ fontSize: 10, textAlign: 'center', fontWeight: 'bold', color: "grey", marginBottom: 10 }}>* Can Press the element to custom specifically.</Text>


              <View style={{ marginBottom: 10, height: 100, backgroundColor: '#D3D3D3', borderColor: '#ccc', borderWidth: 1.5, }}>
                <Text style={{ fontSize: 10, marginTop: 2, textAlign: 'center', fontWeight: 'bold', color: "grey" }}>Useless elements can drag here.</Text>
              </View>

              <View ref={viewRef} style={{ aspectRatio: 3 / 4 }}>
                <ImageBackground source={backgroundImg}
                  style={[
                    { width: '100%', height: '100%' },
                    backgroundImg === null ? { borderWidth: 1.8, borderColor: 'gray' } : null
                  ]}
                >

                  <Draggable x={draggableItems.EventName.x} y={draggableItems.EventName.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('EventName'); }}>
                      <Text style={{ fontSize: draggableItems.EventName.fontSize, color: draggableItems.EventName.fontColor, fontWeight: draggableItems.EventName.fontWeight }}>Event Name:</Text>
                    </TouchableOpacity>
                  </Draggable>
                  <Draggable x={draggableItems.EventNameValue.x} y={draggableItems.EventNameValue.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('EventNameValue'); }}>
                      <Text style={{ fontSize: draggableItems.EventNameValue.fontSize, color: draggableItems.EventNameValue.fontColor, fontWeight: draggableItems.EventNameValue.fontWeight }}>{values.eventName}</Text>
                    </TouchableOpacity>
                  </Draggable>


                  <Draggable x={draggableItems.EventDate.x} y={draggableItems.EventDate.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('EventDate'); }}>
                      <Text style={{ fontSize: draggableItems.EventDate.fontSize, color: draggableItems.EventDate.fontColor, fontWeight: draggableItems.EventDate.fontWeight }}>Event Date:</Text>
                    </TouchableOpacity>
                  </Draggable>
                  <Draggable x={draggableItems.EventDateValue.x} y={draggableItems.EventDateValue.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('EventDateValue'); }}>
                      <Text style={{ fontSize: draggableItems.EventDateValue.fontSize, color: draggableItems.EventDateValue.fontColor, fontWeight: draggableItems.EventDateValue.fontWeight }}>{values.formateventDate}</Text>
                    </TouchableOpacity>
                  </Draggable>


                  <Draggable x={draggableItems.StartTime.x} y={draggableItems.StartTime.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('StartTime'); }}>
                      <Text style={{ fontSize: draggableItems.StartTime.fontSize, color: draggableItems.StartTime.fontColor, fontWeight: draggableItems.StartTime.fontWeight }}>Event Start Time:</Text>
                    </TouchableOpacity>
                  </Draggable>
                  <Draggable x={draggableItems.StartTimeValue.x} y={draggableItems.StartTimeValue.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('StartTimeValue'); }}>
                      <Text style={{ fontSize: draggableItems.StartTimeValue.fontSize, color: draggableItems.StartTimeValue.fontColor, fontWeight: draggableItems.StartTimeValue.fontWeight }}>{values.startTime}</Text>
                    </TouchableOpacity>
                  </Draggable>


                  <Draggable x={draggableItems.EndTime.x} y={draggableItems.EndTime.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('EndTime'); }}>
                      <Text style={{ fontSize: draggableItems.EndTime.fontSize, color: draggableItems.EndTime.fontColor, fontWeight: draggableItems.EndTime.fontWeight }}>Event End Time:</Text>
                    </TouchableOpacity>
                  </Draggable>
                  <Draggable x={draggableItems.EndTimeValue.x} y={draggableItems.EndTimeValue.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('EndTimeValue'); }}>
                      <Text style={{ fontSize: draggableItems.EndTimeValue.fontSize, color: draggableItems.EndTimeValue.fontColor, fontWeight: draggableItems.EndTimeValue.fontWeight }}>{values.endTime}</Text>
                    </TouchableOpacity>
                  </Draggable>


                  <Draggable x={draggableItems.EventVenue.x} y={draggableItems.EventVenue.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('EventVenue'); }}>
                      <Text style={{ fontSize: draggableItems.EventVenue.fontSize, color: draggableItems.EventVenue.fontColor, fontWeight: draggableItems.EventVenue.fontWeight }}>Event Venue:</Text>
                    </TouchableOpacity>
                  </Draggable>
                  <Draggable x={draggableItems.EventVenueValue.x} y={draggableItems.EventVenueValue.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('EventVenueValue'); }}>
                      <Text style={{ fontSize: draggableItems.EventVenueValue.fontSize, color: draggableItems.EventVenueValue.fontColor, fontWeight: draggableItems.EventVenueValue.fontWeight }}>{values.venue}</Text>
                    </TouchableOpacity>
                  </Draggable>


                  <Draggable x={draggableItems.MemberLimit.x} y={draggableItems.MemberLimit.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('MemberLimit'); }}>
                      <Text style={{ fontSize: draggableItems.MemberLimit.fontSize, color: draggableItems.MemberLimit.fontColor, fontWeight: draggableItems.MemberLimit.fontWeight }}>Event Member Limit:</Text>
                    </TouchableOpacity>
                  </Draggable>
                  <Draggable x={draggableItems.MemberLimitValue.x} y={draggableItems.MemberLimitValue.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('MemberLimitValue'); }}>
                      <Text style={{ fontSize: draggableItems.MemberLimitValue.fontSize, color: draggableItems.MemberLimitValue.fontColor, fontWeight: draggableItems.MemberLimitValue.fontWeight }}>{values.memberNumber}</Text>
                    </TouchableOpacity>
                  </Draggable>


                  <Draggable x={draggableItems.EventDetail.x} y={draggableItems.EventDetail.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('EventDetail'); }}>
                      <Text style={{ fontSize: draggableItems.EventDetail.fontSize, color: draggableItems.EventDetail.fontColor, fontWeight: draggableItems.EventDetail.fontWeight }}>Event Detail:</Text>
                    </TouchableOpacity>
                  </Draggable>
                  <Draggable x={draggableItems.EventDetailValue.x} y={draggableItems.EventDetailValue.y}>
                    <TouchableOpacity onPress={() => { setIsCustomFont(true); setCustomItem('EventDetailValue'); }}>
                      <Text style={{ fontSize: draggableItems.EventDetailValue.fontSize, color: draggableItems.EventDetailValue.fontColor, fontWeight: draggableItems.EventDetailValue.fontWeight }}>{values.eventDetail}</Text>
                    </TouchableOpacity>
                  </Draggable>
                 
                </ImageBackground>
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
  template: {
    width: 150,
    height: 200,
    borderColor: 'grey',
    borderWidth: 1.8,
    margin: 5
  },
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
    borderRadius: 30,
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