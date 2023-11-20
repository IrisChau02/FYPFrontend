import React from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity } from 'react-native';

const GuildEventCard = ({ event, navigation }) => {
  return (
    <View style={styles.cardContainer}>


<Text style={styles.eventName}>{event.eventName}</Text>
      <Text style={styles.eventInfo}>Date: {event.eventDate}</Text>
      <Text style={styles.eventInfo}>Time: {event.startTime} - {event.endTime}</Text>
      <Text style={styles.eventInfo}>Venue: {event.venue}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>


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
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GuildEventCard;