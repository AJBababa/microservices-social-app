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

// Get Comments
app.get('/:postId', async (req, res) => {
  console.log('Received request to get comments');
  const { postId } = req.params
  pool.query(
    `SELECT comments.id, comments.content, comments.user_id, users.username
     FROM comments
     JOIN users ON comments.user_id = users.id
     WHERE comments.post_id = $1`,
    [postId]
  )
    .then((result) => {
      res.json(result.rows)
    })
    .catch((err) => {
      console.error('Error obteniendo comentarios:', err);
      res.status(500).json({ error: 'Error al obtener comentarios' });
    });
});

// Add Comment
app.post('/', async (req, res) => {
  console.log('Received request to add comment');
  const { content, postId } = req.body
  const userId = req.headers['x-user-id'];
  console.log('Adding comment to postId:', postId, 'by userId:', userId);
  pool.query(
    `INSERT INTO comments (content, user_id, post_id)
     VALUES ($1, $2, $3) RETURNING id`,
    [content, userId, postId]
  )
    .then((result) => {
      res.json(result.rows[0].id); //esto lo cambiamos luego
    })
    .catch((err) => {
      console.error('Error creando comentario:', err);
      res.status(500).json({ error: 'Error al crear comentario' });
    });
  console.log('Comment added to postId:', postId, 'by userId:', userId);
});

// Delete Comment
app.delete('/:id', async (req, res) => {
  console.log('Received request to delete comment');
  const { id } = req.params
  const userId = req.headers['x-user-id'];
  console.log('Request to delete comment with id:', id, 'by userId:', userId);
  pool.query(
    ` SELECT * FROM comments WHERE id = $1 AND user_id = $2`,
    [id, userId]
  )
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
      }
      pool.query(
        `DELETE FROM comments WHERE id = $1`,
        [id]
      )
        .then(() => {
          res.json({ message: 'Comentario eliminado correctamente' });
        })
        .catch((err) => {
          console.error('Error eliminando comentario:', err);
          res.status(500).json({ error: 'Error al eliminar comentario' });
        });
      console.log('Deleting comment with id:', id, 'by userId:', userId);

    })
    .catch((err) => {
      console.error('Error verificando comentario:', err);
      res.status(500).json({ error: 'Error al verificar comentario' });
    });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log('Usuarios de prueba: admin/adminpass y user/userpass');
});
