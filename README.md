![Logo MusicPlus](public/icons/logo.png?raw=true)
# MusicPlus
Music+ Es un servicio de streaming de musica basado en Spotify.
Proyecto N2 Para la materia de Desarrollo Web II.
Desarrollado por Juan Urdaneta C.I 27.683.174

## Funcionalidades de la web
- [x] Crear un Usuario.
- [x] Iniciar Sesion con el Usuario Creado anteriormente.
- [x] Reproducción de canciones.
- [x] Modificacion de usuario a conveniencia.
- [x] Creacion de listas de reproduccion.
- [x] Manipulacion de listas de reproduccion
- [x] Reproduccion de listas de reproduccion o albumes completos.
- [x] Seguir listas de reproducccion de otros usuarios.
- [x] Lista de reproduccion especial llamada favoritos.
- [x] Capacidad de buscar canciones, grupos, álbumes y lista de reproducción.


## Enlaces
- [Deploy en Heroku](https://apologetic-mountie-23434.herokuapp.com/)
- [Documentacion de endpoints](https://documenter.getpostman.com/view/15432930/Tzeah5TK)
- [Wireframes](https://drive.google.com/file/d/1pmooZIkrYyyAL4hslqoMrM_QDY1a8PM6/view?usp=sharing)

## Modelado de datos NOSQL
Colecciones: Usuarios, Playlists, Artistas, Álbumes, Canciones.

### Cada perfil de usuario cuenta con:
- Un ID
- Un nombre de Usuario
- Un correo Electrónico
- Una contraseña
- Una colección de playlists
- Una imagen de perfil

### Cada documento de Playlist cuenta con:
- Un ID
- Un nombre de Playlist
- Una colección de canciones
- Un ID de Propietario
- Una imagen de portada

### Cada documento de la colección de Artistas cuenta con:
- Un ID
- Nombre del artista
- Colección de álbumes creados
- Imagen de perfil

### Cada documento de la colección de Álbumes cuenta con:
- Un ID
- El nombre del Álbum
- Una colección de canciones
- La Imagen de portada del álbum

### Cada documento de la colección de canciones cuenta con:
- Un ID
- Nombre de la canción
- Ubicación del archivo de la canción.
- La fecha de lanzamiento de la canción.
