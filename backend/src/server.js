import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import config from './config/index.js';
import logger from './config/logger.js';

const app = express();

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend Vite
  credentials: true
}));

// Middleware para processar JSON
app.use(express.json());

// Rotas
app.use(routes);

// Tratamento de erros global
app.use((err, req, res, next) => {
  logger.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = config.server.port || 3001;

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});

export default app; 