import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, Text, Image, Modal, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import * as photoService from '../../api/services/photoService';
import * as patientService from '../../api/services/patientService';
import { API_URL } from '../../api/client';
import {
  PhotoCard,
  FAB,
  LoadingSpinner,
  EmptyState,
  Badge,
  Button,
  TextInput,
  IconButton,
} from '../../components';

export default function PhotoListScreen({ navigation }) {
  const { theme } = useTheme();
  const [photos, setPhotos] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('all');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploadPatientId, setUploadPatientId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar fotos y pacientes en paralelo
      const [photosData, patientsData] = await Promise.all([
        photoService.getPhotos(),
        patientService.getPatients(),
      ]);

      setPhotos(photosData);

      // Crear mapa de pacientes para lookup rápido
      const patientsMap = {};
      patientsData.forEach((p) => {
        patientsMap[p.id] = p;
      });
      setPatients(patientsMap);

      // Si solo hay un paciente, pre-seleccionarlo para upload
      if (patientsData.length === 1) {
        setUploadPatientId(patientsData[0].id);
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudieron cargar las fotos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos permisos para acceder a tu galería de fotos.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setUploadModalVisible(true);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos permisos para acceder a tu cámara.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setUploadModalVisible(true);
    }
  };

  const handleUpload = async () => {
    if (!uploadPatientId) {
      Alert.alert('Error', 'Selecciona un paciente');
      return;
    }

    try {
      setUploading(true);
      await photoService.uploadPhoto(uploadPatientId, selectedImage, caption.trim() || null);
      Alert.alert('Éxito', 'Foto subida correctamente');
      setUploadModalVisible(false);
      setSelectedImage(null);
      setCaption('');
      loadData();
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo subir la foto');
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo);
    setViewModalVisible(true);
  };

  const handleDeletePhoto = () => {
    if (!selectedPhoto) return;

    Alert.alert(
      'Eliminar Foto',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await photoService.deletePhoto(selectedPhoto.id);
              Alert.alert('Éxito', 'Foto eliminada');
              setViewModalVisible(false);
              setSelectedPhoto(null);
              loadData();
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar la foto');
            }
          },
        },
      ]
    );
  };

  const showUploadOptions = () => {
    Alert.alert(
      'Agregar Foto',
      'Selecciona una opción',
      [
        {
          text: 'Tomar Foto',
          onPress: takePicture,
        },
        {
          text: 'Elegir de Galería',
          onPress: pickImage,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const getFilteredPhotos = () => {
    return photos
      .map((photo) => ({
        ...photo,
        patient_name: patients[photo.patient_id]?.name || 'Paciente desconocido',
      }))
      .filter((photo) => {
        if (selectedPatientId === 'all') return true;
        return photo.patient_id === selectedPatientId;
      })
      .sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at));
  };

  const filteredPhotos = getFilteredPhotos();

  const renderPhoto = ({ item }) => (
    <PhotoCard
      photo={item}
      onPress={() => handlePhotoPress(item)}
      baseUrl={API_URL}
    />
  );

  if (loading) {
    return <LoadingSpinner fullscreen message="Cargando fotos..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={[styles.filtersLabel, { color: theme.colors.textSecondary }]}>
          Filtrar por paciente:
        </Text>
        <View style={styles.filters}>
          <Badge
            status={selectedPatientId === 'all' ? 'info' : 'default'}
            onPress={() => setSelectedPatientId('all')}
          >
            Todos
          </Badge>
          {Object.values(patients).map((patient) => (
            <Badge
              key={patient.id}
              status={selectedPatientId === patient.id ? 'info' : 'default'}
              onPress={() => setSelectedPatientId(patient.id)}
            >
              {patient.name}
            </Badge>
          ))}
        </View>
      </View>

      {/* Photos List */}
      {filteredPhotos.length === 0 ? (
        <EmptyState
          icon="image-outline"
          title="No hay fotos"
          message={
            selectedPatientId === 'all'
              ? 'Agrega la primera foto'
              : 'No hay fotos para este paciente'
          }
          actionLabel={selectedPatientId === 'all' ? 'Agregar Foto' : undefined}
          onAction={selectedPatientId === 'all' ? showUploadOptions : undefined}
        />
      ) : (
        <FlatList
          data={filteredPhotos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      {/* FAB */}
      <FAB icon="camera" onPress={showUploadOptions} />

      {/* Upload Modal */}
      <Modal
        visible={uploadModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text, ...theme.typography.h3 }]}>
                Subir Foto
              </Text>
              <IconButton
                icon="close"
                variant="text"
                onPress={() => {
                  setUploadModalVisible(false);
                  setSelectedImage(null);
                  setCaption('');
                }}
              />
            </View>

            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            )}

            <View style={styles.form}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Paciente
              </Text>
              <View style={styles.badgesList}>
                {Object.values(patients).map((patient) => (
                  <Badge
                    key={patient.id}
                    status={uploadPatientId === patient.id ? 'info' : 'default'}
                    onPress={() => setUploadPatientId(patient.id)}
                  >
                    {patient.name}
                  </Badge>
                ))}
              </View>

              <TextInput
                label="Descripción (opcional)"
                placeholder="Escribe una descripción..."
                value={caption}
                onChangeText={setCaption}
                multiline
                numberOfLines={3}
                containerStyle={styles.input}
              />

              <Button
                variant="primary"
                onPress={handleUpload}
                loading={uploading}
                disabled={uploading || !uploadPatientId}
                icon="upload"
              >
                Subir Foto
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Photo Modal */}
      <Modal
        visible={viewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={styles.viewModalOverlay}>
          <View style={styles.viewModalHeader}>
            <IconButton
              icon="close"
              variant="text"
              onPress={() => setViewModalVisible(false)}
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            />
            <IconButton
              icon="delete"
              variant="text"
              onPress={handleDeletePhoto}
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            />
          </View>

          {selectedPhoto && (
            <Image
              source={{ uri: `${API_URL}${selectedPhoto.url}` }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}

          {selectedPhoto?.caption && (
            <View style={[styles.captionContainer, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
              <Text style={[styles.captionText, { color: '#FFFFFF' }]}>
                {selectedPhoto.caption}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  filtersLabel: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    marginBottom: 0,
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },
  viewModalOverlay: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  viewModalHeader: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
