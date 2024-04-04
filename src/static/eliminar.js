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

document.addEventListener("DOMContentLoaded", function () {
  const archivoContainer = document.getElementById("archivoContainer");
  const eliminarArchivosBtn = document.getElementById("eliminarArchivos");
  const getfiles = document.getElementById("countfiles");

  // Function for get  and showing the of files on the API REST
  function mostrarArchivos() {
    fetch("http://localhost:3002/files")
      .then((response) => response.json())
      .then((data) => {
        archivoContainer.innerHTML = ""; // clear the container
        data.forEach((nombreArchivo) => {
          const archivoElement = document.createElement("div");
          archivoElement.classList.add("archivo");
          archivoElement.textContent = nombreArchivo;
          archivoContainer.appendChild(archivoElement);
        });
        getfiles.textContent = data.length;
      })
      .catch((error) => console.error("Error al obtener archivos:", error));
  }

  // calling the function on the loading page
  mostrarArchivos();

  // Event for showing the list of files
  eliminarArchivosBtn.addEventListener("click", function () {
    fetch("http://localhost:3002/eliminarArchivos", {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar archivos");
        }
        return response.text(); // Devolver el texto de la respuesta
      })
      .then((data) => {
        mostrarArchivos();
        alert(data); // Mensaje de texto
        // llamar la función para mostrar los archivos
      })
      .catch((error) => console.error("Error al eliminar archivos:", error));
  });
});

// // Si el usuario abandona la página o cierra la pestaña
// window.addEventListener("beforeunload", function (event) {
//   // enviamos una solicitud al servidor para eliminar la cookie
//   fetch('/logout', { method: 'POST' });
// });
