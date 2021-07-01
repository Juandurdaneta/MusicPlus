// LOGIN

var formularioLogin = document.getElementById("formularioLogin");
var mensajeError = document.getElementById("mensajeError")


const enviar=(e) =>{
    e.preventDefault();
    if(formularioLogin.checkValidity()){
        var formulario = new FormData(formularioLogin);
        let myheaders = new Headers();
        let datos = {
            method: "POST",
            headers: myheaders,
            body: formulario
        }
        fetch("/login", datos)
        .then(response => response.json())
        .then(data=>{
            if(data.Status == 100){
                mensajeError.innerHTML = data.mensaje;
            } else{
                window.location.assign('/Home');
            }
        }).catch(err=> console.log('Error: ',err));
    }else{
        alert("Problema")
    }
}
formularioLogin.addEventListener("submit",enviar);

