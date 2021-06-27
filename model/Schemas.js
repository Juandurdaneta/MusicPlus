const mongoose = require('mongoose'); 


//SCHEMA ARTISTA
exports.getArtista = function(){
    const ArtistSchema = new mongoose.Schema({
        nombreArtista:{
            type:String,
            required:true,
            unique:true
        },
        albumes:[AlbumSchema]
    });
    return mongoose.model("Artista", ArtistSchema);
}
//SCHEMA ALBUM 
exports.getAlbum = function(){
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

    return mongoose.model("Album", AlbumSchema);
    
}
// SCHEMA CANCION
exports.getCancion = function(){
    const cancionSchema = new mongoose.Schema({
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
    return mongoose.model("Cancion", cancionSchema);

}

// SCHEMA USUARIO
exports.getUsuario = function(){
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
        cancionesFavoritas : [cancionesSchema],
        playlists: [playlistSchema]
    });
    return mongoose.model('Usuario', userSchema);
}

//SCHEMA PLAYLIST
exports.getPlaylist = function(){
    const playlistSchema = new mongoose.Schema({
        nombre:{
            type: String,
            required: true
        },
        canciones:[cancionSchema]
    })
    return mongoose.model('Playlist', playlistSchema);
}



