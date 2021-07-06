//jshint esversion:6
const express = require("express");
const app = express();
const fs = require("fs");
const mongoose = require("mongoose");
const _ = require("lodash");
const schema = require(__dirname + "/model/Schemas.js");
const session = require("express-session");
const fileUpload = require("express-fileupload");

app.use(
  session({
    secret: "clave",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static("public"));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONEXION CON LA BASE DE DATOS
mongoose.connect(
  "mongodb+srv://JuanUrdaneta:admin@cluster0.cyltp.mongodb.net/MusicPlus",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
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
  res.sendFile(__dirname + "/views/index.html");
});

// LOGIN

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.post("/login", (req, res) => {
  const contraseñaIngresada = req.body.pass;

  Usuario.findOne(
    { email: req.body.correoElectronico },
    (err, usuarioEncontrado) => {
      if (!err) {
        if (usuarioEncontrado == null) {
          // EN CASO DE QUE NO SE CONSIGA NINGUN USUARIO CON ESE CORREO
          res.send({
            Status: 100,
            mensaje: "No existe usuario para ese correo electronico.",
          });
        } else if (contraseñaIngresada == usuarioEncontrado.password) {
          // SI LAS CONTRASEÑAS COINCIDEN ENTONCES SE INICIA LA SESION Y SE DESPACHA AL USUARIO A LA VISTA PRINCIPAL DE LA PAGINA
          req.session.email = req.body.correoElectronico;
          req.session.idSess = usuarioEncontrado._id; //SE LE AGREGA EL ID A LA SESION
          res.send({ Status: 200, mensaje: "Funciono" });
        } else {
          // SI LAS CONTRASEÑAS NO COINCIDEN
          res.send({
            Status: 100,
            mensaje: "Credenciales incorrectas, vuelva a intentarlo.",
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
  res.sendFile(__dirname + "/views/register.html");
});

app.post("/register", (req, res) => {
  const usuario = req.body.username;
  const email = req.body.mail;
  // HASHING
  const pass = req.body.pass;

  const nuevoUsuario = new Usuario({
    username: usuario,
    email: email,
    password: pass,
  });

  nuevoUsuario.save((err, usuario) => {
    const playlistPorDefecto = new Playlist({
      nombre: "Canciones Favoritas de " + usuario.username,
      propietario: usuario._id,
    });

    playlistPorDefecto.save();
    usuario.playlists.push(playlistPorDefecto);
    usuario.save();
  });
  res.send({ Status: 200, mensaje: "Usuario creado Exitosamente!." });
});

// VISTA MAIN

app.get("/home", (req, res) => {
  if (req.session.email == null) {
    // SI LA SESION NO TIENE CORREO ELECTRONICO QUIERE DECIR QUE EL USUARIO NO HA INICIADO SESION, POR LO TANTO SE LE REDIRIGE AL LOGIN
    res.redirect("/login");
  } else {
    res.sendFile(__dirname + "/views/homepage.html");
  }
});

app.get("/home/obtenerDatos", (req, res) => {
  Album.find({}, (err, albumsEncontrados) => {
    if (!err) {
      res.send({
        status: 200,
        albums: albumsEncontrados,
        idSesion: req.session.idSess,
      });
    }
  });
});

// PERFIL DE USUARIO

app.get("/perfil/:id", (req, res) => {
  if (req.session.email == null) {
    res.redirect("/login");
  } else {
    res.sendFile(__dirname + "/views/perfil.html");
  }
});

app.post("/perfil/:id", (req, res) => {
  // VARIABLES OBTENIDAS DEL FORMULARIO
  var contraseñaActual = req.body.contraseñaActual;
  const nuevaContraseña = req.body.nuevaContraseña;
  const nuevaContraseñaConfirmar = req.body.nuevaContraseñaConfirmar;
  // HALLANDO LA CONTRASEÑA DEL USUARIO EN LA BASE DE DATOS
  Usuario.findOne({ _id: req.params.id }, (err, UsuarioEncontrado) => {
    if (contraseñaActual == UsuarioEncontrado.password) {
      if (nuevaContraseña == nuevaContraseñaConfirmar) {
        // EN CASO DE QUE LAS CONTRASEÑAS COINCIDAN CON LA DE LA BASE DE DATOS
        Usuario.findOneAndUpdate(
          { _id: req.params.id },
          { password: nuevaContraseña },
          (err) => {
            if (!err) {
              res.send({
                status: 200,
                mensaje: "Contraseña cambiada exitosamente!.",
              });
            } else {
              res.send({
                status: 100,
                mensaje: "Ha ocurrido un error, vuelve a intentarlo.",
              });
            }
          }
        );

        // EN CASO DE QUE LAS CONTRASEÑAS NO COINCIDAN
      } else {
        res.send({
          status: 100,
          mensaje: "Las contraseñas no coinciden.",
        });
      }
      // EN CASO DE QUE LA CONTRASEÑA ACTUAL NO COINCIDA CON LA DE LA BASE DE DATOS
    } else {
      res.send({
        status: 100,
        mensaje: "Contraseña incorrecta.",
      });
    }
  });
});

app.get("/perfil/:id/obtenerDatos", (req, res) => {
  Usuario.findOne({ _id: req.params.id }, (err, UsuarioEncontrado) => {
    if (!err) {
      res.send({
        status: 200,
        usuario: UsuarioEncontrado,
        idSesion: req.session.idSess,
      });
    }
  });
});

// SUBIR IMAGEN DE PERFIL
app.post("/upload", (req, res) => {
  let imagenSubida;
  let rutaImagenPerfil;
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("No se subieron archivos");
  }
  imagenSubida = req.files.imagenPerfil;
  rutaImagenPerfil =
    __dirname + "/public/images/" + req.session.idSess + ".png";

  Usuario.findOneAndUpdate(
    { _id: req.session.idSess },
    { imagenPerfil: req.session.idSess },
    (err) => {
      if (!err) {
        imagenSubida.mv(rutaImagenPerfil, function (err) {
          if (!err) {
            console.log("Imagen Subida exitosamente!");
            res.redirect("/perfil/" + req.session.idSess);
          } else {
            console.log("No funciono");
          }
        });
      }
    }
  );
});

// ELIMINAR CUENTA DE USUARIO

app.post("/eliminarCuenta", (req, res) => {
  try {
   Playlist.deleteMany({propietario : req.session.idSess}).then(console.log("Las playlists del usuario con ID "+req.session.idSess+" han sido eliminadas"));
   Usuario.findByIdAndRemove(req.session.idSess, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Usuario eliminado exitosamente")
        req.session.destroy();
      }
    });

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// ALBUM

app.get("/album/:idAlbum", (req, res) => {
  res.sendFile(__dirname + "/views/album.html");
});

app.get("/album/:idAlbum/obtenerDatos", (req, res) => {
  Album.findOne({ _id: req.params.idAlbum }, (err, albumEncontrado) => {
    if (!err) {
      Artista.findOne({_id: albumEncontrado.autor}, (err, artistaEncontrado) =>{
        res.send({
          status: 200,
          album: albumEncontrado,
          idSesion: req.session.idSess,
          autor: artistaEncontrado
        });
      })
    }
  });
});

// CANCION
app.get("/cancion/:idCancion", (req, res) => {
  if(req.session.idSess != null){
    res.sendFile(__dirname + "/views/cancion.html");
  } else{
    res.redirect("/login")
  }
});

app.get("/cancion/:idCancion/obtenerDatos", (req, res) => {

  if(req.session.idSess == null){
    res.redirect("/login");
  } else{
    Cancion.findOne({ _id: req.params.idCancion }, (err, cancionEncontrada) => {
      Usuario.findOne({ _id: req.session.idSess }, (err, UsuarioEncontrado) => {
        
        
        Playlist.findOne(
          {
            nombre: /Canciones Favoritas de /i,
            propietario: UsuarioEncontrado._id,
          },
          (err, cancionesFavoritas) => {
            if (!err) {
              res.send({
                status: 200,
                cancion: cancionEncontrada,
                sesionUsuario: UsuarioEncontrado,
                cancionesFavoritas : cancionesFavoritas
              });
            }
          }
        );
      });
    });
  }
 
});

// ENDPOINT PARA AGREGAR CANCION A UNA PLAYLIST
app.get("/cancion/:idCancion/:idPlaylist/agregar", (req, res)=> {
  const cancionRequerida = req.params.idCancion;
  const playlistRequerida = req.params.idPlaylist;

  Playlist.findOne({_id: playlistRequerida}, (err, playlistEncontrada) =>{
    Cancion.findOne({_id: cancionRequerida}, (err, cancionEncontrada) =>{
      if(!err){
       playlistEncontrada.canciones.push(cancionEncontrada);
       playlistEncontrada.save().then(res.redirect("/cancion/"+cancionRequerida));
       
      }
    })
  })

})

// ENDPOINT PARA QUITAR UNA CANCION DE UNA PLAYLIST

app.get("/cancion/:idCancion/:idPlaylist/quitar", (req, res) =>{
  const cancionRequerida = req.params.idCancion;
  const playlistRequerida = req.params.idPlaylist;

  Playlist.findOneAndUpdate({_id: playlistRequerida}, {$pull: {canciones: {_id: cancionRequerida} }}, (err, playlist)=>{
    if(!err){
      res.redirect("/cancion/"+cancionRequerida);
    }
  })

})

// PLAYLIST
app.get("/playlist/:idPlaylist", (req, res) => {
  res.sendFile(__dirname + "/views/playlist.html");
});

app.get("/playlist/:idPlaylist/obtenerDatos", (req, res) => {
  Playlist.findOne(
    { _id: req.params.idPlaylist },
    (err, playlistEncontrada) => {
      if (!err) {
        Usuario.findOne(
          { _id: req.session.idSess },
          (err, UsuarioEncontrado) => {
            res.send({
              status: 200,
              playlist: playlistEncontrada,
              idSesion: req.session.idSess,
              usuario: UsuarioEncontrado,
            });
          }
        );
      }
    }
  );
});

// CREAR PLAYLIST

app.post("/playlist", (req, res) =>{
  let imagenPortadaPlaylist;
  let rutaImagenPlaylist;

  const nuevaPlaylist = new Playlist({
    nombre: req.body.nombreNuevaPlaylist,
    propietario: req.session.idSess
  })

  nuevaPlaylist.save( (err, nuevaplaylist) =>{
    if(!err){
      // CHEQUEANDO QUE SE HAYA SUBIDO UN ARCHIVO
      if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No se subieron archivos");
      }
     
      imagenPortadaPlaylist = req.files.imagenPortadaPlaylist;
      rutaImagenPlaylist = __dirname+"/public/images/"+nuevaplaylist._id+".png";
      nuevaplaylist.imagenPortada = nuevaplaylist._id;
      // SUBIENDO LA IMAGEN DE PORTADA 
      imagenPortadaPlaylist.mv(rutaImagenPlaylist, function(err) {
        if(!err){
          console.log("Imagen Subida exitosamente");
          nuevaplaylist.save();
          res.redirect("/perfil/" + req.session.idSess);
        } else{
          console.log("No funciono" + err)
        }
      })
      // AGREGANDO LA PLAYLIST AL USUARIO
      Usuario.findOne({_id: req.session.idSess}, (err, usuarioEncontrado) => {
        if(!err){
          usuarioEncontrado.playlists.push(nuevaplaylist);
          usuarioEncontrado.save();  
        }
        })

    }
  })

})


//SEGUIR PLAYLIST

app.get("/playlist/seguir/:idPlaylist", (req, res) => {
  const idPlaylistASeguir = req.params.idPlaylist;
  const idUsuario = req.session.idSess;

  Playlist.findOne({ _id: idPlaylistASeguir }, (err, playlist) => {
    Usuario.findOne({ _id: idUsuario }, (err, usuario) => {
      usuario.playlists.push(playlist);
      usuario.save();
      res.redirect("/playlist/" + idPlaylistASeguir);
    });
  });
});
// DEJAR DE SEGUIR PLAYLIST
app.get("/playlist/dejar-de-seguir/:idPlaylist", (req, res) => {
  const idPlaylistADejarDeSeguir = req.params.idPlaylist;
  const idUsuario = req.session.idSess;

  Usuario.findOneAndUpdate(
    { _id: idUsuario },
    { $pull: { playlists: { _id: idPlaylistADejarDeSeguir } } },
    (err, usuario) => {
      if (!err) {
        res.redirect("/playlist/" + idPlaylistADejarDeSeguir);
      }
    }
  );
});

// BUSQUEDA 

app.get("/buscar", (req, res) =>{
  res.sendFile(__dirname+"/views/buscar.html");
})

app.post("/buscar", (req, res) =>{
  const query = req.body.busqueda;

  Cancion.find({nombreCancion:  { $regex: '.*' + query + '.*', $options: 'i' }}, (err, cancionesEncontradas) =>{
    Album.find({nombreAlbum:  { $regex: '.*' + query + '.*', $options: 'i' } }, (err, albumesEncontrados) =>{
      Artista.find({nombreArtista :{ $regex: '.*' + query + '.*', $options: 'i' } }, (err, artistasEncontrados) =>{
        Playlist.find({nombre: { $regex: '.*' + query + '.*', $options: 'i' }}, (err, playlistsEncontradas) =>{


          if(!err){
            res.send({
              status: 200,
              canciones: cancionesEncontradas,
              albumes: albumesEncontrados,
              artistas: artistasEncontrados,
              playlists: playlistsEncontradas,
              idSesion: req.session.idSess,
              busqueda : query
            })
          } else {
            res.send({
              status: 100
            })
          }
     


        })
      })
    } )
  })
});


// ARTISTA
app.get("/artista/:idArtista", (req, res) =>{
  res.sendFile(__dirname+"/views/artista.html");
})

app.get("/artista/:idArtista/obtenerDatos", (req,res) =>{
const artistaRequerido = req.params.idArtista;

Artista.findOne({_id: artistaRequerido}, (err, artistaEncontrado) =>{
  if(!err){
    res.send({
      status: 200,
      artista: artistaEncontrado,
      idSession: req.session.idSess
    })
  }
})
});



// DATOS DE LA SESION
app.get("/sesion", (req, res) =>{
  res.send({
    status: 200,
    sesion: req.session.idSess
  })
})


// CERRAR SESION

app.get("/cerrar-sesion", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// EN CASO DE QUE SE ACCEDA A UN ENDPOINT INEXISTENTE
app.get('*', function(req, res){
  res.status(404).send("Error")
});


// ESCUCHANDO EN EL PUERTO

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server started succesfully");
});
