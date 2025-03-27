import { query } from '../config/database/sqlite.config.js';

async function listByEmail(email) {

  let sql = `SELECT * FROM users WHERE email = ?`;
  let params = [email];

  const user = await query(sql, params);

  return (user.length) ? user[0] : [];

}

export default { listByEmail };