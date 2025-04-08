// Teste de conexão com PostgreSQL
import { pool } from './postgres.config.js';
import logger from '../logger.js';

async function testPostgresConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    logger.info('Conexão com PostgreSQL estabelecida com sucesso!');
    logger.info(`Data e hora do servidor: ${result.rows[0].now}`);
    client.release();
    return true;
  } catch (err) {
    logger.error('Erro ao conectar com PostgreSQL:', err);
    return false;
  }
}

export { testPostgresConnection };