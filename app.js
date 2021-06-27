//jshint esversion:6
const express = require('express');
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
app.set("view engine", "ejs");
app.use(express.static("public"));

// CONEXION CON LA BASE DE DATOS
mongoose.connect('mongodb://localhost:27017/MusicPlus', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}, (err) => {
    if (!err) {
        console.log('Conexion exitosa.')
    } else {
        console.log('Error al conectar con la base de datos: ' + err)
    }
});


// ROUTING
app.get("/", (req,res) =>{
    res.render("index");
})

app.get("/login", (req, res) =>{
    res.render("login");
})

app.get("/register", (req, res) =>{
    res.render("register");
});

app.get("/home", (req,res)=>{
    res.render("homepage");
})


app.listen(3000, function(){
    console.log("Server started on port 3000");
});