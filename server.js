// Importa os pacotes necessários
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

// Configuração do App Express
const app = express();
const port = 3000;

// Middlewares para aceitar JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONEXÃO COM O BANCO DE DADOS ---
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise(); // .promise() permite usar async/await para queries mais limpas

// --- ROTAS PARA SERVIR ARQUIVOS ESTÁTICOS (HTML, CSS) ---
// Serve a página de login principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// --- ROTAS DA API DE USUÁRIOS ---

// Rota para REGISTRAR um novo usuário
app.post('/api/usuarios/registrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Por favor, preencha todos os campos." });
    }

    try {
        const hashSenha = await bcrypt.hash(senha, 10); // Criptografa a senha
        await db.query(
            "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
            [nome, email, hashSenha]
        );
        res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Este e-mail já está em uso." });
        }
        console.error(error);
        res.status(500).json({ message: "Erro ao registrar usuário." });
    }
});

// Rota para LOGAR um usuário
app.post('/api/usuarios/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ message: "Por favor, preencha e-mail e senha." });
    }

    try {
        const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }

        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }
        
        // Login bem-sucedido!
        // Aqui você redirecionaria ou enviaria um token (JWT)
        res.status(200).json({ message: "Login de usuário bem-sucedido!", user: { id: user.id, nome: user.nome, email: user.email } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});


// --- ROTAS DA API DE FUNCIONÁRIOS ---

// Rota para REGISTRAR um novo funcionário (você pode querer proteger esta rota no futuro)
app.post('/api/funcionarios/registrar', async (req, res) => {
    const { nome, email, senha, cargo } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Por favor, preencha todos os campos." });
    }

    try {
        const hashSenha = await bcrypt.hash(senha, 10);
        await db.query(
            "INSERT INTO funcionarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)",
            [nome, email, hashSenha, cargo]
        );
        res.status(201).json({ message: "Funcionário registrado com sucesso!" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Este e-mail já está em uso." });
        }
        console.error(error);
        res.status(500).json({ message: "Erro ao registrar funcionário." });
    }
});

// Rota para LOGAR um funcionário/analista
app.post('/api/funcionarios/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ message: "Por favor, preencha e-mail e senha." });
    }

    try {
        const [rows] = await db.query("SELECT * FROM funcionarios WHERE email = ?", [email]);
        const funcionario = rows[0];

        if (!funcionario) {
            return res.status(401).json({ message: "E-mail ou senha de funcionário inválidos." });
        }

        const senhaValida = await bcrypt.compare(senha, funcionario.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: "E-mail ou senha de funcionário inválidos." });
        }

        // Login bem-sucedido!
        res.status(200).json({ message: "Login de funcionário bem-sucedido!", funcionario: { id: funcionario.id, nome: funcionario.nome, cargo: funcionario.cargo } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});


// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});