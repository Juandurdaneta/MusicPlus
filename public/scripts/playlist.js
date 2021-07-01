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

            data.usuario.playlists.forEach(playlistDeUsuario => {

                if(data.playlist.propietario == data.idSesion){
                    btnEditarPlaylist.classList.remove("hide");
                } else if(data.playlist._id == playlistDeUsuario._id){
                    btnDejarDeSeguir.classList.remove("hide");
                    btnDejarDeSeguir.setAttribute("href","/playlist/dejar-de-seguir/"+data.playlist._id);
                    btnSeguir.classList.add("hide");

                } else{
                    btnSeguir.setAttribute("href","/playlist/seguir/"+data.playlist._id);
                    btnSeguir.classList.remove("hide");
                }
    

            
            });
            // DETERMINANDO SI EL USUARIO ES DUEÑO DE LA PLAYLIST
           
         

        }
         
    })

}