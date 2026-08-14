import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Colors, Fonts, Images } from '../../constants';

const Loader = () => {
  return (
    <Modal visible={true} transparent>
      <View style={styles.container}>
        <View style={styles.overlay}>
          <ActivityIndicator color={Colors.SECONDARY} size={'large'} />
          <Text style={styles.message}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  overlay: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    marginRight: 6,
    height: 48,
    width: 48,
    alignSelf: 'center',
  },
  message: {
    flexWrap: 'wrap',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: Colors.BLACK,
    fontFamily: Fonts.NOTO_SEMI_BOLD,
    marginLeft: 12,
  },
});

export default Loader;
