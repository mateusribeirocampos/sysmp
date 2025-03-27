import bcrypt from 'bcryptjs/dist/bcrypt.js';
import repoUser from '../repositories/repository.user.js';
import { CreateToken } from '../middleware/auth.js';

async function login(email, password) {
  const user = await repoUser.listByEmail(email);

  if (!user || Object.keys(user).length === 0) { // Se o usuário não for encontrado, retorna um array vazio
    return null; // Retorna um array vazio
  }

  const isValidPassword = await bcrypt.compare(password, user.password); // Compara a senha do usuário com a senha fornecida
  if (!isValidPassword) { // Se a senha não for válida, retorna null
    return null; // Retorna null
  }

  delete user.password; // Deleta a senha do usuário
  const token = CreateToken(user.id_user); // Cria um token para o usuário  
  return {
    ...user, // Retorna o usuário com o token
    token // Retorna o token
  };
}

export default { login };
