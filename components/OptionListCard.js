import React from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity } from 'react-native';

const OptionListCard = ({ option, navigation }) => {

  return (
    <View style={styles.cardContainer}>
      <Text>{option.districtID}</Text>
      <Text>{option.districtName}</Text>
    </View>

  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#F9F6F2', // Rice color
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    borderColor: 'gray', // Gray border color
    borderWidth: 4, // Border width
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventInfo: {
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default OptionListCard;