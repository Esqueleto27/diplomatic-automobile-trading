// Formateadores compartidos entre el sitio público y el panel admin — antes
// cada uno definía su propia copia (a veces con configuración distinta por
// descuido: la tabla de autos del admin llegó a mostrar un precio con otro
// formato que las tarjetas del sitio). Un solo `Intl.NumberFormat`/
// `Intl.DateTimeFormat` por tipo, reusado en todos lados.
export const formatoNumero = new Intl.NumberFormat("es-EC");

export const formatoPrecio = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatoFecha = new Intl.DateTimeFormat("es-EC", {
  dateStyle: "medium",
});

export const formatoFechaHora = new Intl.DateTimeFormat("es-EC", {
  dateStyle: "medium",
  timeStyle: "short",
});
