import React from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity } from 'react-native';

const defaultLogoImage = require('../assets/defaultLogo.png');

const GuildCard = ({ guild, navigation }) => {
  //{ uri: guild.guildLogo }
  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <Image source={{ uri: `data:image/jpeg;base64,${guild.guildLogo}` }} style={styles.logo} /> 
        <View style={styles.column}>
          <Text style={styles.guildName}>Name: {guild.guildName}</Text>
          <Text style={styles.guildInfo}>Detail: {guild.guildIntro}</Text>
          <Text style={styles.guildDetails}>
            Level: {guild.level} | Members: {guild.memberNo}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('GuildDetail', { guild: guild })} style={styles.button}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1, // Use flex: 1 to make the card container flexible in height
    backgroundColor: '#F9F6F2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    borderColor: 'gray',
    borderWidth: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  column: {
    flex: 1, // Use flex: 1 to make the column take up remaining horizontal space
    marginLeft: 16,
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
  button: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GuildCard;