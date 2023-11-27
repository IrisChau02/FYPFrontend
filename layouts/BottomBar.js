import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image, Pressable, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function BottomBar({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>

      </View>
      <View style={styles.bottomBar}>

        <TouchableOpacity onPress={() => navigation.navigate('Guild')} style={styles.button}>
          <View style={styles.iconContainer}>
            <AntDesign name="team" size={24} color="#F5F5DC" />
            <Text style={styles.iconText}>Guild</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Mission')} style={styles.button}>
          <View style={styles.iconContainer}>
            <AntDesign name="calendar" size={24} color="#F5F5DC" />
            <Text style={styles.iconText}>Mission</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
          <View style={styles.iconContainer}>
            <AntDesign name="user" size={24} color="#F5F5DC" />
            <Text style={styles.iconText}>Profile</Text>
          </View>
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
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#728C69',//F5F5DC
    height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
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
});