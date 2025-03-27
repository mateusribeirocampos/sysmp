import sqlite3 from 'sqlite3';

const SQLiteConfig = sqlite3.verbose();

//  Define uma função chamada query que executa comandos SQL no banco de dados
function query(command, params, method = 'all') {
  // Retorna uma promise que será revolvida ou rejeitada com base no resultado da consulta
  return new Promise(function(resolve, reject) {
    // Executa o método espcecificado (por padrão, 'all') no banco de dados 
    db[method](command, params, function(error, result) {
      // Se ocorrer um erro, rejeita a Promise com o erro
      if (error)
        reject(error);
      else
        // Caso contrário, resolve a Promise com o resultado da consulta
        resolve(result);
    });
  });
}

// Cria uma nova instância do banco de dados SQLite, conectando-se ao arquivo banco.db
const db = new SQLiteConfig.Database(
  "./src/config/database/database-sys.db", // Acesso ao banco de dados
  sqlite3.OPEN_READWRITE, // Abre o banco de dados em modo leitura e escrita
  (err) => { // Callback que é chamado após a tentativa de conexão
    if (err)
      // Se ocorrer um erro, exibe uma mensagem no console
      return console.log("Erro ao conectar com o banco: " + err.message);
  }
);
// Exporta os objetos db e query para que possam ser usados em outros módulos
export { db, query };
