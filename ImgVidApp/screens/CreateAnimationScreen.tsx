import React, { useState } from 'react';

import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';

import {
  Button,
  Card,
  Text,
  Portal,
  Modal,
  ActivityIndicator,
  Appbar,
  Menu,
} from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as ImagePicker from 'expo-image-picker';

const BASE_URL = 'https://backend-img-vid.onrender.com';

export default function CreateAnimationScreen({ navigation }: any) {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // =========================
  // MOTION DROPDOWN
  // =========================

  const [motion, setMotion] = useState('zoom');

  const [menuVisible, setMenuVisible] = useState(false);

  const motionOptions = [
    'zoom',
    'pan',
    'rotate',
    'slide-left',
    'slide-right',
    'up-down',
  ];

  // =========================
  // PICK IMAGE
  // =========================

  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {

      setSelectedImage(result.assets[0].uri);

    }
  };

  // =========================
  // GENERATE VIDEO
  // =========================

  const handleCreateAnimation = async () => {

    if (!selectedImage) {

      Alert.alert(
        'Error',
        'Please select an image'
      );

      return;
    }

    try {

      setShowModal(true);

      setIsProcessing(true);

      // =========================
      // GET TOKEN
      // =========================

      const token = await AsyncStorage.getItem(
        'token'
      );

      if (!token) {

        Alert.alert(
          'Error',
          'User not authenticated'
        );

        return;
      }

      // =========================
      // CREATE FORM DATA
      // =========================

      const formData = new FormData();

      formData.append('motion', motion);

      formData.append('frames', '8');

      formData.append('file', {
        uri: selectedImage,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any);

      // =========================
      // API REQUEST
      // =========================

      const response = await fetch(
        `${BASE_URL}/generate-video`,
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {

        Alert.alert(
          'Error',
          data.detail || 'Video generation failed'
        );

        return;
      }

      // =========================
      // SUCCESS
      // =========================

      Alert.alert(
        'Success',
        'Animation created successfully'
      );

      const newAnimation = {
        id: Date.now().toString(),
        motion: motion,
        videoUrl: data.video_url,
        date: new Date().toISOString(),
      };

      navigation.navigate(
        'Home',
        {
          newAnimation,
        }
      );

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Error',
        'Something went wrong'
      );

    } finally {

      setIsProcessing(false);

      setShowModal(false);

    }
  };

  return (

    <View style={styles.container}>

      {/* HEADER */}

      <Appbar.Header>

        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#6200ee"
        />

        <Appbar.Content title="Create Animation" />

      </Appbar.Header>

      <ScrollView style={styles.content}>

        <View style={styles.innerContent}>

          {/* IMAGE CARD */}

          <Card style={styles.card}>

            <Card.Content>

              <Text style={styles.cardTitle}>
                1. Select Image
              </Text>

              <Button
                mode="outlined"
                onPress={pickImage}
                style={styles.button}
              >
                {selectedImage
                  ? 'Change Image'
                  : 'Choose Image'}
              </Button>

              {selectedImage && (

                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                />

              )}

            </Card.Content>

          </Card>

          {/* MOTION CARD */}

          <Card style={styles.card}>

            <Card.Content>

              <Text style={styles.cardTitle}>
                2. Select Motion Type
              </Text>

              <Menu
                visible={menuVisible}
                onDismiss={() =>
                  setMenuVisible(false)
                }
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() =>
                      setMenuVisible(true)
                    }
                  >
                    {motion}
                  </Button>
                }
              >

                {motionOptions.map((item) => (

                  <Menu.Item
                    key={item}
                    onPress={() => {

                      setMotion(item);

                      setMenuVisible(false);

                    }}
                    title={item}
                  />

                ))}

              </Menu>

            </Card.Content>

          </Card>

          {/* CREATE BUTTON */}

          <Button
            mode="contained"
            onPress={handleCreateAnimation}
            style={styles.createButton}
            disabled={!selectedImage}
          >
            Create Animation
          </Button>

        </View>

        {/* LOADING MODAL */}

        <Portal>

          <Modal
            visible={showModal}
            dismissable={false}
            contentContainerStyle={styles.modal}
          >

            <View style={styles.modalContent}>

              <ActivityIndicator
                animating={true}
                size="large"
                color="#6200ee"
              />

              <Text style={styles.modalText}>
                Processing your animation...
              </Text>

              <Text style={styles.modalSubText}>
                This may take a few moments
              </Text>

            </View>

          </Modal>

        </Portal>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    flex: 1,
  },

  innerContent: {
    padding: 20,
  },

  card: {
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  button: {
    marginBottom: 15,
  },

  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
  },

  createButton: {
    marginTop: 20,
    padding: 8,
    backgroundColor: '#6200ee',
  },

  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },

  modalContent: {
    alignItems: 'center',
  },

  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },

  modalSubText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
    textAlign: 'center',
  },

});