const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
const { Picsum } = require('picsum-photos')
const cors = require('cors');
require('dotenv').config();

const app = express();

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

async function initDb() {
  pool.connect((err) => {
    if (err) {
      console.error('Error connecting to the database', err);
    } else {
      console.log('Connected to the database');
    }
  });
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
    )`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT NOT NULL,
      user_id INTEGER REFERENCES users(id)
      )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      user_id INTEGER REFERENCES users(id),
      post_id INTEGER REFERENCES posts(id)
      )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS likes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      post_id INTEGER REFERENCES posts(id)
      )`);

    console.log('Database initialized');

    const createUser = async (username, password, role) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        `INSERT INTO users (username, password, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (username) DO NOTHING`,
        [username, hashedPassword, role],
      );
    }

    await createUser('admin', 'adminpass', 'admin');
    await createUser('user', 'userpass', 'user');

    const manolitoHash = bcrypt.hash('manolito', 10);

    await pool.query(
      `INSERT INTO users (username, password, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (username) DO NOTHING`,
      ['manolito', manolitoHash, 'user'],
    );

    // Obtener el ID del nuevo usuario
    const manolitoUserResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      ['manolito'],
    );
    const manolitoUserId = manolitoUserResult.rows[0].id;

    // Insertar posts para testuser
    await pool.query(
      `INSERT INTO posts (title, content, image_url, user_id)
       VALUES 
       ($1, $2, $3, $4),
       ($5, $6, $7, $4)
      `,
      [
        'Post1',
        'Este es el contenido del primer post de testuser.',
        Picsum.url(),
        manolitoUserId,
        'Segundo post de prueba',
        'Contenido del segundo post de testuser.',
        Picsum.url(),
      ],
    );
  }
  catch (err) {
    console.error('Error initializing database', err);
  }
  finally {
    console.log('Closing database connection');
    await pool.end();
    process.exit(0);
  }
}




initDb();
