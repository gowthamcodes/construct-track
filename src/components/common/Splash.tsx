import React from 'react';
import { View, StyleSheet, Text, Image, StatusBar } from 'react-native';
import { Colors, Fonts, Images } from '../../constants';

const Splash = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.PRIMARY}
        translucent
      />
      <Image source={Images.Logo} resizeMode={'contain'} style={styles.image} />
      <Text style={styles.title}>Construct Track</Text>
      <Text style={styles.subtitle}>Manage your construction costs</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
  },
  image: {
    height: 150,
    width: 150,
  },
  title: {
    color: Colors.WHITE,
    fontSize: 32,
    lineHeight: 32 * 1.4,
    fontFamily: Fonts.NOTO_SEMI_BOLD,
    paddingVertical: 6,
    marginTop: 4,
  },
  subtitle: {
    color: Colors.SECONDARY,
    fontSize: 14,
    lineHeight: 14 * 1.4,
    fontFamily: Fonts.NOTO_MEDIUM,
  },
});

export default Splash;
