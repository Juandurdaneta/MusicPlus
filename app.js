//jshint esversion:6
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const schema = require(__dirname + "/model/Schemas.js");
const bodyParser = require("body-parser");
const session = require("express-session");

app.use(session({ secret: "ssshhhhh", saveUninitialized: true, resave: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// CONEXION CON LA BASE DE DATOS
mongoose.connect(
  "mongodb+srv://JuanUrdaneta:admin@cluster0.cyltp.mongodb.net/MusicPlus",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

//SCHEMAS
const Usuario = schema.getUsuario();
const Cancion = schema.getCancion();
const Playlist = schema.getPlaylist();
const Artista = schema.getArtista();
const Album = schema.getAlbum();

// ROUTING

app.get("/", (req, res) => {
  res.render("index");
});
// LOGIN

app.get("/login", (req, res) => {
  res.render("login", { MensajeError: "" });
});

app.post("/login", (req, res) => {
  Usuario.findOne(
    { email: req.body.correoElectronico },
    (err, usuarioEncontrado) => {
      if (!err) {
        if (usuarioEncontrado == null) {
          // EN CASO DE QUE NO SE CONSIGA NINGUN USUARIO CON ESE CORREO
          res.render("login", {
            MensajeError: "No hay cuenta para ese correo",
          });
        } else if (usuarioEncontrado.password == req.body.pass) {
          // SI LAS CONTRASEÑAS COINCIDEN ENTONCES SE INICIA LA SESION Y SE DESPACHA AL USUARIO A LA VISTA PRINCIPAL DE LA PAGINA
          res.redirect("/home");
        } else {
          res.render("login", {
            MensajeError: "Contraseña incorrecta, intentalo de nuevo.",
          });
        }
      } else {
        // EN CASO DE QUE HAYA ALGUN ERROR
        console.log(err);
      }
    }
  );
});

// REGISTRO

app.get("/register", (req, res) => {
  res.render("register", { UsuarioAgregado: "" });
});

app.post("/register", (req, res) => {
  const nuevoUsuario = new Usuario({
    username: usuario,
    email: email,
    password: contraseña,
  });

  nuevoUsuario
    .save()
    .then(
      res.render("register", {
        UsuarioAgregado: "Te haz registrado exitosamente!",
      })
    );
});

app.get("/perfil/:id", (req, res) => {});

app.get("/home", (req, res) => {
  res.render("homepage");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
