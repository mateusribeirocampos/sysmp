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

export default { listFisico, addFisico, updateInternalDelivery };