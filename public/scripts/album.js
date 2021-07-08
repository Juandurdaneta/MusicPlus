window.onload = () => {
  // VARIABLES
  const idRequerida = window.location.pathname.split("/");
  var tituloAlbum = document.getElementById("tituloAlbum");
  var portadaAlbum = document.getElementById("portadaAlbum");
  var listaCanciones = document.getElementById("listaCanciones");
  var cancionesAlbum = document.getElementById("cancionesAlbum");
  var enlacePerfil = document.getElementById("enlacePerfil");
  var autor = document.getElementById("nombreAutor");

  var music = document.getElementById("music"); // ID PARA EL ELEMENTO DEL AUDIO
  var duration = music.duration; // DURACION DEL AUDIO
  var pButton = document.getElementById("pButton"); // BOTON DE PLAY
  var playhead = document.getElementById("playhead"); // INDICADOR DE TIEMPO
  var timeline = document.getElementById("timeline"); // LINEA DE TIEMPO DE LA CANCION
  var enReproduccion = document.getElementById("enReproduccion");
  var reproduccionCanciones = [];
  var titulosCanciones = [];
  var cancionEnReproduccion = document.createElement("p");

  datos = {
    method: "GET",
  };

  fetch("/album/" + idRequerida[2] + "/obtenerDatos", datos)
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 200) {
        // ASIGNANDO EL ENLACE DEL PERFIL DE USUARIO
        var enlace = "/perfil/" + data.idSesion;
        enlacePerfil.setAttribute("href", enlace);

        // TITULO DEL ALBUM
        tituloAlbum.innerHTML = data.album.nombreAlbum;

        // PORTADA DEL ALBUM
        portadaAlbum.setAttribute("src", data.album.portadaAlbum);

        // LISTA DE CANCIONES
        listaCanciones.innerHTML =
          "Lista de canciones de " + data.album.nombreAlbum;

        data.album.canciones.forEach((cancion) => {
          var nuevoElemento = document.createElement("li");
          var division = document.createElement("hr");
          var nuevoAnchor = document.createElement("a");

          nuevoAnchor.setAttribute("href", "/cancion/" + cancion._id);
          nuevoAnchor.classList.add("text-white");
          nuevoAnchor.innerHTML = cancion.nombreCancion;
          nuevoElemento.append(nuevoAnchor);
          cancionesAlbum.append(nuevoElemento);
          cancionesAlbum.append(division);

          // GUARDANDO CADA UNA DE LAS CANCIONES DENTRO DE UN ARRAY
          reproduccionCanciones.push(cancion.ubicacionArchivo);
          titulosCanciones.push(cancion.nombreCancion);
        });

        // NOMBRE DEL AUTOR DEL ALBUM
        autor.innerHTML = data.autor.nombreArtista;
        autor.setAttribute("href", "/artista/" + data.autor._id);

        // REPRODUCTOR DE MUSICA
        var i = 0;
        var j = 0;

        // BUCLE DE CADA UNA DE LAS CANCIONES DEL ALBUM
        music.addEventListener("ended", function () {
          i = ++i < reproduccionCanciones.length ? i : 0;
          j = ++j < titulosCanciones.length ? j : 0;

          cancionEnReproduccion.innerHTML =
            "Estas escuchando : " + titulosCanciones[j];
          music.src = reproduccionCanciones[i];
          music.play();
          enReproduccion.append(cancionEnReproduccion);
        });

        // TITULO DE LA CANCION EN REPRODUCCION
        cancionEnReproduccion.innerHTML =
          "Estas escuchando : " + titulosCanciones[0];

        enReproduccion.append(cancionEnReproduccion);

        music.src = reproduccionCanciones[0];

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
