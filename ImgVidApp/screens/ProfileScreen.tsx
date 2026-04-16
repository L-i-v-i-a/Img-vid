import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Avatar, Button, Divider, List } from 'react-native-paper';

export default function ProfileScreen({ navigation }: any) {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2024',
    totalAnimations: 12,
    completedAnimations: 10,
    pendingAnimations: 2
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileHeader}>
            <Avatar.Text size={80} label={user.name.charAt(0)} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Statistics */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Animation Statistics</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.totalAnimations}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.completedAnimations}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.pendingAnimations}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Settings Menu */}
        <Card style={styles.menuCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Settings</Text>
            <List.Item
              title="Edit Profile"
              description="Update your personal information"
              left={(props) => <List.Icon {...props} icon="account-edit" />}
              onPress={() => console.log('Edit profile pressed')}
            />
            <Divider />
            <List.Item
              title="Notifications"
              description="Manage notification preferences"
              left={(props) => <List.Icon {...props} icon="bell" />}
              onPress={() => console.log('Notifications pressed')}
            />
            <Divider />
            <List.Item
              title="Privacy Settings"
              description="Control your privacy and data"
              left={(props) => <List.Icon {...props} icon="shield-account" />}
              onPress={() => console.log('Privacy pressed')}
            />
            <Divider />
            <List.Item
              title="Help & Support"
              description="Get help and contact support"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              onPress={() => console.log('Help pressed')}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button 
          mode="outlined" 
          onPress={() => console.log('Logout pressed')}
          style={styles.logoutButton}
          textColor="#d32f2f"
        >
          Logout
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  profileCard: { marginBottom: 20 },
  profileHeader: { alignItems: 'center', paddingVertical: 20 },
  avatar: { marginBottom: 15 },
  userInfo: { alignItems: 'center' },
  userName: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  userEmail: { fontSize: 16, color: 'gray', marginBottom: 5 },
  joinDate: { fontSize: 14, color: '#757575' },
  statsCard: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#6200ee' },
  statLabel: { fontSize: 14, color: 'gray', marginTop: 5 },
  menuCard: { marginBottom: 20 },
  logoutButton: { marginTop: 20, marginBottom: 30 }
});
