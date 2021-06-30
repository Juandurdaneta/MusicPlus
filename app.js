//jshint esversion:6
const express = require("express");
const app = express();
const fs = require('fs')
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
    useFindAndModify: false
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
  res.sendFile(__dirname+"/views/index.html");
});

// LOGIN

app.get("/login", (req, res) => {
  res.sendFile(__dirname+"/views/login.html");
});

app.post("/login", (req, res) => {
  const contraseñaIngresada = req.body.pass;

  Usuario.findOne(
    { email: req.body.correoElectronico },
    (err, usuarioEncontrado) => {
      if (!err) {
        if (usuarioEncontrado == null) {
          // EN CASO DE QUE NO SE CONSIGA NINGUN USUARIO CON ESE CORREO
          res.send({"Status": 100,
                    "mensaje":"No existe usuario para ese correo electronico."
                  });
        } else if (
          bcrypt.compareSync(contraseñaIngresada, usuarioEncontrado.password)
        ) {
          // SI LAS CONTRASEÑAS COINCIDEN ENTONCES SE INICIA LA SESION Y SE DESPACHA AL USUARIO A LA VISTA PRINCIPAL DE LA PAGINA
          req.session.email = req.body.correoElectronico;
          req.session.idSess = usuarioEncontrado._id  //SE LE AGREGA EL ID A LA SESION
          res.send({"Status": 200,
          "mensaje":"Funciono"
        });
        } else {
          // SI LAS CONTRASEÑAS NO COINCIDEN
          res.send({"Status": 100,
          "mensaje":"Credenciales incorrectas, vuelva a intentarlo."
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
  res.sendFile(__dirname+"/views/register.html");
});

app.post("/register", (req, res) => {
  const usuario = req.body.username;
  const email = req.body.mail;
  // HASHING
  const pass = req.body.pass;
  const hashPass = bcrypt.hashSync(pass, saltRounds);


  const playlistPorDefecto = new Playlist({
    nombre: "Canciones Favoritas de " + usuario 
  })

  playlistPorDefecto.save();

  const nuevoUsuario = new Usuario({
    username: usuario,
    email: email,
    password: hashPass,
    playlists: [playlistPorDefecto] 
  });
  

  nuevoUsuario.save()
  res.send({"Status": 200,
          "mensaje":"Usuario creado Exitosamente!."
        });

});

// VISTA MAIN

app.get("/home", (req, res) => {
   if (req.session.email == null) {
   // SI LA SESION NO TIENE CORREO ELECTRONICO QUIERE DECIR QUE EL USUARIO NO HA INICIADO SESION, POR LO TANTO SE LE REDIRIGE AL LOGIN
    res.redirect("/login");
   } else {
  res.sendFile(__dirname+"/views/homepage.html");
}


});


app.get("/home/obtenerDatos", (req,res) =>{
  Album.find({}, (err, albumsEncontrados) =>{
    if(!err){
      res.send({
        'status': 200,
        'albums': albumsEncontrados,
        'idSesion': req.session.idSess
      })
    }
  })
})

// PERFIL DE USUARIO

app.get("/perfil/:id", (req, res) => {

  if (req.session.email == null) {
    res.redirect("/login");
  } else{
    res.sendFile(__dirname+"/views/perfil.html")
  }
});

app.post("/perfil/:id", (req, res) =>{
  // VARIABLES OBTENIDAS DEL FORMULARIO
  var contraseñaActual = req.body.contraseñaActual;
  const nuevaContraseña = req.body.nuevaContraseña;
  const nuevaContraseñaConfirmar = req.body.nuevaContraseñaConfirmar;
// HALLANDO LA CONTRASEÑA DEL USUARIO EN LA BASE DE DATOS
  Usuario.findOne({_id: req.params.id}, (err, UsuarioEncontrado) =>{
      if( bcrypt.compareSync(contraseñaActual, UsuarioEncontrado.password)){
        if(nuevaContraseña == nuevaContraseñaConfirmar){
          const hashPass = bcrypt.hashSync(nuevaContraseña, saltRounds);

// EN CASO DE QUE LAS CONTRASEÑAS COINCIDAN CON LA DE LA BASE DE DATOS
          Usuario.findOneAndUpdate({_id: req.params.id}, {password: hashPass}, (err)=>{
            if(!err){
              res.send({
                'status': 200,
                'mensaje' : "Contraseña cambiada exitosamente!."
              })
            } else{
              res.send({
                'status': 100,
                'mensaje': "Ha ocurrido un error, vuelve a intentarlo."
              })
            }
          } )

          // EN CASO DE QUE LAS CONTRASEÑAS NO COINCIDAN

        } else{
          res.send({
            'status': 100,
            'mensaje': "Las contraseñas no coinciden."
          })
        }
// EN CASO DE QUE LA CONTRASEÑA ACTUAL NO COINCIDA CON LA DE LA BASE DE DATOS
      } else {
        res.send({
          'status': 100,
          'mensaje': "Contraseña incorrecta."
        })
      }
  })


})


app.get("/perfil/:id/obtenerDatos", (req, res) =>{

Usuario.findOne({_id: req.params.id},(err, UsuarioEncontrado)=>{
  if(!err){
    res.send({
      'status': 200,
      'usuario': UsuarioEncontrado,
      'idSesion':  req.session.idSess
    })
  }
})

})
  
 


// SUBIR IMAGEN DE PERFIL 
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


// ELIMINAR CUENTA DE USUARIO

app.post("/eliminarCuenta", (req, res)=>{
  const path = __dirname+"/public/images/"+req.session.idSess+".png";
  try{

    Usuario.findByIdAndRemove( req.session.idSess , (err)=>{
      if(err){
        console.log(err);
      }else{
        fs.unlinkSync(path)
      req.session.destroy();
        res.redirect("/");
      }
    })

    res.redirect("/perfil/"+req.session.idSess);

  }catch(err){
    console.log(err);
  }
});



// ALBUM

app.get("/album/:idAlbum", (req,res) =>{
  const albumSolicitado  = (req.params.idAlbum);
 
  res.sendFile(__dirname+"/views/album.html")


})

app.get("/album/:idAlbum/obtenerDatos", (req, res) =>{
  
Album.findOne({_id: req.params.idAlbum},(err, albumEncontrado)=>{
  if(!err){
    res.send({
      'status': 200,
      'album': albumEncontrado,
      'idSesion':  req.session.idSess
    })
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
