import { query } from '../config/database/sqlite.config.js'

async function listExtra() {
  let sql = 'SELECT * FROM extras'
  return query(sql);
}

async function addExtras(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  let sql = 'INSERT INTO extras (receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) VALUES (?, ?, ?, ?, ?)'
  return query(sql, [receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message]);
}

export default { listExtra, addExtras };