window.onload=()=>{
    // VARIABLES
    const idRequerida = window.location.pathname.split('/');
    var tituloPlaylist = document.getElementById("tituloPlaylist");
    var portadaPlaylist = document.getElementById("portadaPlaylist");
    var listaCanciones = document.getElementById("listaCanciones");
    var cancionesPlaylist = document.getElementById("cancionesPlaylist");
    var enlacePerfil = document.getElementById("enlacePerfil");
    var btnEditarPlaylist = document.getElementById("btnEditar");
    var btnDejarDeSeguir = document.getElementById("btnDejarDeSeguir");
    var btnSeguir = document.getElementById("btnSeguir");
    var editarNombrePlaylist = document.getElementById("editarNombrePlaylist");
    var cambiarNombre = document.getElementById("cambiarNombre");
    var cambiarPortada = document.getElementById("cambiarPortada");
   
    datos = {
        method : "GET"
    }

    fetch("/playlist/"+idRequerida[2]+"/obtenerDatos", datos)
    .then(response => response.json())
    .then(data =>{
        if(data.status == 200){
            // ASIGNANDO EL ENLACE DEL PERFIL DE USUARIO
            var enlace = "/perfil/"+data.idSesion;
            enlacePerfil.setAttribute("href", enlace)

            tituloPlaylist.innerHTML = data.playlist.nombre;

            // PORTADA DE LA PLAYLIST
            var enlacePortada;
            if(data.playlist.imagenPortada == null){
                enlacePortada = "/images/defaultPlaylist.png";
            } else{
                enlacePortada = "/images/"+data.playlist.imagenPortada+".png";
            }

            portadaPlaylist.setAttribute("src",enlacePortada);

            // LISTA DE CANCIONES EN LA PLAYLIST
            data.playlist.canciones.forEach(cancion =>{
                var nuevoElemento = document.createElement('li');
                var division = document.createElement('hr');
                var nuevoAnchor = document.createElement('a');


                nuevoAnchor.setAttribute("href", "/cancion/"+cancion._id);
                nuevoAnchor.classList.add("text-white");
                nuevoAnchor.innerHTML = cancion.nombreCancion;
                nuevoElemento.append(nuevoAnchor);
                cancionesPlaylist.append(nuevoElemento);
                cancionesPlaylist.append(division);

                // BOTON PARA QUITAR LA CANCION DE LA PLAYLIST
                if(data.playlist.propietario == data.idSesion){
                    var eliminarCancion = document.createElement('a');
                     eliminarCancion.innerHTML = " <i class='fas fa-trash-alt text-white justify-content-between'></i>"
                     eliminarCancion.setAttribute("href", "/cancion/"+cancion._id+"/"+data.playlist._id+"/quitar")
                     nuevoElemento.append(eliminarCancion);

                    }

            })
        

            // SEGUIR - DEJAR DE SEGUIR PLAYLIST
            data.usuario.playlists.forEach(playlistDeUsuario => {
            // DETERMINANDO SI EL USUARIO ES DUEÑO DE LA PLAYLIST
                if(data.playlist.propietario == data.idSesion){
                    btnEditarPlaylist.classList.remove("hide");

                } else if(data.playlist._id == playlistDeUsuario._id){ // EN CASO DE QUE EL USUARIO SIGA LA PLAYLIST APARECERA UN BOTON PARA DEJAR DE SEGUIRLA
                    btnDejarDeSeguir.classList.remove("hide");
                    btnDejarDeSeguir.setAttribute("href","/playlist/dejar-de-seguir/"+data.playlist._id);
                    btnSeguir.classList.add("hide");

                } else{ // EN CASO DE QUE EL USUARIO NO SIGA LA PLAYLIST APARECERA UN BOTON PARA COMENZAR A SEGUIRLA
                    btnSeguir.setAttribute("href","/playlist/seguir/"+data.playlist._id);
                    btnSeguir.classList.remove("hide");
                }
               
            });
           
         // EDICION DE LA PLAYLIST
         editarNombrePlaylist.value = data.playlist.nombre;

         if(data.playlist.nombre == "Canciones Favoritas de "+data.usuario.username){
            cambiarNombre.classList.add("hide");
         }

         // CAMBIAR PORTADA DE LA PLAYLIST

         const cambiarPortadaPlaylist =(e)=>{
             e.preventDefault();
             if(cambiarPortada.checkValidity()){
                 var formularioPortada = new FormData(cambiarPortada);
                 let myheaders = new Headers();
                 let datos ={
                     method: "POST",
                     headers: myheaders,
                     body: formularioPortada
                 }
                 fetch("/subirImagen/"+data.playlist._id, datos).then(location.reload());
             }
         }

         cambiarPortada.addEventListener("submit", cambiarPortadaPlaylist);

        }
         
    })

}