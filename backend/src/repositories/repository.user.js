// Repositório de usuários adaptado para PostgreSQL
import { query, queryOne, mutate } from '../config/database/postgres.config.js';

async function listByEmail(email) {
  console.log('Buscando usuário com email:', email);

  let sql = `SELECT * FROM users WHERE email = $1`;
  let params = [email];

  const user = await queryOne(sql, params);
  console.log('Retornando usuário:', user ? 'Encontrado' : 'Não encontrado');
  
  return user;
}

async function addUser(name, email, password, role, status) {
  let sql = `INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  let params = [name, email, password, role, status];
  
  return mutate(sql, params);
}

async function updatePassword(userId, hashedPassword) {
  let sql = `UPDATE users SET password = $1 WHERE id_user = $2 RETURNING *`;
  let params = [hashedPassword, userId];
  
  return mutate(sql, params);
}

async function ListUsers() {
  let sql = `SELECT * FROM users`;
  return query(sql);
}

async function editUserById(id, name, email, password, role, status) {  
  let sql = `UPDATE users SET name = $1, email = $2, password = $3, role = $4, status = $5 WHERE id_user = $6 RETURNING *`;
  let params = [name, email, password, role, status, id];
  
  return mutate(sql, params);
}

async function getUserById(id) {
  let sql = `SELECT * FROM users WHERE id_user = $1`;
  let params = [id];

  return queryOne(sql, params);
}

async function editUserStatus(id, status) {
  let sql = `UPDATE users SET status = $1 WHERE id_user = $2 RETURNING *`;
  let params = [status, id];

  return mutate(sql, params);
}

async function deleteUser(id) {
  let sql = `DELETE FROM users WHERE id_user = $1 RETURNING *`;
  let params = [id];
  return mutate(sql, params);
}

export default { listByEmail, updatePassword, addUser, ListUsers, editUserById, getUserById, editUserStatus, deleteUser };