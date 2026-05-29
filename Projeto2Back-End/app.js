const express = require('express');
const session = require('express-session');
const connectDB = require('./database');

const User = require('./User');
const Seller = require('./Seller');
const Product = require('./Product');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'projeto-ecommerce',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
  })
);

function ensureUserLogged(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Usuário não autenticado. Faça login para acessar.' });
  }
  next();
}

function ensureSellerLogged(req, res, next) {
  if (!req.session.seller) {
    return res.status(401).json({ error: 'Vendedor não autenticado. Faça login para acessar.' });
  }
  next();
}

app.get('/', (req, res) => {
  res.json({ message: 'API do Projeto funcionando' });
});

// ---------------- ROTAS DE USUÁRIOS ---------------------

app.post('/users/register', async (req, res) => {
  const { name, cpf, email, password } = req.body;

  try {
    const user = new User(name, cpf, email, password);
    user.authenticate();
    await user.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.status(400).json({
      error: err.message || 'Erro ao cadastrar usuário. Verifique os dados.',
    });
  }
});

app.post('/users/login', async (req, res) => {
  const { cpf, password } = req.body;

  try {
    const user = await User.searchByCpf(cpf);

    if (!user) {
      return res.status(401).json({ error: 'CPF ou senha inválidos.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'CPF ou senha inválidos.' });
    }

    req.session.user = {
      name: user.name,
      cpf: user.cpf,
      email: user.email,
    };

    res.json({ message: 'Login de usuário realizado com sucesso!' });
  } catch (err) {
    console.error('Erro no login de usuário:', err);
    res.status(500).json({ error: 'Erro interno do servidor ao tentar login.' });
  }
});

app.get('/users/me', ensureUserLogged, (req, res) => {
  res.json({ user: req.session.user });
});

app.post('/users/logout', ensureUserLogged, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao fazer logout do usuário:', err);
      return res.status(500).json({ error: 'Erro ao finalizar sessão.' });
    }
    res.json({ message: 'Logout de usuário realizado com sucesso!' });
  });
});

// ---------------- ROTAS DE VENDEDORES -------------------

app.post('/sellers/register', async (req, res) => {
  const { name, cnpj, email, password } = req.body;

  try {
    const seller = new Seller(name, cnpj, email, password);
    seller.authenticate();
    await seller.save();
    res.status(201).json({ message: 'Vendedor cadastrado com sucesso!' });
  } catch (err) {
    res.status(400).json({
      error: err.message || 'Erro ao cadastrar vendedor. Verifique os dados.',
    });
  }
});

app.post('/sellers/login', async (req, res) => {
  const { cnpj, password } = req.body;

  try {
    const seller = await Seller.searchByCnpj(cnpj);

    if (!seller) {
      return res.status(401).json({ error: 'CNPJ ou senha inválidos.' });
    }

    if (seller.password !== password) {
      return res.status(401).json({ error: 'CNPJ ou senha inválidos.' });
    }

    req.session.seller = {
      name: seller.name,
      cnpj: seller.cnpj,
      email: seller.email,
    };

    res.json({ message: 'Login de vendedor realizado com sucesso!' });
  } catch (err) {
    console.error('Erro no login de vendedor:', err);
    res.status(500).json({ error: 'Erro interno do servidor ao tentar login de vendedor.' });
  }
});

app.get('/sellers/me', ensureSellerLogged, (req, res) => {
  res.json({ seller: req.session.seller });
});

app.post('/sellers/logout', ensureSellerLogged, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao fazer logout do vendedor:', err);
      return res.status(500).json({ error: 'Erro ao finalizar sessão de vendedor.' });
    }
    res.json({ message: 'Logout de vendedor realizado com sucesso!' });
  });
});

// ---------------- ROTAS DE PRODUTOS ---------------------

app.post('/products', ensureSellerLogged, async (req, res) => {
  const { adTitle, price, description } = req.body;
  const sellerCnpj = req.session.seller.cnpj;

  try {
    const numericPrice = Number(price);
    const product = new Product(adTitle, numericPrice, description, sellerCnpj);
    product.authenticate();
    await product.save();

    res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
  } catch (err) {
    res.status(400).json({
      error: err.message || 'Erro ao cadastrar produto. Verifique os dados.',
    });
  }
});

app.get('/products/search', async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: 'O parâmetro "title" é obrigatório para a busca.' });
  }

  try {
    const product = await Product.searchByAdTitle(title);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    res.json(product);
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar produto.' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection('products');
    const products = await collection.find({}).toArray();
    res.json(products);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ error: 'Erro interno do servidor ao listar produtos.' });
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Falha ao conectar ao banco de dados:', err);
  process.exit(1);
});
