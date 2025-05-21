import serviceUser from '../services/service.user.js';

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }
    
    const result = await serviceUser.login(email, password);

    if (!result) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const { token, ...user } = result;

    return res.status(200).json({
      user,
      token,
      message: "Login realizado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function addUser(req, res) {
  try {
    const { name, email, password, role, status } = req.body;

    if (!name || !email || !password || !role || !status) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const result = await serviceUser.addUser(name, email, password, role, status);

    if (!result) {
      return res.status(400).json({ error: "Erro ao adicionar usuário" });
    }
    
    return res.status(200).json({
      message: "Usuário adicionado com sucesso",
      user: result
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function listUsers(req, res) {
  try {
    const result = await serviceUser.listUsers();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function editUserById(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;

    if (!id || !name || !email || !password || !role || !status) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const result = await serviceUser.editUserById(id, name, email, password, role, status);

    if (!result) {
      return res.status(400).json({ error: "Erro ao editar usuário" });
    }

    return res.status(200).json({ message: "Usuário editado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const result = await serviceUser.getUserById(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function editUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const result = await serviceUser.editUserStatus(id, status);
    
    if (!result) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json({
      message: "Status atualizado com sucesso",
      status: status
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const result = await serviceUser.deleteUser(id);

    if (!result) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export default { login, addUser, listUsers, editUserById, getUserById, editUserStatus, deleteUser };