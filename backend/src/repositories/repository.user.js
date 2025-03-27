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

async function updatePassword(userId, hashedPassword) {
  let sql = `UPDATE users SET password = ? WHERE id_user = ?`;
  let params = [hashedPassword, userId];
  
  return query(sql, params);
}

export default { listByEmail, updatePassword };