import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import {
  TextInput,
  Button,
  Text,
  HelperText,
} from 'react-native-paper';

const BASE_URL = 'https://backend-img-vid.onrender.com';

export default function SignupScreen({ navigation }: any) {

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const passwordsMatch = () =>
    password === confirmPassword || confirmPassword === '';

  const handleSignup = async () => {

    if (!fullName || !username || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!passwordsMatch()) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name: fullName,
            username: username,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        Alert.alert(
          'Signup Failed',
          data.detail || 'Something went wrong'
        );

        return;
      }

      Alert.alert(
        'Success',
        'Account created successfully'
      );

      navigation.navigate('Login');

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

    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
      style={styles.container}
    >

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Join IMG-VID to start animating with AI
        </Text>

        {/* FULL NAME */}

        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />

        {/* USERNAME */}

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          autoCapitalize="none"
          style={styles.input}
          left={<TextInput.Icon icon="account-circle" />}
        />

        {/* EMAIL */}

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
        />

        {/* PASSWORD */}

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
        />

        {/* CONFIRM PASSWORD */}

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          mode="outlined"
          error={!passwordsMatch()}
          style={styles.input}
          left={<TextInput.Icon icon="lock-check" />}
        />

        <HelperText
          type="error"
          visible={!passwordsMatch()}
        >
          Passwords do not match!
        </HelperText>

        {/* SIGNUP BUTTON */}

        <Button
          mode="contained"
          onPress={handleSignup}
          loading={loading}
          disabled={
            loading ||
            !passwordsMatch()
          }
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Sign Up
        </Button>

        {/* LOGIN BUTTON */}

        <Button
          onPress={() =>
            navigation.navigate('Login')
          }
          style={styles.loginLink}
        >
          Already have an account? Login
        </Button>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollContainer: {
    padding: 25,
    paddingTop: 80,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
  },

  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 30,
  },

  input: {
    marginBottom: 10,
  },

  button: {
    marginTop: 20,
    borderRadius: 8,
  },

  buttonContent: {
    paddingVertical: 8,
  },

  loginLink: {
    marginTop: 15,
  },

});