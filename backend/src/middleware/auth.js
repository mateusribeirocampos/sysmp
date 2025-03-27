import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

function CreateToken(id_user) { // Cria um token para o usuário
  const token = jwt.sign({ id: id_user }, JWT_SECRET, { expiresIn: 999999 }); // 999999 é o tempo de expiração do token em segundos
  if (!token) { // Se o token não for criado, retorna um erro
    return { error: 'Erro ao criar token' }; // Retorna um erro
  }
  return token;
}

function ValidateToken(req, res, next) { // Valida o token do usuário
  const authToken = req.headers.authorization; // Pega o token do usuário

  if (!authToken) { // Se o token não for fornecido, retorna um erro
    return res.status(401).json({ error: 'Token não fornecido' }); // Retorna um erro
  }

  const [bearer, token] = authToken.split(' ');

  if (bearer !== 'Bearer') { // Se o token não for um Bearer, retorna um erro
    return res.status(401).json({ error: 'Token malformado' }); // Retorna um erro
  }
  jwt.verify(token, JWT_SECRET, (err, tokenDecoded) => { // Verifica o token  
    if (err) { // Se o token for inválido, retorna um erro
      return res.status(401).json({ error: 'Token inválido' }); // Retorna um erro
    }
    req.id_user = tokenDecoded.id_user; // Define o id do usuário
    next(); // Chama a próxima função
  });
}

export { CreateToken, ValidateToken };