import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';

export default function SignupScreen({ navigation }: any) {
  // State for user details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple validation logic
  const passwordsMatch = () => password === confirmPassword || confirmPassword === '';

  const handleSignup = async () => {
    setLoading(true);
    // Logic: hit your Django API endpoint /api/auth/register/
    // After success:
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Home');
    }, 2000);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join IMG-VID to start animating with AI</Text>

        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />

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

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
        />

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
        <HelperText type="error" visible={!passwordsMatch()}>
          Passwords do not match!
        </HelperText>

        <Button 
          mode="contained" 
          onPress={handleSignup} 
          loading={loading}
          disabled={loading || !passwordsMatch() || !email}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Sign Up
        </Button>

        <Button 
          onPress={() => navigation.navigate('Login')} 
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