import React, { useState } from 'react';
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Alert', 'Please complete all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Alert', 'Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Alert', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await AuthService.register({ name, email, password });
    } catch (error) {
      Alert.alert('Alert', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={Images.Logo} resizeMode="contain" style={styles.logo} />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Manage your construction expenses</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        placeholderTextColor={'#a6a09b'}
        onChangeText={setName}
      />

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
        placeholderTextColor={'#a6a09b'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        placeholderTextColor={'#a6a09b'}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Pressable
        style={styles.button}
        disabled={loading}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating...' : 'Create Account'}
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Back to Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
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
