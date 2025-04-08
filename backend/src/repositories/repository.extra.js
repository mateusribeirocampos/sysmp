// Repositório de extras adaptado para PostgreSQL
import { query, queryOne, mutate } from '../config/database/postgres.config.js';

async function listExtra() {
  let sql = 'SELECT * FROM extras ORDER BY deliveryDeadLine';
  return query(sql);
}

async function addExtras(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  let sql = 'INSERT INTO extras (receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  return mutate(sql, [receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message]);
}

async function updateInternalDelivery(idDocument, userId) {
  let sql = 'UPDATE extras SET internalDeliveryUserId = $1 WHERE idDocument = $2 RETURNING *';
  return mutate(sql, [userId, idDocument]);
}

async function getExtraById(id_extra) {
  let sql = 'SELECT * FROM extras WHERE id_extra = $1';
  return queryOne(sql, [id_extra]);
}

async function updateExtra(id_extra, receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  let sql = 'UPDATE extras SET receivedAt = $1, idDocument = $2, deliveryDeadLine = $3, internalDeliveryUserId = $4, message = $5 WHERE id_extra = $6 RETURNING *';
  return mutate(sql, [receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message, id_extra]);
}

async function deleteExtra(id_extra) {
  let sql = 'DELETE FROM extras WHERE id_extra = $1 RETURNING *';
  return mutate(sql, [id_extra]);
}

export default { listExtra, addExtras, updateInternalDelivery, getExtraById, updateExtra, deleteExtra };