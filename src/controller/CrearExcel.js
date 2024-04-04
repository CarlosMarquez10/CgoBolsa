import XLSX from "xlsx";
// import {borrarArchivosEnDirectorio} from '../controller/BorrarFiles.js'

export let datosExcel = "";

export function crearExcel(data, data2, data3, data4, data5, res) {
  // Crear un nuevo libro de trabajo
  const wb = XLSX.utils.book_new();

  // Convertir los datos a la codificación correcta
  const dataUtf8 = data.map(row => {
    // Asegúrate de convertir el texto a la codificación correcta
    const observacion = row.OBSERVACION_SUS ? Buffer.from(row.OBSERVACION_SUS, 'latin1').toString('utf8') : '';
    return { ...row, OBSERVACION_SUS: observacion };
  });

  const data2Utf8 = data2.map(row => {
    // Asegúrate de convertir el texto a la codificación correcta
    const observacion = row.OBSERVACION_SUS ? Buffer.from(row.OBSERVACION_SUS, 'latin1').toString('utf8') : '';
    return { ...row, OBSERVACION_SUS: observacion };
  });

  const data3Utf8 = data3.map(row => {
    // Asegúrate de convertir el texto a la codificación correcta
    const observacion = row.OBSERVACION_SUS ? Buffer.from(row.OBSERVACION_SUS, 'latin1').toString('utf8') : '';
    return { ...row, OBSERVACION_SUS: observacion };
  });

  const data4Utf8 = data4.map(row => {
    // Asegúrate de convertir el texto a la codificación correcta
    const observacion = row.OBSERVACION_SUS ? Buffer.from(row.OBSERVACION_SUS, 'latin1').toString('utf8') : '';
    return { ...row, OBSERVACION_SUS: observacion };
  });

  const data5Utf8 = data5.map(row => {
    // Asegúrate de convertir el texto a la codificación correcta
    const observacion = row.OBSERVACION_SUS ? Buffer.from(row.OBSERVACION_SUS, 'latin1').toString('utf8') : '';
    return { ...row, OBSERVACION_SUS: observacion };
  });

  // Convertir los datos a hojas de trabajo
  const ws1 = XLSX.utils.json_to_sheet(dataUtf8);
  const ws2 = XLSX.utils.json_to_sheet(data2Utf8);
  const ws3 = XLSX.utils.json_to_sheet(data3Utf8);
  const ws4 = XLSX.utils.json_to_sheet(data4Utf8);
  const ws5 = XLSX.utils.json_to_sheet(data5Utf8);

  // Añadir las hojas de trabajo al libro de trabajo
  XLSX.utils.book_append_sheet(wb, ws1, "Sup-Medidor");
  XLSX.utils.book_append_sheet(wb, ws2, "Inconveniente-Poste");
  XLSX.utils.book_append_sheet(wb, ws3, "Sup-Poste");
  XLSX.utils.book_append_sheet(wb, ws4, "Sup-Lectura");
  XLSX.utils.book_append_sheet(wb, ws5, "Ots Pagos 25%");

  // Crear un buffer con los datos del libro de trabajo
  datosExcel = XLSX.write(wb, { type: "buffer" });

  
  return datosExcel;
}



