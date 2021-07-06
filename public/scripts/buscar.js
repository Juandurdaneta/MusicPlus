// BUSQUEDA
var busquedaUsuario = document.getElementById("busquedaUsuario");
var textoBusqueda = document.getElementById("textoBusqueda");
var labelResultados = document.getElementById("labelResultados");

var canciones = document.getElementById("canciones");
var resultadosCanciones = document.getElementById("resultadosCanciones");
var listaCanciones = document.getElementById("listaCanciones");

var playlists = document.getElementById("playlists");
var resultadosPlaylists = document.getElementById("resultadosPlaylists");
var listaPlaylists = document.getElementById("listaPlaylists");

var albumes = document.getElementById("albumes");
var resultadosAlbumes = document.getElementById("resultadosAlbumes");
var listaAlbumes = document.getElementById("listaAlbumes");

var artistas = document.getElementById("artistas");
var resultadosArtistas = document.getElementById("resultadosArtistas");
var listaArtistas = document.getElementById("listaArtistas");

// OBTENIENDO LA SESION ACTUAL
window.onload=()=>{
    fetch("/sesion", {method: "GET"})
    .then((response) => response.json())
    .then((data)=>{
        if(data.status == 200){
           document.getElementById("enlacePerfil").setAttribute("href", "/perfil/"+data.sesion); 
        }
    })
}
// OBTENIENDO RESULTADOS DE LA BUSQUEDA
const busqueda = (e) => {
  e.preventDefault();
  if (busquedaUsuario.checkValidity()) {
    var formulario = new FormData(busquedaUsuario);
    let myheaders = new Headers();
    let datos = {
      method: "POST",
      headers: myheaders,
      body: formulario,
    };
    fetch("/buscar", datos)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          textoBusqueda.innerHTML = '"' + data.busqueda + '"';

          labelResultados.innerHTML = "Todos los resultados";
          // CANCIONES ENCONTRADAS
          if (data.canciones.length > 0) {
            canciones.classList.remove("hide");
            resultadosCanciones.innerHTML = "Canciones";

            data.canciones.forEach((cancion) => {
              var nuevoElemento = document.createElement("li");
              var division = document.createElement("hr");
              var nuevoAnchor = document.createElement("a");

              nuevoAnchor.setAttribute("href", "/cancion/" + cancion._id);
              nuevoAnchor.classList.add("text-white");
              nuevoAnchor.innerHTML = cancion.nombreCancion;
              nuevoElemento.append(nuevoAnchor);

              listaCanciones.append(nuevoElemento);
              listaCanciones.append(division);
            });
          }

          // PLAYLISTS ENCONTRADAS
          if (data.playlists.length > 0) {
            playlists.classList.remove("hide");
            resultadosPlaylists.innerHTML = "Playlists";

            data.playlists.forEach((playlist) => {
              var nuevoElemento = document.createElement("li");
              var division = document.createElement("hr");
              var nuevoAnchor = document.createElement("a");

              nuevoAnchor.setAttribute("href", "/playlist/" + playlist._id);
              nuevoAnchor.classList.add("text-white");
              nuevoAnchor.innerHTML = playlist.nombre;
              nuevoElemento.append(nuevoAnchor);

              listaPlaylists.append(nuevoElemento);
              listaPlaylists.append(division);
            });
          }

          // ALBUMES ENCONTRADOS
          if (data.albumes.length > 0) {
            albumes.classList.remove("hide");
            resultadosAlbumes.innerHTML = "Albumes";

            data.albumes.forEach((album) => {
              var nuevoElemento = document.createElement("li");
              var division = document.createElement("hr");
              var nuevoAnchor = document.createElement("a");

              nuevoAnchor.setAttribute("href", "/album/" + album._id);
              nuevoAnchor.classList.add("text-white");
              nuevoAnchor.innerHTML = album.nombreAlbum;
              nuevoElemento.append(nuevoAnchor);

              listaAlbumes.append(nuevoElemento);
              listaAlbumes.append(division);
            });
          }

          //ARTISTAS ENCONTRADOS
          if (data.artistas.length > 0) {
            artistas.classList.remove("hide");
            resultadosArtistas.innerHTML = "Artistas";

            data.artistas.forEach((artista) => {
              var nuevoElemento = document.createElement("li");
              var division = document.createElement("hr");
              var nuevoAnchor = document.createElement("a");

              nuevoAnchor.setAttribute("href", "/artista/" + artista._id);
              nuevoAnchor.classList.add("text-white");
              nuevoAnchor.innerHTML = artista.nombreArtista;
              nuevoElemento.append(nuevoAnchor);

              listaArtistas.append(nuevoElemento);
              listaArtistas.append(division);
            });
          }
        } else {
          console.log("Error");
        }
      })
      .catch((err) => console.log("Error :", err));
  } else {
    alert("Ha habido un problema, vuelva a intentarlo luego.");
  }
};
busquedaUsuario.addEventListener("submit", busqueda);
