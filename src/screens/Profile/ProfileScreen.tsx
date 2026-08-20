import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useAppSelector } from '../../redux/hooks';
import { Colors, Fonts, Images } from '../../constants';
import { ArrowLeft, LogOut } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/navigationTypes';
import { env } from '../../config/env';
import { AuthService } from '../../services/auth/AuthService';

type Props = NativeStackScreenProps<AppStackParamList, 'Profile'>;

const ProfileScreen = ({ navigation }: Props) => {
  const user = useAppSelector(state => state.auth.user);

  const handleLogout = () => {
    Alert.alert('Alert', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          await AuthService.logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={20}
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <ArrowLeft size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <Image source={Images.User} resizeMode="contain" style={styles.image} />
        <Text style={styles.username}>{user?.displayName ?? 'Admin'}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => handleLogout()}
          style={styles.button}
        >
          <View style={styles.icon}>
            <LogOut size={14} />
          </View>

          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.version}>Version 1.0.0 ({env.defaultSiteId})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    lineHeight: 26 * 1.4,
    fontFamily: Fonts.NOTO_BOLD,
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  image: {
    width: 100,
    height: 100,
  },
  username: {
    fontSize: 21,
    lineHeight: 21 * 1.4,
    marginTop: 16,
    fontFamily: Fonts.NOTO_SEMI_BOLD,
    color: Colors.PRIMARY,
  },
  email: {
    fontSize: 16,
    lineHeight: 16 * 1.4,
    marginTop: 4,
    fontFamily: Fonts.NOTO_REGULAR,
    color: Colors.SECONDARY,
  },
  button: {
    paddingHorizontal: 20,
    backgroundColor: Colors.WHITE,
    paddingVertical: 12,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    marginTop: 20,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.BLUE_LIGHT,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: Fonts.NOTO_MEDIUM,
    color: Colors.PRIMARY,
  },
  version: {
    fontSize: 8,
    lineHeight: 8 * 1.4,
    fontFamily: Fonts.NOTO_REGULAR,
    color: Colors.SECONDARY,
    textAlign: 'left',
  },
});

export default ProfileScreen;
