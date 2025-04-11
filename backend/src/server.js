import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import config from './config/index.js';
import logger from './config/logger.js';
import { testPostgresConnection } from './config/database/test-connection.js';
import { initializeSocket } from './socket.js';

console.log("Iniciando o servidor...");

const app = express();
const httpServer = createServer(app);

// Inicializa o Socket.IO
const io = initializeSocket(httpServer);

// Configuração do CORS baseada no ambiente
const allowedOrigins = [
  'http://localhost:5173', // URL do frontend Vite em desenvolvimento
  'https://sysmp.vercel.app', // URL do frontend na Vercel (produção)
  /\.vercel\.app$/ // Permite subdomínios da Vercel
];

console.log("Configurando CORS...");

app.use(cors({
  origin: function(origin, callback) {
    // Permite requisições sem origin (como apps mobile ou ferramentas de API)
    if (!origin) return callback(null, true);
    
    // Verifica se a origem está na lista de permitidas ou corresponde a um padrão regex
    const allowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origem ${origin} não permitida pelo CORS`));
    }
  },
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

const PORT = process.env.PORT || config.server.port || 3001;

console.log("Testando conexão com PostgreSQL...");

// Testar conexão com PostgreSQL antes de iniciar o servidor
testPostgresConnection()
  .then(connectionSuccessful => {
    console.log("Resultado do teste de conexão:", connectionSuccessful ? "Sucesso" : "Falha");
    if (connectionSuccessful) {
      httpServer.listen(PORT, () => {
        console.log(`Servidor iniciado na porta ${PORT}`);
        logger.info(`Servidor rodando na porta ${PORT}`);
      });
    } else {
      console.error("Falha ao conectar com o PostgreSQL. Aplicação não iniciada.");
      logger.error('Falha ao conectar com o PostgreSQL. Aplicação não iniciada.');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Erro ao testar conexão:", err);
    logger.error('Erro ao testar conexão com PostgreSQL:', err);
    process.exit(1);
  });

export default app;