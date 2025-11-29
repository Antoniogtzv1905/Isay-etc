import { api } from '../client';

export async function getPatients() {
  const res = await api.get('/patients');
  return res.data;
}

export async function getPatientById(id) {
  const res = await api.get(`/patients/${id}`);
  return res.data;
}

export async function createPatient(patientData) {
  const res = await api.post('/patients', patientData);
  return res.data;
}

export async function updatePatient(id, patientData) {
  const res = await api.put(`/patients/${id}`, patientData);
  return res.data;
}

export async function deletePatient(id) {
  const res = await api.delete(`/patients/${id}`);
  return res.data;
}
