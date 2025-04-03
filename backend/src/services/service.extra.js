import repoExtra from '../repositories/repository.extra.js'

async function listExtra() {
  const result = await repoExtra.listExtra();
  return result;
}

async function addExtras(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  const result = await repoExtra.addExtras(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message);
  return result;
}

export default { listExtra, addExtras };