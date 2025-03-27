import bcrypt from 'bcryptjs/dist/bcrypt.js';
import repoUser from '../repositories/repository.user.js';
import { CreateToken } from '../middleware/auth.js';

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function login(email, password) {
  console.log('Tentando login com email:', email);
  const user = await repoUser.listByEmail(email);
  console.log('Usuário encontrado:', user ? 'Sim' : 'Não');

  if (!user || Object.keys(user).length === 0) {
    console.log('Usuário não encontrado ou vazio');
    return null;
  }

  console.log('Verificando senha...');
  let isValidPassword;
  
  // Verifica se a senha está hasheada
  if (user.password.startsWith('$2')) {
    isValidPassword = await bcrypt.compare(password, user.password);
  } else {
    // Se a senha não estiver hasheada, compara diretamente e atualiza para hash
    isValidPassword = password === user.password;
    if (isValidPassword) {
      // Atualiza a senha para versão hasheada
      const hashedPassword = await hashPassword(password);
      await repoUser.updatePassword(user.id_user, hashedPassword);
    }
  }
  
  console.log('Senha válida:', isValidPassword ? 'Sim' : 'Não');

  if (!isValidPassword) {
    console.log('Senha inválida');
    return null;
  }

  delete user.password;
  const token = CreateToken(user.id_user);
  
  const { id_user, ...rest } = user;
  
  const result = {
    id: id_user,
    ...rest,
    token
  };
  
  console.log('Login bem sucedido, retornando:', { ...result, token: 'HIDDEN' });
  return result;
}

export default { login };
