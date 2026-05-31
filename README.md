# Projeto 2 – Programação Web Back-End  
## Victor Ehiti Itimura Tamay, Vitor Gabriel Menck Diniz

Este projeto foi desenvolvido no contexto da disciplina de Programação Web Back-End, tendo como objetivo a evolução da primeira etapa do sistema de e-commerce por meio da implementação de uma API REST utilizando Node.js, Express e MongoDB.

Nesta segunda etapa, o foco principal concentra-se na criação de rotas HTTP para autenticação, gerenciamento de usuários, vendedores e produtos, além da implementação de sessões para controle de acesso às funcionalidades da aplicação.

---

# Objetivos do Projeto

O sistema foi projetado para simular operações fundamentais de uma plataforma de comércio eletrônico, permitindo:

- Cadastro e autenticação de usuários
- Cadastro e autenticação de vendedores
- Controle de sessão utilizando cookies
- Publicação de produtos vinculados ao vendedor autenticado
- Busca e listagem de produtos
- Validação e persistência de dados em banco MongoDB

---

# Funcionalidades Implementadas

## Autenticação e Sessão

- Sistema de login para usuários e vendedores
- Controle de autenticação utilizando `express-session`
- Persistência de sessão durante a navegação
- Logout de usuários e vendedores
- Proteção de rotas privadas por meio de middlewares

---

## Usuários

### Funcionalidades
- Cadastro de usuário
- Login de usuário
- Consulta do usuário autenticado
- Logout

### Validações
- Nome contendo apenas letras
- CPF válido com 11 caracteres
- E-mail em formato válido
- Senha com tamanho mínimo definido
- Verificação de CPF duplicado

---

## Vendedores

### Funcionalidades
- Cadastro de vendedor
- Login de vendedor
- Consulta do vendedor autenticado
- Logout

### Validações
- Nome contendo apenas letras
- CNPJ válido com 14 caracteres
- E-mail válido
- Verificação de CNPJ duplicado

---

## Produtos

### Funcionalidades
- Cadastro de produtos
- Associação automática do produto ao vendedor autenticado
- Busca de produto por título
- Listagem geral de produtos

### Validações
- Título obrigatório
- Preço numérico positivo
- Descrição mínima obrigatória

---

# Estrutura da API

## Rotas de Usuários

| Método | Rota | Descrição |
|---|---|---|
| POST | `/users/register` | Cadastro de usuário |
| POST | `/users/login` | Login de usuário |
| GET | `/users/me` | Retorna usuário autenticado |
| POST | `/users/logout` | Logout do usuário |

---

## Rotas de Vendedores

| Método | Rota | Descrição |
|---|---|---|
| POST | `/sellers/register` | Cadastro de vendedor |
| POST | `/sellers/login` | Login de vendedor |
| GET | `/sellers/me` | Retorna vendedor autenticado |
| POST | `/sellers/logout` | Logout do vendedor |

---

## Rotas de Produtos

| Método | Rota | Descrição |
|---|---|---|
| POST | `/products` | Cadastro de produto |
| GET | `/products` | Lista todos os produtos |
| GET | `/products/search?title=` | Busca produto por título |

---

# Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **MongoDB**
- **MongoDB Driver**
- **Express Session**
- **JavaScript**

---

# Estrutura do Projeto

```bash
Projeto2Back-End/
│
├── app.js
├── database.js
├── index.js
├── User.js
├── Seller.js
├── Product.js
├── erros.log
└── node_modules/
```

---

# Como Executar o Projeto

## 1. Clone o repositório

```bash
git clone <url-do-repositorio>
```

---

## 2. Acesse a pasta do projeto

```bash
cd Projeto2Back-End
```

---

## 3. Instale as dependências

```bash
npm install
```

---

## 4. Configure a conexão com o MongoDB

Abra o arquivo `database.js` e configure a URL de conexão com seu banco MongoDB local ou MongoDB Atlas.

Exemplo:

```javascript
const url = "mongodb://localhost:27017";
```

---

## 5. Execute o servidor

```bash
node app.js
```

ou

```bash
npm start
```

---

## 6. Acesse a API

Servidor disponível em:

```bash
http://localhost:3000
```

---

# Tratamento de Erros

O projeto possui tratamento de exceções para operações críticas da aplicação, registrando erros no arquivo:

```bash
erros.log
```

Isso permite melhor rastreabilidade e depuração durante o desenvolvimento.

---

# Considerações Finais

Este projeto representa a evolução da primeira etapa da biblioteca de acesso ao banco de dados, incorporando conceitos fundamentais do desenvolvimento back-end moderno, como:

- Arquitetura baseada em APIs REST
- Gerenciamento de sessões
- Middlewares
- Controle de autenticação
- Integração entre aplicação e banco de dados
- Organização modular do código

A aplicação foi desenvolvida visando maior organização, reutilização de código e escalabilidade futura.
