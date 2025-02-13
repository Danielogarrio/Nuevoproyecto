const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'yourSecretKey', { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});

module.exports = router;