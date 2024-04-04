import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import isAuthenticated from "./src/controller/Auth.js";
import { getCarga, getDescargas, getDescarga, getFiles, getLogin, postLogin} from "./src/routes/route.carga.js";
import { upload } from "./src/controller/multers.js";
import {leerArchivo, leerArchivoMedidores, leerArchivoCens } from "./src/controller/leerArchivo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json({ limit: "120mb" }));
app.use(express.urlencoded({ extended: true, limit: "120mb" }));
app.use(express.static("src/static"));
//Rutas
app.get("/", getLogin);
app.get("/login", getLogin);
app.post('/logout', (req, res) => {
  res.clearCookie('userSession');
  res.sendStatus(200);
});
app.get("/cargar",  isAuthenticated, getCarga);
app.get("/Descarga",  isAuthenticated, getDescarga); 
app.get("/descargas", isAuthenticated, getDescargas);
app.get("/files", isAuthenticated, (req, res) => {
  const directoryPath = path.join(__dirname, "src/public");
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).send("Unable to scan directory: " + err);
    }
    res.send(files);
  });
});
app.post("/Login/user", postLogin);
app.delete("/eliminarArchivos", isAuthenticated, (req, res) => {
  const directorio = path.join(__dirname, "src", "public");

  fs.readdir(directorio, (err, files) => {
    if (err) {
      console.error("Error al leer directorio:", err);
      return res.status(500).send("Error al leer directorio");
    }

    if (files.length === 0) {
      return res.send("No hay archivos para eliminar");
    }

    let archivosEliminados = 0;

    files.forEach((file) => {
      const rutaArchivo = path.join(directorio, file);
      fs.unlink(rutaArchivo, (err) => {
        if (err) {
          console.error(`Error al eliminar el archivo ${file}: ${err}`);
          return res.status(500).send(`Error al eliminar el archivo ${file}`);
        }
        console.log(`Archivo eliminado: ${file}`);
        archivosEliminados++;

        // Si todos los archivos se eliminan correctamente, enviar la respuesta
        if (archivosEliminados === files.length) {
          res.send("Archivos eliminados correctamente");
        }
      });
    });
  });
});
const uploadFields = [
  { name: "file1", maxCount: 1 },
  { name: "file2", maxCount: 1 },
  { name: "file3", maxCount: 1 },
];
app.post("/upload", isAuthenticated, upload.fields(uploadFields), async (req, res) => {
  try {
    const array1 = [];
    const array2 = [];
    const array3 = [];
    // Llamar a la función leerArchivo para cada archivo
    if (req.files["file1"]) {
      await leerArchivo(req.files["file1"][0].path, array1, res);
    } else {
      // res.send("Debe cargar el archivo Ctrl");
    }

    if (req.files["file2"]) {
      await leerArchivoMedidores(req.files["file2"][0].path, array2);
    } else {
      res.send("Debe cargar el archivo Medidores");
    }

    if (req.files["file3"]) {
      await leerArchivoCens(req.files["file3"][0].path, array3);
    } else {
      res.send("Debe cargar el archivo Cens");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al procesar los archivos");
  }

});

app.use((req, res, next) => {
  res.redirect('/login'); 
});

app.listen(3002);
console.log("server listening on port", 3002);
