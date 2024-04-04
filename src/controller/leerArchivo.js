import fs from "fs";
import csv from "csv-parser";
import ProgressBar from "progress";
import { crearExcel } from "./CrearExcel.js";
import iconv from "iconv-lite";
import { dataMedidor } from "./fitrarMedidor.js";
// import { ValidadorCampos } from "./ValidarCampos.js";

let BD_CENS = [];
let BD_MEDIDOR = [];

export async function leerArchivo(filePath, array, res) {
  try {
    // stream de lectura para el archivo
    let stream = fs.createReadStream(filePath);

    // Se convierte stream a utf8
    stream = stream
      .pipe(iconv.decodeStream("ISO-8859-1"))
      .pipe(iconv.encodeStream("utf8"));
    stream
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        row.Buscando_Perlas = "";
        array.push(row);
      })
      .on("end", () => {
        // const datosValidados =  ValidadorCampos(array);
        // console.log(datosValidados);
        const dataf1 = array.filter(
          (row) =>
            row.ESTADO_SUMINISTRO == "0-Con suministro" ||
            row.ESTADO_SUMINISTRO == "2-Suspendido I" ||
            row.ESTADO_SUMINISTRO == "4-Suspendido II" ||
            row.ESTADO_SUMINISTRO == "6-Suspendido III"
        );

        const dataf2 = dataf1.filter(
          (row) =>
            row.CLASE_SERVICIO == "1-Residencial" ||
            row.CLASE_SERVICIO == "2-Comercial" ||
            row.CLASE_SERVICIO == "3-Industrial" ||
            row.CLASE_SERVICIO == "7-Provisionales"
        );

        const dataf3 = dataf2.filter(
          (row) =>
            row.TIPO_BLOQUEO == "0-Sin bloqueo." ||
            row.TIPO_BLOQUEO == "6-Solicitud del cliente"
        );

        const dataf4 = dataf3.filter((row) => row.ANTIGUEDAD_SALDO >= 3);
        const dataf5 = dataf4.filter((row) => row.SALDO_SUSPENSION >= 150000);
        const dataf6 = dataf5.filter((row) => row.ULT_CONSUMO >= 5);

        const dataf7 = dataf6.filter((row) => {
          if (row.FECHA_ULT_PAGO === "") {
            return true;
          } else {
            const parts = row.FECHA_ULT_PAGO.split("/");
            const fechaUltPago = new Date(+parts[2], parts[1] - 1, +parts[0]);
            const fechaActual = new Date();
            const diffTime = Math.abs(fechaActual - fechaUltPago);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 33) {
              return true;
            } else {
              var veintePorciento = Number(
                row.VALOR_ULT_PAGO / row.SALDO_SUSPENSION
              );
              if (veintePorciento <= 0.25) {
                console.log(veintePorciento);
                row.Buscando_Perlas = "Pagos de menor del 25%";
                return true;
              }
            }
          }
        });

        const dataf8 = dataf7.filter((row) => {
          if (row.FECHA_ULT_SUSPENSION === "") {
            return true;
          } else {
            const parts = row.FECHA_ULT_SUSPENSION.split("/");
            const fechaUltSusp = new Date(+parts[2], parts[1] - 1, +parts[0]);
            const fechaActual = new Date();
            const diffTime = Math.abs(fechaActual - fechaUltSusp);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays >= 30;
          }
        });

        const filtroCens = dataf8.map((elem) => {
          const usuario = BD_CENS.find(
            (usuario) => usuario.CLIENTE_ID === elem.CLIENTE_ID
          );
          return { ...elem, FiltroCens: usuario ? usuario.ACCION : "" };
        });

        const filtroMedidor = filtroCens.map((elem) => {
          const usuario = BD_MEDIDOR.find(
            (usuario) => usuario.ClienteId === elem.CLIENTE_ID
          );

          let medidores = usuario
            ? {
                NumMedidor: Number(usuario.Medidor.split("-")[0]),
                MarcaMedidor: usuario.Medidor.split("-")[1],
                TipoMedidor: usuario.Medidor.split("-")[2],
              }
            : {
                NumMedidor: 0,
                MarcaMedidor: "",
                TipoMedidor: "",
              };

          return { ...elem, ...medidores };
        });

        const dt = dataMedidor(filtroMedidor);
        // función para crear el archivo Excel
        const datafinal = crearExcel(
          dt.datosMedidor,
          dt.datosPosteInconveniente,
          dt.datosPoste,
          dt.datosLectura,
          dt.Perlas
        );

        if (
          datafinal &&
          typeof datafinal === "object" &&
          datafinal instanceof Buffer &&
          datafinal.length > 0
        ) {
          res.redirect("/Descarga");
        } else {
          console.log(
            "El objeto datosExcel está vacío o no es del tipo esperado."
          );
        }
      });
  } catch (error) {
    console.error(error);
  }
}

export async function leerArchivoMedidores(filePath, array) {
  try {
    // Crear una nueva barra de progreso
    const bar = new ProgressBar(":bar", { total: 10 });

    // Crear un stream de lectura para el archivo
    let stream = fs.createReadStream(filePath);

    // Convertir el stream a utf8
    stream = stream
      .pipe(iconv.decodeStream("ISO-8859-1"))
      .pipe(iconv.encodeStream("utf8"));

    // Leer el archivo CSV
    stream
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        // Añadir cada fila al array
        array.push(row);
      })
      .on("end", () => {
        BD_MEDIDOR = array;
        if (bar.complete) {
          console.log("Proceso completado");
        }
      });

    // Actualizar la barra de progreso
    bar.tick();
  } catch (error) {
    console.error(error);
  }
}

export async function leerArchivoCens(filePath, array) {
  try {
    // Crear una nueva barra de progreso
    const bar = new ProgressBar(":bar", { total: 10 });

    // Crear un stream de lectura para el archivo
    let stream = fs.createReadStream(filePath);

    // Convertir el stream a utf8
    stream = stream
      .pipe(iconv.decodeStream("ISO-8859-1"))
      .pipe(iconv.encodeStream("utf8"));

    // Leer el archivo CSV
    stream
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        // Añadir cada fila al array
        array.push(row);
      })
      .on("end", () => {
        BD_CENS = array;
        if (bar.complete) {
          console.log("Proceso completado");
        }
      });

    // Actualizar la barra de progreso
    bar.tick();
  } catch (error) {
    // console.error(error);
  }
}
