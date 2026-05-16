import React, { useState } from 'react';

import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  TextInput,
  Button,
  Text,
} from 'react-native-paper';

const BASE_URL = 'https://backend-img-vid.onrender.com';

export default function LoginScreen({ navigation }: any) {

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    if (!emailOrUsername || !password) {
      Alert.alert(
        'Error',
        'Please fill all fields'
      );
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email_or_username: emailOrUsername,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        Alert.alert(
          'Login Failed',
          data.detail || 'Invalid credentials'
        );

        return;
      }

      // =========================
      // SAVE TOKEN
      // =========================

      await AsyncStorage.setItem(
        'token',
        data.access_token
      );

      // SAVE USER INFO

      await AsyncStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      Alert.alert(
        'Success',
        'Login successful'
      );

      navigation.navigate('Home');

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Error',
        'Network error occurred'
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Welcome Back
      </Text>

      {/* EMAIL / USERNAME */}

      <TextInput
        label="Email or Username"
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        left={
          <TextInput.Icon icon="account" />
        }
      />

      {/* PASSWORD */}

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
        left={
          <TextInput.Icon icon="lock" />
        }
      />

      {/* LOGIN BUTTON */}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Login
      </Button>

      {/* SIGNUP BUTTON */}

      <Button
        onPress={() =>
          navigation.navigate('Signup')
        }
      >
        Don't have an account? Sign up
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#6200ee',
  },

  input: {
    marginBottom: 15,
  },

  button: {
    marginTop: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

});