import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Button, TextInput, Card, Text, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function CreateAnimationScreen({ navigation }: any) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleCreateAnimation = async () => {
    if (!selectedImage || !prompt.trim()) {
      alert('Please select an image and enter a prompt');
      return;
    }

    setShowModal(true);
    setIsProcessing(true);

    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setShowModal(false);
      
      // Create new animation entry
      const newAnimation = {
        id: Date.now().toString(),
        prompt: prompt,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed'
      };
      
      // Pass the new animation back to HomeScreen
      navigation.navigate('Home', { newAnimation });
    }, 3000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Animation</Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>1. Select Image</Text>
            <Button 
              mode="outlined" 
              onPress={pickImage} 
              style={styles.button}
            >
              {selectedImage ? 'Change Image' : 'Choose Image'}
            </Button>
            
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>2. Enter Animation Prompt</Text>
            <TextInput
              label="Describe your animation..."
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={4}
              style={styles.textInput}
              mode="outlined"
            />
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          onPress={handleCreateAnimation}
          style={styles.createButton}
          disabled={!selectedImage || !prompt.trim()}
        >
          Create Animation
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showModal}
          dismissable={false}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalContent}>
            <ActivityIndicator animating={true} size="large" color="#6200ee" />
            <Text style={styles.modalText}>Processing your animation...</Text>
            <Text style={styles.modalSubText}>This may take a few moments</Text>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  card: { marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  button: { marginBottom: 15 },
  previewImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8,
    resizeMode: 'contain'
  },
  textInput: { marginBottom: 10 },
  createButton: { 
    marginTop: 20, 
    padding: 8,
    backgroundColor: '#6200ee'
  },
  modal: { 
    backgroundColor: 'white', 
    padding: 20, 
    margin: 20,
    borderRadius: 12
  },
  modalContent: { alignItems: 'center' },
  modalText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 20,
    textAlign: 'center'
  },
  modalSubText: { 
    fontSize: 14, 
    color: 'gray', 
    marginTop: 10,
    textAlign: 'center'
  }
});
