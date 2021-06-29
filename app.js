//jshint esversion:6
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const schema = require(__dirname + "/model/Schemas.js");
const session = require("express-session");
const fileUpload = require('express-fileupload');
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(
  session({
    secret: "clave",
    resave: true,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(fileUpload());
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 

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


const playlistPorDefecto = new Playlist({
  nombre: "Canciones Favoritas"
})


// ROUTING

app.get("/", (req, res) => {
  res.render("index");
});

// LOGIN

app.get("/login", (req, res) => {
  res.render("login", { MensajeError: "" });
});

app.post("/login", (req, res) => {
  const contraseñaIngresada = req.body.pass;

  Usuario.findOne(
    { email: req.body.correoElectronico },
    (err, usuarioEncontrado) => {
      if (!err) {
        if (usuarioEncontrado == null) {
          // EN CASO DE QUE NO SE CONSIGA NINGUN USUARIO CON ESE CORREO
          res.render("login", {
            MensajeError: "No hay cuenta para ese correo",
          });
        } else if (
          bcrypt.compareSync(contraseñaIngresada, usuarioEncontrado.password)
        ) {
          // SI LAS CONTRASEÑAS COINCIDEN ENTONCES SE INICIA LA SESION Y SE DESPACHA AL USUARIO A LA VISTA PRINCIPAL DE LA PAGINA
          req.session.email = req.body.correoElectronico;
          req.session.idSess = usuarioEncontrado._id  //SE LE AGREGA EL ID A LA SESION
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
  const usuario = req.body.username;
  const email = req.body.mail;
  // HASHING
  const pass = req.body.pass;
  const hashPass = bcrypt.hashSync(pass, saltRounds);

  const nuevoUsuario = new Usuario({
    username: usuario,
    email: email,
    password: hashPass,
    playlists: [playlistPorDefecto] 
  });
  

  nuevoUsuario.save().then(
    res.render("register", {
      UsuarioAgregado: "Te haz registrado exitosamente!",
    })
  );
});

// VISTA MAIN

app.get("/home", (req, res) => {
  if (req.session.email == null) {
    // SI LA SESION NO TIENE CORREO ELECTRONICO QUIERE DECIR QUE EL USUARIO NO HA INICIADO SESION, POR LO TANTO SE LE REDIRIGE AL LOGIN
    res.redirect("/login");
  } else {
        Album.find({}, (err, albumsEncontrados) =>{
          if(!err){
            res.render("homepage", { idSesion: req.session.idSess, albums: albumsEncontrados });
          }
        })
      }
    });


// PERFIL DE USUARIO

app.get("/perfil/:id", (req, res) => {

  if (req.session.email == null) {
    res.redirect("/login");
  } else {
    Usuario.findOne({ _id: req.params.id }, (err, UsuarioEncontrado) => {
      if (!err) {
        res.render("perfil", {
          usuarioEncontrado: UsuarioEncontrado,
          idSesion: req.session.idSess,
          emailSesion: req.session.email,
        });
      }  else{
        console.log(err);
      }
    });
  }
});
// CANCIONES FAVORITAS DEL USUARIO

app.get("/perfil/:id/canciones-favoritas", (req, res) =>{

    Usuario.findOne({_id: req.params.id}, (err, UsuarioEncontrado) =>{
      res.render("playlists", {idSesion: req.session.idSess , playlist: UsuarioEncontrado.playlists[0]})
    })

})


// ALBUM

app.get("/album/:idAlbum", (req,res) =>{
  const albumSolicitado  = (req.params.idAlbum);
  
  Album.findOne({_id: albumSolicitado}, (err, albumEncontrado)=>{
    if(!err){
      res.render("album", {idSesion: req.session.idSess, album: albumEncontrado})
    }
  })

})


// SUBIR IMAGEN
app.post("/upload", (req, res) =>{
  let imagenSubida;
  let rutaImagenPerfil;
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("No se subieron archivos")
  }
  imagenSubida = req.files.imagenPerfil;
  rutaImagenPerfil = __dirname + "/public/images/"+ req.session.idSess+".png";

  imagenSubida.mv(rutaImagenPerfil, function(err) {
    if(!err){
      console.log("Imagen Subida exitosamente!");
      res.redirect("/perfil/"+req.session.idSess);
    }else{
      console.log("No funciono");
    }
  })

})


// CERRAR SESION

app.get("/cerrar-sesion", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
