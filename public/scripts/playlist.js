window.onload = () => {
  // VARIABLES
  const idRequerida = window.location.pathname.split("/");
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
  var propietarioPlaylist = document.getElementById("propietarioPlaylist");
  var eliminarPlaylist = document.getElementById("eliminarPlaylist");


  var music = document.getElementById("music"); // ID PARA EL ELEMENTO DEL AUDIO
  var duration = music.duration; // DURACION DEL AUDIO
  var pButton = document.getElementById("pButton"); // BOTON DE PLAY
  var playhead = document.getElementById("playhead"); // INDICADOR DE TIEMPO
  var timeline = document.getElementById("timeline"); // LINEA DE TIEMPO DE LA CANCION
  var enReproduccion = document.getElementById("enReproduccion");
  var reproduccionCanciones = [];
  var titulosCanciones = [];
  var cancionEnReproduccion = document.createElement("p");
  var adelante = document.getElementById("adelante");
  var atras = document.getElementById("atras")
  var i = 0;
  var j = 0;

  datos = {
    method: "GET",
  };

  fetch("/playlist/" + idRequerida[2] + "/obtenerDatos", datos)
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 200) {
        // ASIGNANDO EL ENLACE DEL PERFIL DE USUARIO
        var enlace = "/perfil/" + data.idSesion;
        enlacePerfil.setAttribute("href", enlace);

        tituloPlaylist.innerHTML = data.playlist.nombre;

        // PORTADA DE LA PLAYLIST
        var enlacePortada;
        if (data.playlist.imagenPortada == null) {
          enlacePortada = "/images/defaultPlaylist.png";
        } else {
          enlacePortada = "/images/" + data.playlist.imagenPortada + ".png";
        }

        portadaPlaylist.setAttribute("src", enlacePortada);

        // LISTA DE CANCIONES EN LA PLAYLIST
        data.playlist.canciones.forEach((cancion) => {
          var nuevoElemento = document.createElement("li");
          var division = document.createElement("hr");
          var nuevoAnchor = document.createElement("a");

          nuevoAnchor.setAttribute("href", "/cancion/" + cancion._id);
          nuevoAnchor.classList.add("text-white");
          nuevoAnchor.innerHTML = cancion.nombreCancion;
          nuevoElemento.append(nuevoAnchor);
          cancionesPlaylist.append(nuevoElemento);
          cancionesPlaylist.append(division);

          // BOTON PARA QUITAR LA CANCION DE LA PLAYLIST
          if (data.playlist.propietario == data.idSesion) {
            var eliminarCancion = document.createElement("a");
            eliminarCancion.innerHTML =
              " <i class='fas fa-trash-alt text-white justify-content-between'></i>";
            eliminarCancion.setAttribute(
              "href",
              "/cancion/" + cancion._id + "/" + data.playlist._id + "/quitar"
            );
            nuevoElemento.append(eliminarCancion);
          }

          // OBTENIENDO LOS TITULOS DE LAS CANCIONES Y LA UBICACION DE LOS ARCHIVOS
          reproduccionCanciones.push(cancion.ubicacionArchivo);
          titulosCanciones.push(cancion.nombreCancion);
        });

        // SEGUIR - DEJAR DE SEGUIR PLAYLIST
        data.usuario.playlists.forEach((playlistDeUsuario) => {
          // DETERMINANDO SI EL USUARIO ES DUEÑO DE LA PLAYLIST
          if (data.playlist.propietario == data.idSesion) {
            btnEditarPlaylist.classList.remove("hide");
          } else if (data.playlist._id == playlistDeUsuario._id) {
            // EN CASO DE QUE EL USUARIO SIGA LA PLAYLIST APARECERA UN BOTON PARA DEJAR DE SEGUIRLA
            btnDejarDeSeguir.classList.remove("hide");
            btnDejarDeSeguir.setAttribute(
              "href",
              "/playlist/dejar-de-seguir/" + data.playlist._id
            );
            btnSeguir.classList.add("hide");
          } else {
            // EN CASO DE QUE EL USUARIO NO SIGA LA PLAYLIST APARECERA UN BOTON PARA COMENZAR A SEGUIRLA
            btnSeguir.setAttribute(
              "href",
              "/playlist/seguir/" + data.playlist._id
            );
            btnSeguir.classList.remove("hide");
          }
        });

        // ENLACE AL PERFIL DEL PROPIETARIO DE LA PLAYLIST
        var enlacePerfilPropietario = document.createElement("a");
        enlacePerfilPropietario.classList.add("text-white");
        enlacePerfilPropietario.innerHTML = "De " + data.propietario.username;
        enlacePerfilPropietario.setAttribute(
          "href",
          "/perfil/" + data.propietario._id
        );

        propietarioPlaylist.append(enlacePerfilPropietario);

        // EDICION DE LA PLAYLIST
        editarNombrePlaylist.value = data.playlist.nombre;

        if (
          data.playlist.nombre ==
          "Canciones Favoritas de " + data.usuario.username
        ) {
          cambiarNombre.classList.add("hide");
        }

        // CAMBIAR PORTADA DE LA PLAYLIST

        const cambiarPortadaPlaylist = (e) => {
          e.preventDefault();
          if (cambiarPortada.checkValidity()) {
            var formularioPortada = new FormData(cambiarPortada);
            let myheaders = new Headers();
            let datos = {
              method: "POST",
              headers: myheaders,
              body: formularioPortada,
            };
            fetch("/subirImagen/" + data.playlist._id, datos).then(
              location.reload()
            );
          }
        };

        cambiarPortada.addEventListener("submit", cambiarPortadaPlaylist);

        // CAMBIAR NOMBRE DE LA PLAYLIST

        const cambiarNombrePlaylist = (e) => {
          e.preventDefault();
          if (cambiarNombre.checkValidity()) {
            var formularioNombre = new FormData(cambiarNombre);
            let myheaders = new Headers();
            let datos = {
              method: "POST",
              headers: myheaders,
              body: formularioNombre,
            };
            fetch("/playlist/" + data.playlist._id + "/editar", datos).then(
              location.reload()
            );
          }
        };

        cambiarNombre.addEventListener("submit", cambiarNombrePlaylist);

        // ELIMINAR PLAYLIST

        eliminarPlaylist.setAttribute(
          "href",
          "/playlist/" + data.playlist._id + "/eliminar"
        );


          // BUCLE DE CADA UNA DE LAS CANCIONES DEL ALBUM
          music.addEventListener("ended", function () {
            i = ++i < reproduccionCanciones.length ? i : 0;
            j = ++j < titulosCanciones.length ? j : 0;
  
            cancionEnReproduccion.innerHTML =
              "Estas escuchando : " + titulosCanciones[j];
            music.src = reproduccionCanciones[i];
            music.play();
            enReproduccion.append(cancionEnReproduccion);
            pButton.className = "";
            pButton.className = "fas fa-pause";
          });
  
          // TITULO DE LA CANCION EN REPRODUCCION
          if(titulosCanciones.length == 0){
            cancionEnReproduccion.innerHTML = "";
          } else {
            cancionEnReproduccion.innerHTML =
            "Estas escuchando : " + titulosCanciones[j];
          }
          
          
          enReproduccion.append(cancionEnReproduccion);
  
          music.src = reproduccionCanciones[i];

           // LINEA DEL TIEMPO AJUSTADA CON EL INDICADOR DE TIEMPO
        var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

        // EVENT LISTENER DEL BOTON DE PLAY
        pButton.addEventListener("click", play);

        // EVENT LISTENER DE LA ACTUALIZACION DEL TEIMPO
        music.addEventListener("timeupdate", timeUpdate, false);

        // HACE QUE LA LINEA DEL TIEMPO SEA CLICKABLE
        timeline.addEventListener(
          "click",
          function (event) {
            moveplayhead(event);
            music.currentTime = duration * clickPercent(event);
          },
          false
        );

        // DEVUELVE CLICK COMO UN DECIMAL
        function clickPercent(event) {
          return (event.clientX - getPosition(timeline)) / timelineWidth;
        }

        // HACE QUE EL INDICADOR SEA TRASLADABLE CON EL CLICK
        playhead.addEventListener("mousedown", mouseDown, false);
        window.addEventListener("mouseup", mouseUp, false);

        var onplayhead = false;

        // EVENTLISTENER PARA EL RETROCESO
        function mouseDown() {
          onplayhead = true;
          window.addEventListener("mousemove", moveplayhead, true);
          music.removeEventListener("timeupdate", timeUpdate, false);
        }

        // EVENT LISTENER PARA ADELANTAR
        function mouseUp(event) {
          if (onplayhead == true) {
            moveplayhead(event);
            window.removeEventListener("mousemove", moveplayhead, true);
            // CAMBIANDO EL TIEMPO ACTUAL
            music.currentTime = duration * clickPercent(event);
            music.addEventListener("timeupdate", timeUpdate, false);
          }
          onplayhead = false;
        }
        // MUEVE EL INDICADOR A MEDIDA QUE EL USUARIO LO ARRASTRA
        function moveplayhead(event) {
          var newMargLeft = event.clientX - getPosition(timeline);

          if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
            playhead.style.marginLeft = newMargLeft + "px";
          }
          if (newMargLeft < 0) {
            playhead.style.marginLeft = "0px";
          }
          if (newMargLeft > timelineWidth) {
            playhead.style.marginLeft = timelineWidth + "px";
          }
        }

        // timeUpdate
        // SINCRONIZA EL INDICADOR CON EL TIEMPO ACTUAL DEL AUDIO
        function timeUpdate() {
          var playPercent = timelineWidth * (music.currentTime / duration);
          playhead.style.marginLeft = playPercent + "px";
          if (music.currentTime == duration) {
            pButton.className = "";
            pButton.className = "fas fa-play";
          }
        }

        // PAUSA Y PLAY
        function play() {
          // INICIA LA CANCION
          if (music.paused) {
            music.play();
            // DESCARTA EL BOTON DE PLAY, AGREGA EL DE PAUSA
            pButton.className = "";
            pButton.className = "fas fa-pause";
          } else {
            // PAUSA LA MUSICA
            music.pause();
            // DESCARTA EL BOTON DE PAUSA, AGREGA EL DE PLAY
            pButton.className = "";
            pButton.className = "fas fa-play";
          }
        }

        // OBTIENE LA DURACION DEL AUDIO
        music.addEventListener(
          "canplaythrough",
          function () {
            duration = music.duration;
          },
          false
        );

        // DEVUELVE LA POSICION DE LOS ELEMENTOS EN RELACION CON LA PARTE IZQUIERDA DE LA VENTANA
        function getPosition(el) {
          return el.getBoundingClientRect().left;
        }
      }


      
      adelante.addEventListener("click", function(){
        j++;
        i++;
        cancionEnReproduccion.innerHTML =
        "Estas escuchando : " + titulosCanciones[j];
        music.src = reproduccionCanciones[i];
        music.pause();
        pButton.className = "";
        pButton.className = "fas fa-play";
        
    });

    atras.addEventListener("click", function(){
        j--;
        i--;
        cancionEnReproduccion.innerHTML =
        "Estas escuchando : " + titulosCanciones[j];
        music.src = reproduccionCanciones[i];

        pButton.className = "";
        pButton.className = "fas fa-play";
        
    })

    });
};
