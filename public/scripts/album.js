window.onload=()=>{
    // VARIABLES
    const idRequerida = window.location.pathname.split('/');
    var tituloAlbum = document.getElementById("tituloAlbum");
    var portadaAlbum = document.getElementById("portadaAlbum");
    var listaCanciones = document.getElementById("listaCanciones");
    var cancionesAlbum = document.getElementById("cancionesAlbum");
    var enlacePerfil = document.getElementById("enlacePerfil")

    datos = {
        method: "GET"
    }

    

    fetch("/album/"+idRequerida[2]+"/obtenerDatos", datos)
    .then(response => response.json())
    .then(data =>{
        if(data.status == 200){
            // ASIGNANDO EL ENLACE DEL PERFIL DE USUARIO
            var enlace = "/perfil/"+data.idSesion;
            enlacePerfil.setAttribute("href", enlace)

            // TITULO DEL ALBUM
            tituloAlbum.innerHTML = data.album.nombreAlbum;

            // PORTADA DEL ALBUM
            portadaAlbum.setAttribute("src", data.album.portadaAlbum);

            // LISTA DE CANCIONES
            listaCanciones.innerHTML = "Lista de canciones de "+ data.album.nombreAlbum;

            data.album.canciones.forEach(cancion => {
                var nuevoElemento = document.createElement('li');
                var division = document.createElement('hr');
                var nuevoAnchor = document.createElement('a');

                nuevoAnchor.setAttribute("href", "/cancion/"+cancion._id);
                nuevoAnchor.classList.add("text-white");
                nuevoAnchor.innerHTML = cancion.nombreCancion;
                nuevoElemento.append(nuevoAnchor);
                cancionesAlbum.append(nuevoElemento);
                cancionesAlbum.append(division);
           });
        }
    })

}