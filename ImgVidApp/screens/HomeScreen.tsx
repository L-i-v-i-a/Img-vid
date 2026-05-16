import React, { useEffect, useState } from 'react';

import {
  View,
  FlatList,
  StyleSheet,
  Linking,
  Alert,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  FAB,
  Card,
  Text,
  Appbar,
  ActivityIndicator,
  Chip,
  Button,
} from 'react-native-paper';

const BASE_URL = 'https://backend-img-vid.onrender.com';

export default function HomeScreen({
  navigation,
}: any) {

  // ==========================================
  // STATES
  // ==========================================

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD HISTORY
  // ==========================================

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem(
        'token'
      );

      if (!token) {
        Alert.alert(
          'Session Expired',
          'Please login again'
        );

        navigation.replace('Login');

        return;
      }

      const response = await fetch(
        `${BASE_URL}/history`,
        {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Error',
          data.detail || 'Failed to load history'
        );

        return;
      }

      // Reverse latest first
      const formattedHistory = (
        data.videos || []
      ).reverse();

      setHistory(formattedHistory);

    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // OPEN VIDEO
  // ==========================================

  const openVideo = async (
    videoPath: string
  ) => {
    try {

      let cleanPath = videoPath;

      if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
      }

      const fullUrl = `${BASE_URL}/${cleanPath}`;

      await Linking.openURL(fullUrl);

    } catch (error) {
      Alert.alert(
        'Error',
        'Could not open video'
      );
    }
  };

  // ==========================================
  // DELETE VIDEO
  // ==========================================

  const deleteVideo = async (
    videoPath: string
  ) => {
    try {

      const token = await AsyncStorage.getItem(
        'token'
      );

      if (!token) return;

      const videoName =
        videoPath.split('/').pop();

      const response = await fetch(
        `${BASE_URL}/delete-video/${videoName}`,
        {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Error',
          data.detail || 'Delete failed'
        );

        return;
      }

      Alert.alert(
        'Success',
        'Video deleted successfully'
      );

      loadHistory();

    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Failed to delete video'
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#6200ee"
        />

        <Text style={{ marginTop: 10 }}>
          Loading animations...
        </Text>
      </View>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <View style={styles.container}>

      {/* ========================================== */}
      {/* APPBAR */}
      {/* ========================================== */}

      <Appbar.Header>

        <Appbar.Action
          icon="account-circle"
          onPress={() =>
            navigation.navigate('Profile')
          }
          color="#6200ee"
        />

        <Appbar.Content title="My AI Studio" />

        <Appbar.Action
          icon="refresh"
          onPress={loadHistory}
        />
      </Appbar.Header>

      {/* ========================================== */}
      {/* HISTORY */}
      {/* ========================================== */}

      <FlatList
        data={history}

        keyExtractor={(item, index) =>
          index.toString()
        }

        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.header}>
              Generation History
            </Text>

            <Text style={styles.subHeader}>
              Your AI generated animations
            </Text>
          </View>
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No animations yet
            </Text>

            <Text style={styles.emptySubText}>
              Create your first AI animation
            </Text>
          </View>
        }

        renderItem={({ item }) => (

          <Card style={styles.card}>

            <Card.Content>

              <View style={styles.cardTop}>

                <View style={{ flex: 1 }}>

                  <Text style={styles.motionText}>
                    Motion: {item.motion}
                  </Text>

                  <Text style={styles.framesText}>
                    Frames: {item.frames}
                  </Text>

                </View>

                <Chip
                  icon="check-circle"
                  style={styles.completedChip}
                >
                  Completed
                </Chip>

              </View>

              {/* IMAGE PREVIEW */}

              {item.image_path && (
                <Image
                  source={{
                    uri: `${BASE_URL}/${item.image_path}`,
                  }}
                  style={styles.previewImage}
                />
              )}

              {/* ACTION BUTTONS */}

              <View style={styles.actionsRow}>

                <Button
                  mode="contained"
                  icon="play"
                  onPress={() =>
                    openVideo(item.video_path)
                  }
                  style={styles.watchButton}
                >
                  Watch
                </Button>

                <Button
                  mode="outlined"
                  icon="delete"
                  textColor="red"
                  onPress={() =>
                    deleteVideo(item.video_path)
                  }
                >
                  Delete
                </Button>

              </View>

            </Card.Content>

          </Card>
        )}

        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />

      {/* ========================================== */}
      {/* FAB */}
      {/* ========================================== */}

      <FAB
        icon="plus"
        style={styles.fab}
        label="New Animation"
        onPress={() =>
          navigation.navigate(
            'CreateAnimation'
          )
        }
      />

    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerContainer: {
    padding: 20,
    paddingBottom: 10,
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  subHeader: {
    color: 'gray',
    marginTop: 5,
  },

  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  emptySubText: {
    color: 'gray',
    marginTop: 5,
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  motionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  framesText: {
    marginTop: 5,
    color: 'gray',
  },

  completedChip: {
    backgroundColor: '#e8f5e9',
  },

  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginTop: 15,
    resizeMode: 'cover',
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  watchButton: {
    backgroundColor: '#6200ee',
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },

});