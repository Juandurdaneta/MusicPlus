window.onload =()=>{
var enlacePerfil = document.getElementById("enlacePerfil")
var ultimosLanzamientos = document.getElementById("ultimosLanzamientos");

    datos ={
        method : "GET"
    }

    fetch("/home/obtenerDatos", datos)
    .then(response => response.json())
    .then(data=>{
        if(data.status ==200){
            // ASIGNANDO EL ENLACE DEL PERFIL DE USUARIO
            var enlace = "/perfil/"+data.idSesion;
            enlacePerfil.setAttribute("href", enlace)

            // MOSTRANDO LOS ALBUMES ENCONTRADOS EN LA PAGINA DE INICIO

               data.albums.forEach(album => {
                // CREANDO NUEVOS ELEMENTOS HTML
                var nuevoDiv = document.createElement('div');
                var nuevoAnchor = document.createElement('a');
                var nuevaImagen = document.createElement('img');
                // CLASES DE LOS ELEMENTOS
                nuevoDiv.classList.add("col-4");
                nuevoDiv.classList.add("col-xl-2");
                nuevoAnchor.classList.add("text-white");
                nuevaImagen.classList.add("img-fluid");
                nuevoAnchor.setAttribute("href", "/album/"+album._id)
                nuevaImagen.setAttribute("src", album.portadaAlbum);
                // AÑADIENDO LOS ELEMENTOS CREADOS A LA PAGINA
                nuevoAnchor.append(nuevaImagen, album.nombreAlbum);
                nuevoDiv.append(nuevoAnchor);
                ultimosLanzamientos.append(nuevoDiv);

            });

        }
    })

}