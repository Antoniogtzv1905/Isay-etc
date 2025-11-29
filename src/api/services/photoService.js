import client from '../client';

/**
 * Obtiene todas las fotos
 * (combina fotos de todos los pacientes)
 */
export async function getPhotos() {
  // Primero obtener todos los pacientes
  const patientsRes = await client.get('/patients');
  const patients = patientsRes.data;

  // Luego obtener las fotos de cada paciente
  const photosPromises = patients.map(patient =>
    client.get(`/patients/${patient.id}/photos`)
      .then(res => res.data)
      .catch(() => []) // Si falla, retornar array vacío
  );

  const photosArrays = await Promise.all(photosPromises);

  // Aplanar el array de arrays en un solo array
  return photosArrays.flat();
}

/**
 * Obtiene las fotos de un paciente específico
 */
export async function getPatientPhotos(patientId) {
  const res = await client.get(`/patients/${patientId}/photos`);
  return res.data;
}

/**
 * Sube una nueva foto para un paciente
 */
export async function uploadPhoto(patientId, imageUri, caption = null) {
  const formData = new FormData();

  // Extraer el nombre del archivo y la extensión de la URI
  const filename = imageUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  // Agregar el archivo al FormData
  formData.append('file', {
    uri: imageUri,
    name: filename,
    type: type,
  });

  // Agregar caption si existe
  if (caption) {
    formData.append('caption', caption);
  }

  const res = await client.post(`/patients/${patientId}/photos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}

/**
 * Elimina una foto
 */
export async function deletePhoto(photoId) {
  const res = await client.delete(`/photos/${photoId}`);
  return res.data;
}
