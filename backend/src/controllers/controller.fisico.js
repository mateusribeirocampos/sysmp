import serviceFisico from "../services/service.fisico.js";

async function listFisico(req, res) {
  try {
    const result = await serviceFisico.listFisico();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro no listFisico: ', error);
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
    
  }
}

// No controller do backend
async function addFisico(req, res) {
  try {
    const { receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message } = req.body;
    
    // Verificar se todos os campos estão presentes
    if (!receivedAt || !idDocument || !deliveryDeadLine || !internalDeliveryUserId || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    const result = await serviceFisico.addFisico(
      receivedAt, 
      idDocument, 
      deliveryDeadLine, 
      internalDeliveryUserId, 
      message
    );
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao adicionar extra:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Função modificada para receber parâmetros no corpo da requisição
async function assignInternalDelivery(req, res) {
  try {
    const { idDocument, internalDeliveryUserId } = req.body;
    
    if (!idDocument || !internalDeliveryUserId) {
      return res.status(400).json({ error: 'ID do documento e ID do usuário são obrigatórios' });
    }
    
    console.log(`Tentando atribuir documento ${idDocument} ao usuário ${internalDeliveryUserId}`);
    
    const result = await serviceFisico.updateInternalDelivery(idDocument, internalDeliveryUserId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Responsável atualizado com sucesso',
      data: result
    });
  } catch (error) {
    console.error('Erro ao atribuir responsável:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function getFisicoById(req, res) {
  const { id_fisico } = req.params;
  try {
    const result = await serviceFisico.getFisicoById(id_fisico);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro no getFisicoById: ', error);
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

async function updateFisico(req, res) {
  const { id_fisico } = req.params;
  try {
    const { receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message } = req.body;
    
    // Verificar se todos os campos estão presentes
    if (!receivedAt || !idDocument || !deliveryDeadLine || !internalDeliveryUserId || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    const result = await serviceFisico.updateFisico(
      id_fisico,
      receivedAt, 
      idDocument, 
      deliveryDeadLine, 
      internalDeliveryUserId, 
      message
    );
    
    return res.status(200).json({ 
      success: true, 
      message: 'Documento atualizado com sucesso',
      data: result
    });
  } catch (error) {
    console.error('Erro ao atualizar físico:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function deleteFisico(req, res) {
  const { id_fisico } = req.params;
  try {
    const result = await serviceFisico.deleteFisico(id_fisico);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao deletar físico:', error);
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

export default { listFisico, addFisico, assignInternalDelivery, getFisicoById, updateFisico, deleteFisico };