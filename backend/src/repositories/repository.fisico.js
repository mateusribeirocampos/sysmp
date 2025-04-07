import { query } from '../config/database/sqlite.config.js'

async function listFisico() {
  let sql = 'SELECT * FROM fisicos order by deliveryDeadLine'
  return query(sql);
}

async function addFisico(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  let sql = 'INSERT INTO fisicos (receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) VALUES (?, ?, ?, ?, ?)'
  return query(sql, [receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message]);
}

async function updateInternalDelivery(idDocument, userId) {
  let sql = 'UPDATE fisicos SET internalDeliveryUserId = ? WHERE idDocument = ?'
  return query(sql, [userId, idDocument]);
}
async function getFisicoById(id_fisico) {
  let sql = 'SELECT * FROM fisicos WHERE id_fisico = ?'
  return query(sql, [id_fisico]);
}

async function updateFisico(id_fisico, receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  let sql = 'UPDATE fisicos SET receivedAt = ?, idDocument = ?, deliveryDeadLine = ?, internalDeliveryUserId = ?, message = ? WHERE id_fisico = ?'
  return query(sql, [receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message, id_fisico]);
}

async function deleteFisico(id_fisico) {
  let sql = 'DELETE FROM fisicos WHERE id_fisico = ?'
  return query(sql, [id_fisico]);
}

export default { listFisico, addFisico, updateInternalDelivery, getFisicoById, updateFisico, deleteFisico };