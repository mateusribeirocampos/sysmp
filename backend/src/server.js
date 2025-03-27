import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Carrega as variáveis de ambiente
dotenv.config({ path: './src/.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Usa as rotas
app.use(routes);

// Rota para verificar se o servidor está rodando
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 