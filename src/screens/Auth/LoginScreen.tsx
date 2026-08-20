import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/navigationTypes';
import { AuthService } from '../../services/auth/AuthService';
import { getAuthErrorMessage } from '../../utils/firebaseError';
import { Colors, Fonts, Images } from '../../constants';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicTapCount, setMagicTapCount] = useState(0);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Alert', 'Please enter your email.');
      return;
    }

    if (!password) {
      Alert.alert('Alert', 'Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      await AuthService.login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleTap = () => {
    const tap = magicTapCount + 1;
    setMagicTapCount(tap);

    if (tap === 7) {
      setShowRegister(true);
      setMagicTapCount(0);
    }
  };

  useEffect(() => {
    if (__DEV__) {
      setEmail('gowthamcodes@gmail.com');
      setPassword('Admin*123');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => handleTap()}>
        <Image source={Images.Logo} resizeMode="contain" style={styles.logo} />
      </Pressable>

      <Text style={styles.title}>Construction Expense</Text>
      <Text style={styles.subtitle}>Manage your construction costs</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={'#a6a09b'}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        placeholderTextColor={'#a6a09b'}
        onChangeText={setPassword}
      />

      <Pressable
        style={styles.button}
        disabled={loading}
        onPress={() => handleLogin()}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing in...' : 'Login'}
        </Text>
      </Pressable>

      <Pressable onPress={() => {}}>
        <Text style={styles.link}>Forgot password?</Text>
      </Pressable>

      {showRegister && (
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Create Account</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'center',
    backgroundColor: Colors.BACKGROUND,
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: Colors.PRIMARY,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.PRIMARY,
    fontFamily: Fonts.NOTO_SEMI_BOLD,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 24,
    color: Colors.SECONDARY,
  },
  input: {
    height: 52,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GRAY_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    color: Colors.BLACK,
    fontFamily: Fonts.NOTO_MEDIUM,
  },
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: Fonts.NOTO_SEMI_BOLD,
  },
  link: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    fontFamily: Fonts.NOTO_REGULAR,
  },
});
