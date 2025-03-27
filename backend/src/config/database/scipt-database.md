# Script database

```sql
-- Tabela users corrigida
CREATE TABLE users (
    id         VARCHAR (50)  PRIMARY KEY,
    name       VARCHAR (100) NOT NULL,
    email      VARCHAR (100) UNIQUE NOT NULL,
    password   VARCHAR (255) NOT NULL,
    role       VARCHAR (20)  NOT NULL,
    status     VARCHAR (20)  NOT NULL  -- Vírgula extra removida
);

-- Tabela fisicos corrigida (sem created_at)
CREATE TABLE fisicos (
    id                        INTEGER       PRIMARY KEY AUTOINCREMENT,
    received_at               DATE          NOT NULL,
    id_document               VARCHAR (25)  UNIQUE NOT NULL,
    delivery_deadline         DATE          NOT NULL,
    internal_delivery_user_id VARCHAR (50)  NOT NULL,
    message                   VARCHAR (140),  -- Sem CURRENT_TIMESTAMP
    FOREIGN KEY (internal_delivery_user_id) REFERENCES users (id) 
);

-- Tabela extras corrigida (sem created_at)
CREATE TABLE extras (
    id                        INTEGER       PRIMARY KEY AUTOINCREMENT,
    received_at               DATE          NOT NULL,
    id_document               VARCHAR (25)  UNIQUE NOT NULL,
    delivery_deadline         DATE          NOT NULL,
    internal_delivery_user_id VARCHAR (50)  NOT NULL,
    message                   VARCHAR (140),  -- Sem CURRENT_TIMESTAMP
    FOREIGN KEY (internal_delivery_user_id) REFERENCES users (id) 
);

-- Índices mantidos (já estavam corretos)
CREATE INDEX idx_fisicos_received_at ON fisicos(received_at);
CREATE INDEX idx_fisicos_deadline ON fisicos(delivery_deadline);
CREATE INDEX idx_extras_received_at ON extras(received_at);
CREATE INDEX idx_extras_deadline ON extras(delivery_deadline);
```
