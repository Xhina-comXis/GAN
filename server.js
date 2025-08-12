
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Habilita o CORS para que seu frontend possa se comunicar com o backend
app.use(cors());

// Pasta onde as imagens serão salvas
const UPLOADS_DIR = './uploads';
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Configuração do Multer para lidar com o upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        // Cria um nome de arquivo único para evitar sobreposição
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// ---- ROTAS DA API ----

// 1. Rota para o frontend ENVIAR uma imagem
app.post('/upload', upload.single('imagem'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }
    console.log('Imagem recebida e salva:', req.file.filename);
    res.status(200).send({ message: 'Upload bem-sucedido!', filename: req.file.filename });
});

// 2. Rota para o ANALISTA BUSCAR uma imagem
// (Uma lógica simples para pegar a imagem mais antiga que ainda não foi analisada)
app.get('/proxima-imagem', (req, res) => {
    // Em um sistema real, você teria um banco de dados para controlar o status (ex: "pendente", "analisado")
    // Aqui, vamos apenas pegar o arquivo mais antigo da pasta.
    const files = fs.readdirSync(UPLOADS_DIR)
        .map(fileName => ({
            name: fileName,
            time: fs.statSync(path.join(UPLOADS_DIR, fileName)).mtime.getTime(),
        }))
        .sort((a, b) => a.time - b.time)
        .map(file => file.name);

    if (files.length === 0) {
        return res.status(404).send({ message: 'Nenhuma imagem pendente para análise.' });
    }

    res.status(200).send({ filename: files[0] });
});

// 3. Permite que o frontend acesse as imagens salvas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});