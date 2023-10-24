import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image, Pressable, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';

export default function BottomBar({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>

      </View>
      <View style={styles.bottomBar}>

        <TouchableOpacity onPress={() => navigation.navigate('Guild')} style={styles.button}>
          <Text style={styles.icon}>Guild</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Mission')} style={styles.button}>
          <Text style={styles.icon}>Mission</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
          <Text style={styles.icon}>Profile</Text>
        </TouchableOpacity>




      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F5DC', // Set the background color to "rice" color
    height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    color: 'gray', // Set the text color to gray
    fontWeight: 'bold', // Make the text bold
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'grey',
  },
});