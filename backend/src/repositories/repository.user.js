import { query } from '../config/database/sqlite.config.js';

async function listByEmail(email) {
  console.log('Buscando usuário com email:', email);

  let sql = `SELECT * FROM users WHERE email = ?`;
  let params = [email];

  const user = await query(sql, params);
  console.log('Resultado da consulta:', user);

  const result = user.length ? user[0] : null;
  console.log('Retornando usuário:', result ? 'Encontrado' : 'Não encontrado');
  
  return result;
}

async function addUser(name, email, password, role, status) {
  let sql = `INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`;
  let params = [name, email, password, role, status];
  
  return query(sql, params);
}

async function updatePassword(userId, hashedPassword) {
  let sql = `UPDATE users SET password = ? WHERE id_user = ?`;
  let params = [hashedPassword, userId];
  
  return query(sql, params);
}

async function ListUsers() {
  let sql = `SELECT * FROM users`;
  return query(sql);
}

async function editUserById(id, name, email, password, role, status) {  
  let sql = `UPDATE users SET name = ?, email = ?, password = ?, role = ?, status = ? WHERE id_user = ?`;
  let params = [name, email, password, role, status, id];
  
  return query(sql, params);
}

async function getUserById(id) {
  let sql = `SELECT * FROM users WHERE id_user = ?`;
  let params = [id];

  return query(sql, params);
}

export default { listByEmail, updatePassword, addUser, ListUsers, editUserById, getUserById };