// functions od the save files the systems

let btn = document.getElementById("btnfiltro");
let conatainrLeft = document.getElementById("container-left");
let CampoCtrl = document.getElementById("file1");
let CampoMedidor = document.getElementById("file2");
let CampoFiltroCens = document.getElementById("file3");
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

function mostrarSpinner() {
  conatainrLeft.classList.remove("hidden");
  setTimeout(function () {
    conatainrLeft.classList.add("hidden");
    conatainrLeft.classList.add("spinner");
  }, 90000);
}

// functions of the campus save the files
document.querySelectorAll(".dropzone").forEach((dropzone) => {
  const fileInput = document.querySelector(
    "#" + dropzone.id.replace("dropzone", "file")
  );
  dropzone.addEventListener("click", () => {
    fileInput.click();
  });

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dropzone--active");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropzone.addEventListener(type, () => {
      dropzone.classList.remove("dropzone--active");
    });
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    fileInput.files = e.dataTransfer.files;
    dropzone.textContent = e.dataTransfer.files[0].name;
    dropzone.classList.remove("dropzone--active");
  });

  fileInput.addEventListener("change", () => {
    dropzone.textContent = fileInput.files[0].name;
  });
});

btn.addEventListener("click", () => {
  mostrarSpinner();
});

