let spinner = document.getElementById("spinnerdescargas");
let btnDescarga = document.getElementById("btnDescargas");

let nameuser = document.getElementById("name_user");


document.addEventListener("DOMContentLoaded", function (event) {
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (userData) {
    nameuser.innerText = userData.nombre_usuario;
  } else {
    // Maneja el caso en el que los datos del usuario no estén disponibles
    console.log("No hay datos de usuario disponibles");
  }
});

window.onload = function () {
  setTimeout(function () {
    var element = document.getElementById("container-des");
    if (element) {
      element.style.display = "block";
    }
  }, 30000);
};

btnDescarga.addEventListener("click", function () {
  spinner.classList.remove("hidden");
  setTimeout(function () {
    spinner.classList.add("hidden");
  }, 30000);

  setTimeout(function () {
    window.location.href = "/descargas";
  }, 30000);
});
// // Si el usuario abandona la página o cierra la pestaña
// window.addEventListener("beforeunload", function (event) {
//     // enviamos una solicitud al servidor para eliminar la cookie
//     fetch('/logout', { method: 'POST' });
//   });
