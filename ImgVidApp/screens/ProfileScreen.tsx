import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Appbar,
  Card,
  Text,
  Avatar,
  Button,
  Divider,
  List,
  ActivityIndicator,
} from 'react-native-paper';

const BASE_URL = 'https://backend-img-vid.onrender.com';

export default function ProfileScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
  });

  const [history, setHistory] = useState<any[]>([]);

  // ==========================================
  // LOAD PROFILE + HISTORY
  // ==========================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Session Expired', 'Please login again');

        navigation.replace('Login');
        return;
      }

      // ==========================================
      // GET PROFILE
      // ==========================================

      const profileResponse = await fetch(
        `${BASE_URL}/profile`,
        {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        Alert.alert(
          'Error',
          profileData.detail || 'Failed to load profile'
        );
        return;
      }

      setUser(profileData.user);

      // ==========================================
      // GET HISTORY
      // ==========================================

      const historyResponse = await fetch(
        `${BASE_URL}/history`,
        {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      const historyData = await historyResponse.json();

      if (!historyResponse.ok) {
        Alert.alert(
          'Error',
          historyData.detail || 'Failed to load history'
        );
        return;
      }

      setHistory(historyData.videos || []);
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
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');

      navigation.replace('Login');
    } catch (error) {
      console.log(error);
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
          Loading profile...
        </Text>
      </View>
    );
  }

  // ==========================================
  // COMPLETED COUNT
  // ==========================================

  const completedAnimations = history.length;

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#6200ee"
        />

        <Appbar.Content title="Profile" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* ========================================== */}
        {/* PROFILE HEADER */}
        {/* ========================================== */}

        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileHeader}>
            <Avatar.Text
              size={80}
              label={user.name?.charAt(0) || 'U'}
              style={styles.avatar}
            />

            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user.name}
              </Text>

              <Text style={styles.username}>
                @{user.username}
              </Text>

              <Text style={styles.userEmail}>
                {user.email}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* ========================================== */}
        {/* STATS */}
        {/* ========================================== */}

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              Animation Statistics
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {history.length}
                </Text>

                <Text style={styles.statLabel}>
                  Total
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {completedAnimations}
                </Text>

                <Text style={styles.statLabel}>
                  Completed
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {history.length > 0 ? 'AI' : '0'}
                </Text>

                <Text style={styles.statLabel}>
                  Generated
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* ========================================== */}
        {/* HISTORY */}
        {/* ========================================== */}

        <Card style={styles.historyCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              Recent Animations
            </Text>

            {history.length === 0 ? (
              <Text style={styles.emptyText}>
                No animations generated yet
              </Text>
            ) : (
              history.map((item, index) => (
                <View key={index}>
                  <List.Item
                    title={`Motion: ${item.motion}`}
                    description={`Frames: ${item.frames}`}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon="video"
                      />
                    )}
                    right={() => (
                      <Text style={styles.statusText}>
                        Completed
                      </Text>
                    )}
                  />

                  <Divider />
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* ========================================== */}
        {/* SETTINGS */}
        {/* ========================================== */}

        <Card style={styles.menuCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              Settings
            </Text>

            <List.Item
              title="Refresh Profile"
              description="Reload your profile information"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="refresh"
                />
              )}
              onPress={loadProfile}
            />

            <Divider />

            <List.Item
              title="Create Animation"
              description="Generate a new AI animation"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="plus-circle"
                />
              )}
              onPress={() =>
                navigation.navigate(
                  'CreateAnimation'
                )
              }
            />
          </Card.Content>
        </Card>

        {/* ========================================== */}
        {/* LOGOUT */}
        {/* ========================================== */}

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor="#d32f2f"
        >
          Logout
        </Button>
      </ScrollView>
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

  content: {
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    marginBottom: 20,
    borderRadius: 15,
  },

  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  avatar: {
    marginBottom: 15,
    backgroundColor: '#6200ee',
  },

  userInfo: {
    alignItems: 'center',
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  username: {
    fontSize: 16,
    color: '#6200ee',
    marginBottom: 5,
  },

  userEmail: {
    fontSize: 16,
    color: 'gray',
  },

  statsCard: {
    marginBottom: 20,
    borderRadius: 15,
  },

  historyCard: {
    marginBottom: 20,
    borderRadius: 15,
  },

  menuCard: {
    marginBottom: 20,
    borderRadius: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },

  statLabel: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },

  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 10,
  },

  statusText: {
    color: 'green',
    alignSelf: 'center',
    marginRight: 10,
    fontWeight: 'bold',
  },

  logoutButton: {
    marginTop: 10,
    marginBottom: 40,
    borderColor: '#d32f2f',
  },
});