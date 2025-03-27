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
    console.error('Erro no login:', error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export default { login };