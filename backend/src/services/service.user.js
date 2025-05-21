import bcrypt from 'bcryptjs/dist/bcrypt.js';
import repoUser from '../repositories/repository.user.js';
import { CreateToken } from '../middleware/auth.js';

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function login(email, password) {
  const user = await repoUser.listByEmail(email);

  if (!user || Object.keys(user).length === 0) {
    return null;
  }

  let isValidPassword;
  
  if (user.password.startsWith('$2')) {
    isValidPassword = await bcrypt.compare(password, user.password);
  } else {
    isValidPassword = password === user.password;
    if (isValidPassword) {
      const hashedPassword = await hashPassword(password);
      await repoUser.updatePassword(user.id_user, hashedPassword);
    }
  }

  if (!isValidPassword) {
    return null;
  }

  delete user.password;
  
  try {
    const token = await CreateToken(user.id_user);
    
    const { id_user, ...rest } = user;
    
    const result = {
      id: id_user,
      ...rest,
      token
    };
    
    return result;
  } catch (error) {
    throw new Error('Erro ao processar login');
  }
}

async function addUser(name, email, password, role, status) {
  const hashedPassword = await hashPassword(password);
  const result = await repoUser.addUser(name, email, hashedPassword, role, status);
  return result;
}

async function listUsers() {
  const result = await repoUser.ListUsers();
  return result;
}

async function editUserById(id, name, email, password, role, status) {
  const hashedPassword = await hashPassword(password);
  const result = await repoUser.editUserById(id, name, email, hashedPassword, role, status);
  return result;
}

async function getUserById(id) {
  const result = await repoUser.getUserById(id);
  return result;
}

async function editUserStatus(id, status) { 
  const result = await repoUser.editUserStatus(id, status);
  return result;
}

async function deleteUser(id) {
  const result = await repoUser.deleteUser(id);
  return result;
}

export default { login, addUser, listUsers, editUserById, getUserById, editUserStatus, deleteUser };
