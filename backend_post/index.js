const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const { Picsum } = require('picsum-photos')
const cors = require('cors');
const { title } = require('process');
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


// Create Post
app.post('/', async (req, res) => {
  const { content } = req.body;
  const imageUrl = Picsum.url();
  const userId = req.headers['x-user-id'];
  console.log('Creating post by userId:', userId);
  pool.query(
    `INSERT INTO posts (title, content, image_url, user_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, content, imageUrl, userId]
  )
    .then((result) => {
      res.json(result.rows[0].id); //esto lo cambiamos luego
    })
    .catch((err) => {
      console.error('Error creando post:', err);
      res.status(500).json({ error: 'Error al crear post' });
    });
    console.log('Post created by userId:', userId);
});

// Delete Post
app.delete("/:id", async (req, res) => {
  const { id } = req.params
  const userId = req.headers['x-user-id'];

  try {
    const result = await pool.query(
      `SELECT * FROM posts WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este post' });
    }
    await pool.query(
      `DELETE FROM comments 
       WHERE post_id = $1`,
      [id]
    );
    await pool.query(
      `DELETE FROM likes 
       WHERE post_id = $1`,
      [id]
    );
    await pool.query(
      `DELETE FROM posts 
       WHERE id = $1`,
      [id]
    );
    res.json({ message: 'Post eliminado correctamente' });
  }
  catch (err) {
    console.error('Error eliminando post:', err);
    res.status(500).json({ error: 'Error al eliminar post' });
  }
});


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log('Usuarios de prueba: admin/adminpass y user/userpass');
});
