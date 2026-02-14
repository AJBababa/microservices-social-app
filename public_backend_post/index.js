const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

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


app.get('/', async (req, res) => {
    const result = await pool.query(`
      SELECT posts.id, posts.title, posts.image_url, posts.content, posts.user_id, users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
    `);
    res.json(result.rows);
});


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log('Usuarios de prueba: admin/adminpass y user/userpass');
});
