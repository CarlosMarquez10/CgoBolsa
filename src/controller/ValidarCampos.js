export async function ValidadorCampos(array) {
  const datosKey = [
    "CLIENTE_ID",
    "CLASE_SERVICIO",
    "ESTADO_SUMINISTRO",
    "TIPO_BLOQUEO",
    "ANTIGUEDAD_SALDO",
    "SALDO_SUSPENSION",
    "FECHA_ULT_PAGO",
    "VALOR_ULT_PAGO",
    "ULT_CONSUMO",
    "FECHA_ULT_SUSPENSION",
    "TIPO_SUSP",
    "CIERRE_SUS",
    "OBSERVACION_SUS",
  ];

  array.forEach((obj) => {
    datosKey.forEach((key) => {
      if (!obj.hasOwnProperty(key)) {
        return `EL ARCHVIO NO NTIENE EL CAMPO ${key}`;
      }
    });
  });

  return array;
}
