import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    // Simulate checking auth status or loading Panda-70M assets
    setTimeout(() => {
      navigation.replace('Login'); 
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>IMG-VID</Text>
      <Text style={styles.subText}>AI Video Generation Engine</Text>
      <ActivityIndicator animating={true} color="#6200ee" size="large" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logoText: { fontSize: 32, fontWeight: 'bold', letterSpacing: 4, color: '#6200ee' },
  subText: { fontSize: 12, color: 'gray', marginTop: 5 }
});