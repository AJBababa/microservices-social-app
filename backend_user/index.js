const express = require('express');
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


app.get('/profile', (req, res) => {
  const userId = req.headers['x-user-id'];
  const userName = req.headers['x-user-name'];
  const userRole = req.headers['x-user-role'];

  const user = {
    id: userId,
    username: userName,
    role: userRole
  };

  res.json({ message: `Este es tu perfil.`, user });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log('Usuarios de prueba: admin/adminpass y user/userpass');
});
