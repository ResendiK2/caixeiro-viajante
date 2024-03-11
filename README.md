# Caixeiro Viajante

- Usar o comando `npm install` para instalar as dependências do projeto.
    - Versão do Node: v18.17.1
    - Versão do NPM: 9.6.7

- O arquivo de .env deve conter as seguintes variáveis

```
    PORT=your_port
    DATABASE_URL=your_database_url
```

- DLL do Postgres:
  - Versão do Postgres DB: 11.18
  
```
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  coordinate_x INTEGER DEFAULT NULL,
  coordinate_y INTEGER DEFAULT NULL
);
``` 

Para rodar o projeto, basta executar o comando `npm start` no terminal.


    
