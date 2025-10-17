
import React, { useState, useEffect, useRef } from 'react';

import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraComponent() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  
  const cameraRef = useRef(null);

  
  useEffect(() => {
    
    requestPermission();
  }, []);

  
  if (!permission) {
    return <View />; 
  }

  
  if (!permission.granted) {
    return (
      <View style={styles.container}> 
        <Text style={{ textAlign: 'center' }}>
          Precisamos da sua permissão para acessar a câmera
        </Text>
        
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  
  async function takePicture() {
    if (cameraRef.current) {
      
      const photo = await cameraRef.current.takePictureAsync();
      
      setCapturedPhoto(photo.uri);
      
      console.log(photo.uri);
    }
  }

  
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        
        <View style={styles.tirarOutra}>
          <Button title="Tirar Outra Foto" onPress={() => setCapturedPhoto(null)} />
        </View>
        
        <Image source={{ uri: capturedPhoto }} style={styles.preview} />
      </View>
    );
  }

  
  return (
    <View style={styles.container}>
      
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        
        <View style={styles.buttonContainer}>
          
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Virar Câmera</Text>
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Tirar Foto</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}


const styles = StyleSheet.create({
  tirarOutra: { 
    marginTop: 90 
  }, 
  container: { 
    flex: 1, 
    justifyContent: 'center' 
  }, 
  camera: { 
    flex: 1 
  }, 
  buttonContainer: {
    flex: 1,
    flexDirection: 'row', 
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1, 
    alignSelf: 'flex-end', 
    alignItems: 'center', 
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', 
  },
  preview: {
    flex: 1,
    resizeMode: 'contain', 
  }
});