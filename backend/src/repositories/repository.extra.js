import { query } from '../config/database/sqlite.config.js'

async function listExtra() {
  let sql = 'SELECT * FROM extras order by deliveryDeadLine'
  return query(sql);
}

async function addExtras(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  let sql = 'INSERT INTO extras (receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) VALUES (?, ?, ?, ?, ?)'
  return query(sql, [receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message]);
}

async function updateInternalDelivery(idDocument, userId) {
  let sql = 'UPDATE extras SET internalDeliveryUserId = ? WHERE idDocument = ?'
  return query(sql, [userId, idDocument]);
}

async function getExtraById(id_extra) {
  let sql = 'SELECT * FROM extras WHERE id_extra = ?'
  return query(sql, [id_extra]);
}

async function updateExtra(id_extra, receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  let sql = 'UPDATE extras SET receivedAt = ?, idDocument = ?, deliveryDeadLine = ?, internalDeliveryUserId = ?, message = ? WHERE id_extra = ?'
  return query(sql, [receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message, id_extra]);
}

export default { listExtra, addExtras, updateInternalDelivery, getExtraById, updateExtra };