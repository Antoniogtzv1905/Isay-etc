import client from '../client';

/**
 * Obtiene todos los signos vitales
 * (combina signos vitales de todos los pacientes)
 */
export async function getVitals() {
  // Primero obtener todos los pacientes
  const patientsRes = await client.get('/patients');
  const patients = patientsRes.data;

  // Luego obtener los signos vitales de cada paciente
  const vitalsPromises = patients.map(patient =>
    client.get(`/patients/${patient.id}/vitals`)
      .then(res => res.data)
      .catch(() => []) // Si falla, retornar array vacío
  );

  const vitalsArrays = await Promise.all(vitalsPromises);

  // Aplanar el array de arrays en un solo array
  return vitalsArrays.flat();
}

/**
 * Obtiene los signos vitales de un paciente específico
 */
export async function getPatientVitals(patientId) {
  const res = await client.get(`/patients/${patientId}/vitals`);
  return res.data;
}

/**
 * Crea un nuevo registro de signos vitales
 */
export async function createVital(patientId, data) {
  const res = await client.post(`/patients/${patientId}/vitals`, data);
  return res.data;
}

/**
 * Actualiza un registro de signos vitales
 */
export async function updateVital(vitalId, data) {
  const res = await client.put(`/vitals/${vitalId}`, data);
  return res.data;
}

/**
 * Elimina un registro de signos vitales
 */
export async function deleteVital(vitalId) {
  const res = await client.delete(`/vitals/${vitalId}`);
  return res.data;
}
