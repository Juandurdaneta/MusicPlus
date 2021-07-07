window.onload = () => {
  // VARIABLES
  const idRequerida = window.location.pathname.split("/");
  var tituloCancion = document.getElementById("tituloCancion");
  var nombreArtista = document.getElementById("nombreArtista");
  var agregarFavoritos = document.getElementById("favoritos");
  var quitarFavoritos = document.getElementById("favoritosQuitar");
  var fechaLanzamiento = document.getElementById("fechaLanzamiento");
  var enlacePerfil = document.getElementById("enlacePerfil");
  var playlistsUsuario = document.getElementById("playlistsUsuario");

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
        if (
          data.cancionesFavoritas.canciones.filter(function (e) {
            return e.nombreCancion === data.cancion.nombreCancion;
          }).length > 0
        ) {
          quitarFavoritos.classList.remove("hide");
          quitarFavoritos.setAttribute(
            "href",
            "/cancion/" +
              data.cancion._id +
              "/" +
              data.cancionesFavoritas._id +
              "/quitar"
          );
        } else {
          agregarFavoritos.classList.remove("hide");
          agregarFavoritos.setAttribute(
            "href",
            "/cancion/" +
              data.cancion._id +
              "/" +
              data.cancionesFavoritas._id +
              "/agregar"
          );
        }

        // MOSTRANDO LAS PLAYLISTS DEL USUARIO QUE NO CONTIENEN LA CANCION
        data.playlists.forEach((playlist) => {
          if (
            playlist.canciones.filter(function (e) {
              return e.nombreCancion === data.cancion.nombreCancion;
            }).length == 0
          ) {
            var nuevoElemento = document.createElement("li");
            var division = document.createElement("hr");
            var nuevoAnchor = document.createElement("a");
            var nuevaImagen = document.createElement("img");
            nuevaImagen.classList.add("img-fluid");
            nuevaImagen.classList.add("portada");

            if (playlist.imagenPortada == null) {
              nuevaImagen.setAttribute("src", "/images/defaultPlaylist.png");
            } else {
              nuevaImagen.setAttribute(
                "src",
                "/images/" + playlist.imagenPortada + ".png"
              );
            }

            nuevoAnchor.setAttribute(
              "href",
              "/cancion/" + data.cancion._id + "/" + playlist._id + "/agregar"
            );
            nuevoAnchor.classList.add("text-white");
            nuevoAnchor.append(nuevaImagen, playlist.nombre);

            nuevoElemento.append(nuevoAnchor);

            playlistsUsuario.append(nuevoElemento);
            playlistsUsuario.append(division);
          }
        });

        // FECHA LANZAMIENTO DE LA CANCION
        const opciones = {
          month: "long",
          day: "numeric",
          year: "numeric",
        };
        const fecha = new Date(data.cancion.fechaLanzamiento);
        fecha.setDate(fecha.getDate());

        fechaLanzamiento.innerHTML = fecha.toLocaleDateString(
          undefined,
          opciones
        );

        // REPRODUCCION DE AUDIO

        var music = document.getElementById("music"); // ID PARA EL ELEMENTO DEL AUDIO
        var duration = music.duration; // DURACION DEL AUDIO
        var pButton = document.getElementById("pButton"); // BOTON DE PLAY
        var playhead = document.getElementById("playhead"); // INDICADOR DE TIEMPO
        var timeline = document.getElementById("timeline"); // LINEA DE TIEMPO DE LA CANCION

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
    });
};
