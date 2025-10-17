// CameraComponent.js
// Importações básicas do React e React Native
import React, { useState, useEffect, useRef } from 'react';
// Componentes do React Native que serão usados na tela
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
// Importação da câmera do Expo
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraComponent() {
  // Estado que define se a câmera será frontal ("front") ou traseira ("back")
  const [facing, setFacing] = useState('back');

  // Hook do Expo para lidar com permissões da câmera
  // permission = estado da permissão
  // requestPermission = função para pedir permissão ao usuário
  const [permission, requestPermission] = useCameraPermissions();

  // Estado para guardar a foto capturada (se existir)
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  // Referência para acessar diretamente os métodos da câmera (como tirar foto)
  const cameraRef = useRef(null);

  // useEffect é executado quando o componente é montado
  useEffect(() => {
    // Solicita permissão automaticamente assim que o componente é carregado
    requestPermission();
  }, []);

  // Função para alternar entre câmera frontal e traseira
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Função para tirar uma foto
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedPhoto(photo.uri);
      } catch (error) {
        console.log('Erro ao tirar foto:', error);
      }
    }
  };

  // Função para tirar uma nova foto
  const retakePicture = () => {
    setCapturedPhoto(null);
  };

  // Se a permissão ainda não foi concedida
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permissão para acessar a câmera...</Text>
      </View>
    );
  }

  // Se o usuário negou a permissão
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para acessar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedPhoto ? (
        // Mostra a foto capturada
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.preview} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={retakePicture}>
              <Text style={styles.text}>Tirar Outra Foto</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Mostra a câmera
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Virar Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Text style={styles.text}>Tirar Foto</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  captureButton: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.5)',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});