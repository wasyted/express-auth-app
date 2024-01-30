var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('sign-up-form', { title: 'Register / Login'});
});


const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
);

router.post("/", async (req, res, next) => {
  const saltRounds = 10; // Número de rondas para el algoritmo de cifrado
  try {
    // Cifrar la contraseña con bcrypt
    bcrypt.hash(req.body.password, saltRounds, async (err, hashedPassword) => {
      if (err) {
        // Manejar el error de cifrado
        return next(err);
      }

      // Crear un nuevo usuario con la contraseña cifrada
      const user = new User({
        username: req.body.username,
        password: hashedPassword // Usar la contraseña cifrada
      });

      // Almacenar el usuario en la base de datos
      const result = await user.save();

      // Redirigir después de almacenar en la base de datos
      res.redirect("/");
    });
  } catch (err) {
    // Manejar otros errores
    return next(err);
  }
});

module.exports = router;
