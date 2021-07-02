window.onload = () => {
  // VARIABLES
  const idRequerida = window.location.pathname.split("/");
  var tituloCancion = document.getElementById("tituloCancion");
  var nombreArtista = document.getElementById("nombreArtista");
  var agregarFavoritos = document.getElementById("favoritos");
  var quitarFavoritos = document.getElementById("favoritosQuitar");
  var fechaLanzamiento = document.getElementById("fechaLanzamiento");
  var enlacePerfil = document.getElementById("enlacePerfil");

  datos = {
    method: "GET",
  };

  fetch("/cancion/" + idRequerida[2] + "/obtenerDatos", datos)
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 200) {
        
        // ASIGNANDO EL ENLACE DEL PERFIL DE USUARIO
        var enlace = "/perfil/" + data.sesionUsuario._id;
        enlacePerfil.setAttribute("href", enlace);
        // ASIGNANDO EL TITULO DE LA CANCION
        tituloCancion.innerHTML = data.cancion.nombreCancion;
        // NOMBRE DEL ARTISTA
         //nombreArtista = data.artista.nombreArtista;

         // CHEQUEANDO SI EL USUARIO TIENE O NO LA CANCION EN FAVORITOS
        console.log(data.cancion)
        console.log(data.cancionesFavoritas.canciones)
        if(data.cancionesFavoritas.canciones.includes(data.cancion)){
            quitarFavoritos.classList.remove("hide");
        } else{
            agregarFavoritos.classList.remove("hide");
        }
      }
    });
};
