// BUSQUEDA
var busquedaUsuario = document.getElementById("busquedaUsuario");
var textoBusqueda = document.getElementById("textoBusqueda");
var labelResultados = document.getElementById("labelResultado");


const busqueda=(e)=>{
    e.preventDefault();
    if(busquedaUsuario.checkValidity()){
        var formulario = new FormData(busquedaUsuario);
        let myheaders = new Headers();
        let datos = {
            method: "POST",
            headers: myheaders,
            body: formulario
        }
        fetch("/busqueda",datos)
        .then(response => response.json())
        .then(data =>{
            if(data.status == 200){

            }
        }).catch(err => console.log('Error :',err));
    } else {
        alert("Ha habido un problema, vuelva a intentarlo luego.")
    }
}
busquedaUsuario.addEventListener("submit", busqueda);