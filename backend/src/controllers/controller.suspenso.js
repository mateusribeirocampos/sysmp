import serviceSuspenso from '../services/service.suspenso.js';
import { io } from '../socket.js';

async function listSuspenso(req, res) {
  try {
    const result = await serviceSuspenso.listSuspenso();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

async function addSuspenso(req, res) {
  try {
    const { receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message } = req.body;

    if (!receivedAt || !idDocument || !deliveryDeadLine) {
      return res.status(400).json({ error: 'Campos são obrigatórios' });
    }
    
    const result = await serviceSuspenso.addSuspenso(receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message);

    io.emit('data-changed', { type: 'suspenso', action: 'create' });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

async function updateInternalDelivery(req, res) {
  try {
    const { idDocument, internalDeliveryUserId } = req.body;
    
    if (!idDocument || !internalDeliveryUserId) {
      return res.status(400).json({ error: 'ID do documento e ID do usuário são obrigatórios' });
    }

    const result = await serviceSuspenso.updateInternalDelivery(idDocument, internalDeliveryUserId);
    return res.status(200).json(result);
  } catch (error) { 
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

async function getSuspensoById(req, res) {
  const { id_suspenso } = req.params;
  try { 
    const result = await serviceSuspenso.getSuspensoById(id_suspenso);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

async function updateSuspenso(req, res) {
  const { id_suspenso } = req.params;
  try { 
    const { receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message } = req.body;
    
    if (!receivedAt || !idDocument || !deliveryDeadLine) {
      return res.status(400).json({ error: 'Campos são obrigatórios' });
    }

    const result = await serviceSuspenso.updateSuspenso(id_suspenso, receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message);

    io.emit('data-changed', { type: 'suspenso', action: 'update', id: id_suspenso });
  
    return res.status(200).json({ 
      success: true, 
      message: 'Documento atualizado com sucesso',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

async function deleteSuspenso(req, res) {
  const { id_suspenso } = req.params;
  try {
    const result = await serviceSuspenso.deleteSuspenso(id_suspenso);

    io.emit('data-changed', { type: 'suspenso', action: 'delete', id: id_suspenso });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

export default { listSuspenso, addSuspenso, updateInternalDelivery, getSuspensoById, updateSuspenso, deleteSuspenso };