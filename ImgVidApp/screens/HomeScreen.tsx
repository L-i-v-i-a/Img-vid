import React, { useEffect, useState } from 'react';

import {
  View,
  FlatList,
  StyleSheet,
  Linking,
  Alert,
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
  Avatar,
  Divider,
} from 'react-native-paper';

import { MaterialIcons } from '@expo/vector-icons';

const BASE_URL = 'https://backend-img-vid.onrender.com';

export default function HomeScreen({ navigation }: any) {

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

      const token = await AsyncStorage.getItem('token');

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

      setHistory((data.videos || []).reverse());

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

      await Linking.openURL(
        encodeURI(fullUrl)
      );

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
  // GET MOTION ICON
  // ==========================================

  const getMotionIcon = (motion: string) => {

    switch (motion) {

      case 'zoom':
        return 'zoom-in-map';

      case 'zoom_out':
        return 'zoom-out-map';

      case 'rotate':
        return 'rotate-right';

      case 'pan_left':
        return 'keyboard-arrow-left';

      case 'pan_right':
        return 'keyboard-arrow-right';

      case 'pan_up':
        return 'keyboard-arrow-up';

      case 'pan_down':
        return 'keyboard-arrow-down';

      case 'shake':
        return 'vibration';

      default:
        return 'movie';
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

        <Text style={styles.loadingText}>
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

      <Appbar.Header style={styles.appbar}>

        <Appbar.Action
          icon="account-circle"
          onPress={() =>
            navigation.navigate('Profile')
          }
        />

        <Appbar.Content
          title="My AI Studio"
          titleStyle={{
            fontWeight: 'bold',
          }}
        />

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

        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <View style={styles.headerContainer}>

            <Text style={styles.header}>
              AI Video History
            </Text>

            <Text style={styles.subHeader}>
              Your generated cinematic animations
            </Text>

          </View>
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>

            <Avatar.Icon
              size={90}
              icon="movie-open-outline"
              style={styles.emptyIcon}
            />

            <Text style={styles.emptyText}>
              No animations yet
            </Text>

            <Text style={styles.emptySubText}>
              Start creating AI powered videos
            </Text>

          </View>
        }

        renderItem={({ item, index }) => (

          <Card style={styles.card}>

            <Card.Content>

              {/* ========================================== */}
              {/* TOP */}
              {/* ========================================== */}

              <View style={styles.topRow}>

                <View style={styles.iconContainer}>

                  <MaterialIcons
                    name={
                      getMotionIcon(item.motion) as any
                    }
                    size={34}
                    color="#6200ee"
                  />

                </View>

                <View style={{ flex: 1 }}>

                  <Text style={styles.motionTitle}>
                    {item.motion
                      ?.replace('_', ' ')
                      ?.toUpperCase()}
                  </Text>

                  <Text style={styles.videoText}>
                    AI Generated Animation
                  </Text>

                </View>

                <Chip
                  icon="check-circle"
                  style={styles.completedChip}
                  textStyle={{
                    color: '#2e7d32',
                    fontWeight: '600',
                  }}
                >
                  Ready
                </Chip>

              </View>

              <Divider style={styles.divider} />

              {/* ========================================== */}
              {/* STATS */}
              {/* ========================================== */}

              <View style={styles.statsRow}>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>
                    Frames
                  </Text>

                  <Text style={styles.statValue}>
                    {item.frames || 8}
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>
                    Status
                  </Text>

                  <Text style={styles.statValue}>
                    Completed
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>
                    Type
                  </Text>

                  <Text style={styles.statValue}>
                    MP4
                  </Text>
                </View>

              </View>

              {/* ========================================== */}
              {/* VIDEO BOX */}
              {/* ========================================== */}

              <View style={styles.videoPreviewBox}>

                <MaterialIcons
                  name="play-circle-filled"
                  size={65}
                  color="#6200ee"
                />

                <Text style={styles.previewTitle}>
                  AI Animation Ready
                </Text>

                <Text style={styles.previewSub}>
                  Tap watch to play generated video
                </Text>

              </View>

              {/* ========================================== */}
              {/* BUTTONS */}
              {/* ========================================== */}

              <View style={styles.actionsRow}>

                <Button
                  mode="contained"
                  icon="play"
                  onPress={() =>
                    openVideo(item.video_path)
                  }
                  style={styles.watchButton}
                  contentStyle={{
                    paddingVertical: 6,
                  }}
                >
                  Watch
                </Button>

                <Button
                  mode="outlined"
                  icon="delete"
                  textColor="#d32f2f"
                  onPress={() =>
                    deleteVideo(item.video_path)
                  }
                  style={styles.deleteButton}
                  contentStyle={{
                    paddingVertical: 6,
                  }}
                >
                  Delete
                </Button>

              </View>

            </Card.Content>

          </Card>
        )}

        contentContainerStyle={{
          paddingBottom: 120,
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
    backgroundColor: '#f4f4f8',
  },

  appbar: {
    backgroundColor: 'white',
    elevation: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f8',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: 'gray',
  },

  headerContainer: {
    padding: 20,
    paddingBottom: 10,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },

  subHeader: {
    marginTop: 5,
    color: '#666',
    fontSize: 15,
  },

  emptyContainer: {
    marginTop: 120,
    alignItems: 'center',
  },

  emptyIcon: {
    backgroundColor: '#ede7f6',
  },

  emptyText: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
  },

  emptySubText: {
    marginTop: 6,
    color: 'gray',
    fontSize: 15,
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 24,
    backgroundColor: 'white',
    elevation: 3,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: '#f3e5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  motionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },

  videoText: {
    color: 'gray',
    marginTop: 4,
  },

  completedChip: {
    backgroundColor: '#e8f5e9',
  },

  divider: {
    marginVertical: 18,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statBox: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 4,
    alignItems: 'center',
  },

  statLabel: {
    color: 'gray',
    fontSize: 13,
  },

  statValue: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111',
  },

  videoPreviewBox: {
    marginTop: 22,
    borderRadius: 20,
    backgroundColor: '#f7f2ff',
    paddingVertical: 28,
    alignItems: 'center',
  },

  previewTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },

  previewSub: {
    marginTop: 5,
    color: 'gray',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  actionsRow: {
    flexDirection: 'row',
    marginTop: 22,
    justifyContent: 'space-between',
  },

  watchButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 14,
    backgroundColor: '#6200ee',
  },

  deleteButton: {
    flex: 1,
    borderRadius: 14,
    borderColor: '#ef9a9a',
  },

  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
    borderRadius: 100,
  },

});