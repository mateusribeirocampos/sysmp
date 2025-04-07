import repoFisico from '../repositories/repository.fisico.js'

async function listFisico() {
  const result = await repoFisico.listFisico();
  return result;
}

async function addFisico(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  const result = await repoFisico.addFisico(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message);
  return result;
}

async function updateInternalDelivery(idDocument, userId) {
  const result = await repoFisico.updateInternalDelivery(idDocument, userId);
  return result;
}

async function getFisicoById(id_fisico) {
  const result = await repoFisico.getFisicoById(id_fisico);
  return result;
}

async function updateFisico(id_fisico, receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  const result = await repoFisico.updateFisico(id_fisico, receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message);
  return result;
}

async function deleteFisico(id_fisico) {
  const result = await repoFisico.deleteFisico(id_fisico);
  return result;
}

export default { listFisico, addFisico, updateInternalDelivery, getFisicoById, updateFisico, deleteFisico };