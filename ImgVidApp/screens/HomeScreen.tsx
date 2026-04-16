import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { FAB, Card, Text, Appbar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  // Mock data for history (This will come from your Django Backend)
  const [history, setHistory] = useState([
    { id: '1', prompt: 'Logo Animation: Zoom In', date: '2026-03-24', status: 'Completed' },
    { id: '2', prompt: 'Hospital Interior: 3D Pan', date: '2026-03-23', status: 'Completed' },
  ]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    // logic to upload to Django goes here
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
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

      <FAB icon="plus" style={styles.fab} label="New Animation" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: 'bold', padding: 20 },
  card: { marginHorizontal: 20, marginBottom: 15 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#6200ee' }
});