const idRequerida = window.location.pathname.split('/');

window.onload =()=>{
    // VARIABLES
    var enlacePerfil = document.getElementById("enlacePerfil");
    var nombreArtista = document.getElementById("nombreArtista");
    var imagenPerfilArtista = document.getElementById("imagenPerfilArtista");
    var albumesArtista = document.getElementById("albumesArtista");

    datos = {
        method : "GET"
    }

    fetch("/artista/"+idRequerida[2]+"/obtenerDatos", datos)
    .then(response => response.json())
    .then(data =>{
        if(data.status == 200){
            // ENLACE DEL PERFIL DE LA SESION
            var enlace = "/perfil/"+data.idSession;
            enlacePerfil.setAttribute("href", enlace)

            // IMAGEN DE PERFIL DEL ARTISTA
            imagenPerfilArtista.setAttribute("src", data.artista.imagenPerfil)
            
            // NOMBRE DEL ARTISTA
            nombreArtista.innerHTML = data.artista.nombreArtista;
        
            // ALBUMES DEL ARTISTA
            data.artista.albumes.forEach(album => {
                var nuevoDiv = document.createElement('div');
                var nuevoAnchor = document.createElement('a');
                var nuevaImagen = document.createElement('img');

                nuevoDiv.classList.add("col-xl-4");
                nuevoDiv.classList.add("col-6");
                nuevoDiv.classList.add("col-md-5");
                nuevoDiv.classList.add("text-center");
                nuevoDiv.classList.add("left");
                nuevoAnchor.classList.add("text-white");

                nuevaImagen.classList.add("portada");

                nuevaImagen.setAttribute("src", album.portadaAlbum);
                nuevoAnchor.setAttribute("href","/album/"+album._id);
                nuevoAnchor.append(nuevaImagen, album.nombreAlbum);
                nuevoDiv.appendChild(nuevoAnchor);
                albumesArtista.appendChild(nuevoDiv);
            });

        }
    })

}