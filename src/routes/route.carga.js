import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { datosExcel } from "../controller/CrearExcel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getCarga = (req, res) => {
  const pathToFile = resolve(__dirname, "../static/carga.html");
  res.sendFile(pathToFile);
};

export const getDescarga= (req, res) => {
  const pathToFile = resolve(__dirname, "../static/Descargas.html");
  res.sendFile(pathToFile);
};

export const getLogin = (req, res) => {
  const pathToFile = resolve(__dirname, "../static/login.html");
  res.sendFile(pathToFile);
};

export const getDescargas = (req, res) => {
  const excelBuffer = datosExcel;

  res.setHeader("Content-Disposition", "attachment; filename=" + "datos.xlsx");
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.end(excelBuffer, "binary");
};

export const postLogin = (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  let db = new sqlite3.Database(
    "./src/db/cgobolsa.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Conexión exitosa a la base de datos SQLite.");
    }
  );

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
    if (err) {
      return console.log(err.message);
    }
    if (row && bcrypt.compareSync(password, row.password)) {
      // Guardar la fila de la consulta en una variable
      const userData = {
        nombre_usuario: row.nombre_usuario,
        username: row.username,
      };

      res.cookie('userSession', true, { httpOnly: true, expires: new Date(Date.now() + 900000) });
      // Establecer el objeto userData como respuesta al frontend
      res.json({ success: true, message: 'Autenticación exitosa.', userData });
    } else {
      res.json({ success: false, message: 'Usuario o contraseña incorrectos.' });
    }

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Cierre de la conexión a la base de datos SQLite.");
    });
  });
};


export const getFiles = (req, res) => {
  const directoryPath = path.join(__dirname, "src/public");
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).send("Unable to scan directory: " + err);
    }
    res.send(files);
  });
};
