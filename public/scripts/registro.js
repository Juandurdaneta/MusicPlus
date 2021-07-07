// REGISTRO
var formularioRegistro = document.getElementById("formularioRegistro");
var mensajeExito = document.getElementById("mensajeExito");


const registro=(e) =>{
    e.preventDefault();
    if(formularioRegistro.checkValidity()){
        var formulario = new FormData(formularioRegistro);
        let myheaders = new Headers();
        let datos = {
            method: "POST",
            headers: myheaders,
            body: formulario
        }
        fetch("/register", datos)
        .then(response => response.json())
        .then(data=>{
            if(data.Status == 200){
                mensajeExito.innerHTML = "<span class='text-success text-center'>"+data.mensaje+"</span>";
            } else{
                mensajeExito.innerHTML = "<span class='text-danger text-center'>"+data.mensaje+"</span>";
            }
        }).catch(err=> console.log('Error: ',err));
    }else{
        alert("Problema")
    }
}

formularioRegistro.addEventListener("submit", registro);
