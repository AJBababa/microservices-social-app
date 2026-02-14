const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;
+
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


// Get Likes
app.get('/:postId', async (req, res) => {
  const { postId } = req.params
  pool.query(
    `SELECT COUNT(*) AS like_count
     FROM likes
     WHERE post_id = $1`,
    [postId]
  )
    .then((result) => {
      res.json({ likeCount: result.rows[0].like_count });
    })
    .catch((err) => {
      console.error('Error obteniendo likes:', err);
      res.json({ likeCount: 0 });
    });
});

// Add Like
app.post('/', async (req, res) => {
//el creador del like sera el del token;
  const { postId } = req.body
  const userId = req.headers['x-user-id'];
  pool.query(
    `INSERT INTO likes (user_id, post_id)
     VALUES ($1, $2) RETURNING id`,
    [userId, postId]
  )
    .then((result) => {
      res.json(result.rows[0].id); //esto lo cambiamos luego
    })
    .catch((err) => {
      console.error('Error creando like:', err);
      res.status(500).json({ error: 'Error al crear like' });
    });
});

app.post('/toggle', async (req, res) => {
  const { postId } = req.body;
  const userId = req.headers['x-user-id'];
  console.log('Toggle like for userId:', userId, 'and postId:', postId);
  
  try {
    const existingLike = await pool.query(
      `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
      [userId, postId]
    );
    console.log('Existing like query result:', existingLike.rows);
    if (existingLike.rows.length > 0) {
      // Si el like ya existe, eliminarlo
      await pool.query(
        `DELETE FROM likes WHERE id = $1 `,
        [existingLike.rows[0].id]
      );
      console.log('Like removed for userId:', userId, 'and postId:', postId);
      return res.json({ message: 'Like eliminado' });
    }
    await pool.query(
      `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
      [userId, postId]
    );
    res.json({ message: 'Like agregado' });
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ error: 'Error al cambiar el estado del like' });
  }
});

app.get('/doilike/:postId', async (req, res) => {
  const { postId } = req.params;
  const userId = req.headers['x-user-id'];
  try {
    const existingLike = await pool.query(
      `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
      [userId, postId],
    );
    if (existingLike.rows.length > 0) {
      return res.json({ liked: true });
    }
    res.json({ liked: false });
  } catch (err) {
    console.error('Error checking like status:', err);
    res.status(500).json({ error: 'Error al verificar el estado del like' });
  }
});

// Remove Like
app.delete('/:id', async (req, res) => {
//leeremos el id del post del req.body
//hay que verificar el token para saber quien lo crea
  const { postId } = req.params
  const userId = req.headers['x-user-id'];
  pool.query(
    `SELECT * FROM likes WHERE post_id = $1 AND user_id = $2`,
    [postId, userId]
  )
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar este like' });
      }
      pool.query(
        `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`,
        [postId, userId]
      )
    .then(() => {
      res.json({ message: 'Like eliminado correctamente' });
    })
    .catch((err) => {
      console.error('Error eliminando like:', err);
      res.status(500).json({ error: 'Error al eliminar like' });
    });
    })
    .catch((err) => {
      console.error('Error verificando like:', err);
      res.status(500).json({ error: 'Error al verificar like' });
    });
});
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log('Usuarios de prueba: admin/adminpass y user/userpass');
});
