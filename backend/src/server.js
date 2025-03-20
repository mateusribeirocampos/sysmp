const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importa as rotas
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');

// Usa as rotas
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Rota para verificar se o servidor está rodando
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 