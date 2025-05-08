import repoSuspenso from '../repositories/repository.suspenso.js';

async function listSuspenso() {
  const result = await repoSuspenso.listSuspenso();
  return result;
}

async function addSuspenso(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  const result = await repoSuspenso.addSuspenso(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message);

  console.log(result);
  return result;
}

async function updateInternalDelivery(idDocument, userId) {
  const result = await repoSuspenso.updateInternalDelivery(idDocument, userId);
  return result;
}

async function getSuspensoById(id_suspenso) {
  const result = await repoSuspenso.getSuspensoById(id_suspenso);
  return result;
}

async function updateSuspenso(id_suspenso, receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message) {
  const result = await repoSuspenso.updateSuspenso(id_suspenso, receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message);
  return result;
}

async function deleteSuspenso(id_suspenso) {
  const result = await repoSuspenso.deleteSuspenso(id_suspenso);
  return result;
}

export default { listSuspenso, addSuspenso, updateInternalDelivery, getSuspensoById, updateSuspenso, deleteSuspenso };
