window.onload=()=>{
    // VARIABLES
    const idRequerida = window.location.pathname.split('/');
    var enlacePerfil = document.getElementById("enlacePerfil")
    var nombreUsuario = document.getElementById("nombreUsuario")
    var btnEditarUsuario = document.getElementById("btnEditarUsuario");
    var btnCerrarSesion = document.getElementById("btnCerrarSesion");
    var playlistsUsuarioH2 = document.getElementById("playlistsUsuarioH2")
    var imagenPerfil = document.getElementById("imagenPerfilUsuario");
    var playlistsUsuario = document.getElementById("playlistsUsuario");
    
    datos = {
        method : "GET"
    }

    fetch("/perfil/"+idRequerida[2]+"/obtenerDatos", datos)
    .then(response => response.json())
    .then(data =>{
        if(data.status == 200 ){
            // ENLACE DEL PERFIL DE LA SESION
            var enlace = "/perfil/"+data.idSesion;
            enlacePerfil.setAttribute("href", enlace)

            // NOMBRE DEL USUARIO
            nombreUsuario.innerHTML = data.usuario.username;
            
            // UBICACION DEL ARCHIVO DE LA IMAGEN DE PERFIL DEL USUARIO
            const enlaceImagen = "/images/"+data.usuario._id+".png";
            imagenPerfil.setAttribute("src", enlaceImagen )

            // PLAYLISTS DEL USUARIO
            data.usuario.playlists.forEach(playlist => {
                //CREANDO NUEVOS ELEMENTOS HTML
                var nuevoDiv = document.createElement('div');
                var nuevoAnchor = document.createElement('a');
                var nuevaImagen = document.createElement('img');
               
               // CLASES DE LOS ELEMENTOS
                nuevoDiv.classList.add("col-6");
                nuevoDiv.classList.add("col-xl-4");
                nuevoDiv.classList.add("text-center");

                nuevoAnchor.classList.add("text-white");

                nuevaImagen.classList.add("img-fluid");

                nuevaImagen.setAttribute("src", enlaceImagen);

                nuevoAnchor.append(nuevaImagen, playlist.nombre);
                nuevoDiv.append(nuevoAnchor);
                playlistsUsuario.append(nuevoDiv);

            });

            // EN CASO DE QUE EL ID DE LA SESION Y EL ID DEL PERFIL DEL USUARIO NO COINCIDAN
            if(data.idSesion != data.usuario._id){
                btnCerrarSesion.classList.add("hide");
                btnEditarUsuario.classList.add("hide");
                playlistsUsuarioH2.innerHTML = "Playlists de "+data.usuario.username;
            }

        }
    })

}