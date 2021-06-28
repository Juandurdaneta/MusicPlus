const mongoose = require('mongoose'); 
// SCHEMA CANCION

let cancionSchema = new mongoose.Schema({
    nombreCancion: {
        type: String,
        required: true
    },
    FechaLanzamiento: {
        type: Date
    },
    letras: {
        type: String
    }

});
//SCHEMA ALBUM 

const AlbumSchema = new mongoose.Schema({
    nombreAlbum: {
        type:String,
        required:true
    },
    canciones : [cancionSchema],
    portadaAlbum :{
        type: String
    }
})
//SCHEMA PLAYLIST

const playlistSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    canciones:[cancionSchema]
});

//SCHEMA ARTISTA

const ArtistSchema = new mongoose.Schema({
    nombreArtista:{
        type:String,
        required:true,
        unique:true
    },
    albumes:[AlbumSchema]
});


// SCHEMA USUARIO

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    cancionesFavoritas : [cancionSchema],
    playlists: [playlistSchema]
});

//EXPORTANDO SCHEMAS

exports.getArtista = function(){
    return mongoose.model("Artista", ArtistSchema);
}
exports.getAlbum = function(){
    return mongoose.model("Album", AlbumSchema);
    
}
exports.getCancion = function(){
    return mongoose.model("Cancion", cancionSchema);

}

exports.getUsuario = function(){

    return mongoose.model('Usuario', userSchema);
}

exports.getPlaylist = function(){

    return mongoose.model('Playlist', playlistSchema);
}



