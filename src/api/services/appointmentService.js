import client from '../client';

/**
 * Obtiene todas las citas del usuario autenticado
 * (combina citas de todos los pacientes)
 */
export async function getAppointments() {
  // Primero obtener todos los pacientes
  const patientsRes = await client.get('/patients');
  const patients = patientsRes.data;

  // Luego obtener las citas de cada paciente
  const appointmentsPromises = patients.map(patient =>
    client.get(`/patients/${patient.id}/appointments`)
      .then(res => res.data)
      .catch(() => []) // Si falla, retornar array vacío
  );

  const appointmentsArrays = await Promise.all(appointmentsPromises);

  // Aplanar el array de arrays en un solo array
  return appointmentsArrays.flat();
}

/**
 * Obtiene las citas de un paciente específico
 * @param {number} patientId - ID del paciente
 */
export async function getPatientAppointments(patientId) {
  const res = await client.get(`/patients/${patientId}/appointments`);
  return res.data;
}

/**
 * Crea una nueva cita para un paciente
 * @param {number} patientId - ID del paciente
 * @param {object} data - { datetime, reason, doctor, status }
 */
export async function createAppointment(patientId, data) {
  const res = await client.post(`/patients/${patientId}/appointments`, data);
  return res.data;
}

/**
 * Actualiza una cita existente
 * @param {number} patientId - ID del paciente
 * @param {number} appointmentId - ID de la cita
 * @param {object} data - Datos a actualizar
 */
export async function updateAppointment(patientId, appointmentId, data) {
  const res = await client.put(`/appointments/${appointmentId}`, data);
  return res.data;
}

/**
 * Elimina una cita
 * @param {number} patientId - ID del paciente
 * @param {number} appointmentId - ID de la cita
 */
export async function deleteAppointment(patientId, appointmentId) {
  const res = await client.delete(`/appointments/${appointmentId}`);
  return res.data;
}
