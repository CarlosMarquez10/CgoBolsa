const btnlogin = document.getElementById("btn-login");


btnlogin.addEventListener("click", function (event) {
  event.preventDefault();

  let username = document.querySelector("#username").value;
  let password = document.querySelector("#password").value;

  fetch("http://localhost:3002/Login/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        // Si la autenticación fue exitosa, guarda los datos del usuario en el almacenamiento local
        localStorage.setItem('userData', JSON.stringify(data.userData));
        window.location.href = "/cargar";
      } else {
        // Si hubo un error, muestra el mensaje de error en la consola
        let messageError = document.getElementById("messageError");
        messageError.innerText = data.message;
        username = "";
        password = "";
        setTimeout(() => {
           messageError.style.display = 'none';
        }, 2000);

      }
    })
    .catch((error) => console.error("Error:", error));
});