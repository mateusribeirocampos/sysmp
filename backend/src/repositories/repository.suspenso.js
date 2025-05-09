import { query, queryOne, mutate } from '../config/database/postgres.config.js';

async function listSuspenso() {
  let sql = 'SELECT * FROM suspensos ORDER BY "receivedAt"';
  return query(sql);
}

async function addSuspenso(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  let sql = 'INSERT INTO suspensos ("receivedAt", "idDocument", "deliveryDeadLine", "internalDeliveryUserId", "message") VALUES ($1, $2, $3, $4, $5) RETURNING *';
  return mutate(sql, [receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message]);
}

async function updateInternalDelivery(idDocument, userId) {
  let sql = 'UPDATE suspensos SET "internalDeliveryUserId" = $1 WHERE "idDocument" = $2 RETURNING *';
  return mutate(sql, [userId, idDocument]);
}

async function getSuspensoById(id_suspenso) {
  let sql = 'SELECT * FROM suspensos WHERE id_suspenso = $1';
  return queryOne(sql, [id_suspenso]);
}

async function updateSuspenso(id_suspenso, receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  let sql = 'UPDATE suspensos SET "receivedAt" = $1, "idDocument" = $2, "deliveryDeadLine" = $3, "internalDeliveryUserId" = $4, "message" = $5 WHERE id_suspenso = $6 RETURNING *';
  return mutate(sql, [receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message, id_suspenso]);
}

async function deleteSuspenso(id_suspenso) {
  let sql = 'DELETE FROM suspensos WHERE id_suspenso = $1 RETURNING *';
  return mutate(sql, [id_suspenso]);
}

export default { listSuspenso, addSuspenso, updateInternalDelivery, getSuspensoById, updateSuspenso, deleteSuspenso };




