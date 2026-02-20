const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;
const JWT_SECRET = 'patata-secreta';

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// eslint-disable-next-line no-undef
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const pool = new Pool({
  // eslint-disable-next-line no-undef
  host: process.env.DB_HOST || 'dreamy_buck',
  // eslint-disable-next-line no-undef
  port: process.env.DB_PORT || 5432,
  // eslint-disable-next-line no-undef
  database: process.env.DB_NAME || 'monolito',
  // eslint-disable-next-line no-undef
  user: process.env.DB_USER || 'postgres',
  // eslint-disable-next-line no-undef
  password: process.env.DB_PASSWORD || 'Rumbo2005',
});

app.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Tarefik header x-forwarded-uri:', req.headers['x-forwarded-uri']);
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401);
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT verification failed:', err.message);
      return res.sendStatus(403);
    }
    res.setHeader('x-user-id', String(decoded.id));
    res.setHeader('x-user-role', decoded.role);
    res.setHeader('x-user-name', decoded.username);
    return res.sendStatus(200);
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username])
    .then(async (result) => {
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token });
    })
    .catch((err) => {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Error en el servidor' });
    });
});
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log('Usuarios de prueba: admin/adminpass y user/userpass');
});
