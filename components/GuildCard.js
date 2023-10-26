import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const GuildCard = ({ guild }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: guild.guildLogo }} style={styles.logo} />
      <Text style={styles.guildName}>{guild.guildName}</Text>
      <Text style={styles.guildInfo}>{guild.guildInto}</Text>
      <Text style={styles.guildDetails}>Level: {guild.level} | Members: {guild.memberNo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  guildName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  guildInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  guildDetails: {
    fontSize: 14,
    color: 'gray',
  },
});

export default GuildCard;