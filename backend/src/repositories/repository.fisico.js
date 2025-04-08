// Repositório de físicos adaptado para PostgreSQL
import { query, queryOne, mutate } from '../config/database/postgres.config.js';

async function listFisico() {
  let sql = 'SELECT * FROM fisicos ORDER BY deliveryDeadLine';
  return query(sql);
}

async function addFisico(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  let sql = 'INSERT INTO fisicos (receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  return mutate(sql, [receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message]);
}

async function updateInternalDelivery(idDocument, userId) {
  let sql = 'UPDATE fisicos SET internalDeliveryUserId = $1 WHERE idDocument = $2 RETURNING *';
  return mutate(sql, [userId, idDocument]);
}

async function getFisicoById(id_fisico) {
  let sql = 'SELECT * FROM fisicos WHERE id_fisico = $1';
  return queryOne(sql, [id_fisico]);
}

async function updateFisico(id_fisico, receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  let sql = 'UPDATE fisicos SET receivedAt = $1, idDocument = $2, deliveryDeadLine = $3, internalDeliveryUserId = $4, message = $5 WHERE id_fisico = $6 RETURNING *';
  return mutate(sql, [receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message, id_fisico]);
}

async function deleteFisico(id_fisico) {
  let sql = 'DELETE FROM fisicos WHERE id_fisico = $1 RETURNING *';
  return mutate(sql, [id_fisico]);
}

export default { listFisico, addFisico, updateInternalDelivery, getFisicoById, updateFisico, deleteFisico };