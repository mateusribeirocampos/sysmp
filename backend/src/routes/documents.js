const express = require('express');
const router = express.Router();
const db = require('../database/config');

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Listar todos os documentos
router.get('/', verifyToken, (req, res) => {
  db.all('SELECT * FROM documents ORDER BY deadline ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar documentos' });
    }
    res.json(rows);
  });
});

// Criar novo documento
router.post('/', verifyToken, (req, res) => {
  const {
    name,
    description,
    received_date,
    received_by,
    transferred_to,
    deadline
  } = req.body;

  db.run(
    `INSERT INTO documents (
      name, description, received_date, received_by, 
      transferred_to, deadline, status
    ) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    [name, description, received_date, received_by, transferred_to, deadline],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao criar documento' });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Atualizar documento
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    received_date,
    received_by,
    transferred_to,
    deadline,
    status
  } = req.body;

  db.run(
    `UPDATE documents SET 
      name = ?, description = ?, received_date = ?, 
      received_by = ?, transferred_to = ?, deadline = ?,
      status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [name, description, received_date, received_by, transferred_to, deadline, status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar documento' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Documento não encontrado' });
      }
      res.json({ message: 'Documento atualizado com sucesso' });
    }
  );
});

// Deletar documento
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM documents WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Erro ao deletar documento' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Documento não encontrado' });
    }
    res.json({ message: 'Documento deletado com sucesso' });
  });
});

// Buscar documento por ID
router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM documents WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar documento' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Documento não encontrado' });
    }
    res.json(row);
  });
});

module.exports = router; 