import client from '../client';

/**
 * Obtiene todas las notas médicas
 * (combina notas de todos los pacientes)
 */
export async function getNotes() {
  // Primero obtener todos los pacientes
  const patientsRes = await client.get('/patients');
  const patients = patientsRes.data;

  // Luego obtener las notas de cada paciente
  const notesPromises = patients.map(patient =>
    client.get(`/patients/${patient.id}/notes`)
      .then(res => res.data)
      .catch(() => []) // Si falla, retornar array vacío
  );

  const notesArrays = await Promise.all(notesPromises);

  // Aplanar el array de arrays en un solo array
  return notesArrays.flat();
}

/**
 * Obtiene las notas de un paciente específico
 */
export async function getPatientNotes(patientId) {
  const res = await client.get(`/patients/${patientId}/notes`);
  return res.data;
}

/**
 * Crea una nueva nota médica
 */
export async function createNote(patientId, data) {
  const res = await client.post(`/patients/${patientId}/notes`, data);
  return res.data;
}

/**
 * Actualiza una nota existente
 */
export async function updateNote(noteId, data) {
  const res = await client.put(`/notes/${noteId}`, data);
  return res.data;
}

/**
 * Elimina una nota
 */
export async function deleteNote(noteId) {
  const res = await client.delete(`/notes/${noteId}`);
  return res.data;
}
