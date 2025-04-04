import serviceExtra from "../services/service.extra.js";

async function listExtra(req, res) {
  try {
    const result = await serviceExtra.listExtra();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro no listExtra: ', error);
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
    
  }
}

// No controller do backend
async function addExtras(req, res) {
  try {
    const { receivedAt, idDocument, deliveryDeadLine, internalDeliveryUserId, message } = req.body;
    
    // Verificar se todos os campos estão presentes
    if (!receivedAt || !idDocument || !deliveryDeadLine || !internalDeliveryUserId || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    const result = await serviceExtra.addExtras(
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
    
    const result = await serviceExtra.updateInternalDelivery(idDocument, internalDeliveryUserId);
    
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

export default { listExtra, addExtras, assignInternalDelivery };