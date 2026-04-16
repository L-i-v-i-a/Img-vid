import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { FAB, Card, Text, Appbar } from 'react-native-paper';

export default function HomeScreen({ navigation, route }: any) {
  // Mock data for history (This will come from your Django Backend)
  const [history, setHistory] = useState([
    { id: '1', prompt: 'Logo Animation: Zoom In', date: '2026-03-24', status: 'Completed' },
    { id: '2', prompt: 'Hospital Interior: 3D Pan', date: '2026-03-23', status: 'Completed' },
  ]);

  // Add new animation to history when coming from CreateAnimationScreen
  useEffect(() => {
    if (route.params?.newAnimation) {
      setHistory(prevHistory => [route.params.newAnimation, ...prevHistory]);
      // Clear the params to avoid adding duplicates
      navigation.setParams({ newAnimation: undefined });
    }
  }, [route.params?.newAnimation, navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Action icon="account-circle" onPress={() => navigation.navigate('Profile')} color="#6200ee" />
        <Appbar.Content title="My AI Studio" />
      </Appbar.Header>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.header}>Generation History</Text>}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.prompt} subtitle={item.date} />
            <Card.Content>
              <Text variant="bodySmall">Status: {item.status}</Text>
            </Card.Content>
          </Card>
        )}
      />

      <FAB icon="plus" style={styles.fab} label="New Animation" onPress={() => navigation.navigate('CreateAnimation')} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: 'bold', padding: 20 },
  card: { marginHorizontal: 20, marginBottom: 15 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#6200ee' }
});