const idRequerida = window.location.pathname.split('/');

window.onload=()=>{
    // VARIABLES
    var enlacePerfil = document.getElementById("enlacePerfil")
    var nombreUsuario = document.getElementById("nombreUsuario")
    var btnEditarUsuario = document.getElementById("btnEditarUsuario");
    var btnCerrarSesion = document.getElementById("btnCerrarSesion");
    var playlistsUsuarioH2 = document.getElementById("playlistsUsuarioH2")
    var imagenPerfil = document.getElementById("imagenPerfilUsuario");
    var playlistsUsuario = document.getElementById("playlistsUsuario");
    var agregarPlaylist = document.getElementById("agregarPlaylist");
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
           var enlaceImagen
           var enlacePlaylist

            if(data.usuario.imagenPerfil == null){
                enlaceImagen = "/images/defaultProfile.jpg";
            } else{
                enlaceImagen = "/images/"+data.usuario.imagenPerfil+".png";
            }

            imagenPerfil.setAttribute("src", enlaceImagen )

            

            // PLAYLISTS DEL USUARIO
            data.usuario.playlists.forEach(playlist => {

                if(playlist.imagenPortada == null){
                    enlacePlaylist = "/images/defaultPlaylist.png";
                } else{
                    enlacePlaylist = "/images/"+playlist.imagenPortada+".png"
                }
                //CREANDO NUEVOS ELEMENTOS HTML
                var nuevoDiv = document.createElement('div');
                var nuevoAnchor = document.createElement('a');
                var nuevaImagen = document.createElement('img');
               
               // CLASES DE LOS ELEMENTOS
                nuevoDiv.classList.add("col-xl-4");
                nuevoDiv.classList.add("col-6");
                nuevoDiv.classList.add("col-md-5");
                nuevoDiv.classList.add("text-center");
                nuevoDiv.classList.add("left");
                nuevoAnchor.classList.add("text-white");

                nuevaImagen.classList.add("portada");


                nuevaImagen.setAttribute("src", enlacePlaylist);
                nuevoAnchor.setAttribute("href","/playlist/"+playlist._id);
                nuevoAnchor.append(nuevaImagen, playlist.nombre);
                nuevoDiv.appendChild(nuevoAnchor);
                playlistsUsuario.appendChild(nuevoDiv);

            });

            // EN CASO DE QUE EL ID DE LA SESION Y EL ID DEL PERFIL DEL USUARIO NO COINCIDAN
            if(data.idSesion != data.usuario._id){
                btnCerrarSesion.classList.add("hide");
                btnEditarUsuario.classList.add("hide");
                agregarPlaylist.classList.add("hide");
                playlistsUsuarioH2.innerHTML = "Playlists de "+data.usuario.username;
            }

        }
    })

}

// CAMBIO DE CONTRASEÑA
var formularioContraseña = document.getElementById("formularioContraseña");
var mensajeExito = document.getElementById("mensajeExito");

const cambioContraseña =(e)=>{
    e.preventDefault();
    if(formularioContraseña.checkValidity()){
        var formulario = new FormData(formularioContraseña);
        let myHeaders = new Headers();
        let datos = {
            method: "POST",
            headers: myHeaders,
            body: formulario
        }

        fetch("/perfil/"+idRequerida[2], datos)
        .then(response => response.json())
        .then(data=>{
            if(data.status == 200){
                mensajeExito.innerHTML = data.mensaje;
            } else{
                mensajeExito.innerHTML = data.mensaje;
            }
        }).catch(err=> console.log('Error: ',err));

    } else{
        alert("Complete el formulario.")
    }
}

formularioContraseña.addEventListener("submit", cambioContraseña);
