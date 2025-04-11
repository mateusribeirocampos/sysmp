// PostgreSQL configuration
import pkg from 'pg';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const { Pool } = pkg;

// Configurações de conexão com o PostgreSQL
let pool;

if (process.env.DATABASE_URL) {
  // Usar URL de conexão (para deploy no Render)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  //console.log('Utilizando conexão via DATABASE_URL');
} else {
  // Usar parâmetros individuais (para desenvolvimento local)
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });
  //console.log('Utilizando conexão via parâmetros individuais');
}

// Função para executar consultas SQL
async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    //console.error('Erro na execução da query:', error);
    throw error;
  }
}

// Função para executar uma única consulta e retornar apenas um resultado
async function queryOne(text, params) {
  try {
    const result = await pool.query(text, params);
    return result.rows[0];
  } catch (error) {
    //console.error('Erro na execução da query:', error);
    throw error;
  }
}

// Função para executar consultas que modificam dados (INSERT, UPDATE, DELETE)
async function mutate(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    //console.error('Erro na execução da mutação:', error);
    throw error;
  }
}

// Exporta funções e objeto de conexão para uso em outros módulos
export { pool, query, queryOne, mutate };