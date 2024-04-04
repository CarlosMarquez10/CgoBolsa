export function dataMedidor(filtroMedidor) {
  const filtrosCens = [
    "POSTE",
  ];
  const InconvMedidor = [
    "INCONVENIENTE TECNICO",
  ];

  let datosMedidor = [];
  let datosPoste = [];
  let datosPosteInconveniente = [];
  let datosLectura = [];
  let Perlas = [];

// funcion para sacar los medidores hexing y exc de la los usuarios de medidor
  const esPoste = (elemento) => {
    return (
      (elemento.MarcaMedidor === "HEX" && elemento.NumMedidor > 9999999999) ||
      elemento.MarcaMedidor === "EXC" ||
      filtrosCens.includes(elemento.FiltroCens)
    );
  };

  const esInconveniente = (elemento) => {
    return InconvMedidor.includes(elemento.CIERRE_SUS);
  };

  const esMedidorPoste = (elemento) => {
    return (
      Number(elemento.ANTIGUEDAD_SALDO) >= 4 &&
      elemento.SALDO_SUSPENSION > 500000
    );
  };

  const esSuspLectura = (elemento) => {
    return (
      Number(elemento.ANTIGUEDAD_SALDO) === 3 &&
      elemento.SALDO_SUSPENSION > 150000
    );
  };

  const esUnaPerla = (elemento) => {
    return (
      elemento.Buscando_Perlas === "Pagos menor del 25%"
    );
  };

  for (let i = 0; i < filtroMedidor.length; i++) {
    if (esPoste(filtroMedidor[i])) {
      datosPosteInconveniente.push(filtroMedidor[i]);
    } else if (esInconveniente(filtroMedidor[i])) {
      datosPosteInconveniente.push(filtroMedidor[i]);
    } else if (esSuspLectura(filtroMedidor[i])) {
      datosLectura.push(filtroMedidor[i]);
    } else if (esMedidorPoste(filtroMedidor[i])) {
      datosPoste.push(filtroMedidor[i]);
    } else if (esUnaPerla(filtroMedidor[i])) {
      Perlas.push(filtroMedidor[i]);
    } else {
      datosMedidor.push(filtroMedidor[i]);
    }
  }

  return { datosMedidor, datosPoste, datosPosteInconveniente, datosLectura, Perlas };
}
