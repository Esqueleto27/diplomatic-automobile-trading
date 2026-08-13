import {
  BadgeCheck,
  Container,
  Globe2,
  HeartPulse,
  Landmark,
  Plane,
  PlaneTakeoff,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

// Base para las imágenes "de diseño" del sitio (logos, hero, fondos de
// servicios) — viven en R2, bajo el prefijo sitio/, NO en public/img/ (ese
// prefijo es distinto del que usan las fotos de autos, autos/, que sube el
// admin desde el panel).
//
// A propósito NO se lee de process.env.R2_PUBLIC_URL acá: este archivo lo
// importan tanto Server como Client Components (ej. Wordmark dentro de
// Header, que es "use client"), y process.env sólo se reemplaza en el
// bundle del navegador para vars con prefijo NEXT_PUBLIC_ — cualquier otra
// cosa da `undefined` en el cliente ("undefined/sitio/...", URL inválida).
// La URL en sí es pública y estable (cambiarla ya implica editar código de
// todos modos si algún día se pasa a un dominio propio), así que va fija acá.
const ASSETS_BASE_URL =
  "https://pub-2a4b20ea6c834e9d8fda32f7a54be906.r2.dev/sitio";

export const siteConfig = {
  nombre: "Diplomatic",
  apellido: "Automobile Trading",
  tagline:
    "Ofrecemos una selección de vehículos para clientes que buscan calidad, exclusividad y confianza, con una atención especializada para diplomáticos y clientes particulares que valoran un servicio a la altura de sus necesidades.",
};

// Dominio de producción del sitio nuevo (reemplaza al sitio actual en el
// mismo dominio). Se usa para metadata absoluta (Open Graph, canonical,
// sitemap, robots) — hardcodeado a propósito, mismo criterio que
// ASSETS_BASE_URL: es estable y cambiarla ya implica tocar código.
export const siteUrl = "https://diplomatic-trading.com";

export const heroImageUrl = `${ASSETS_BASE_URL}/hero.webp`;
export const logoUrl = `${ASSETS_BASE_URL}/logo/logo-300x74.png`;
// Foto real de la oficina (no generada), usada en /empresa.
export const oficinaImageUrl = `${ASSETS_BASE_URL}/empresa/oficina.png`;
// Foto real de la fachada del edificio, usada en /contacto junto al mapa.
export const edificioImageUrl = `${ASSETS_BASE_URL}/empresa/edificio.png`;
// Foto real (fila de superautos), usada como textura de fondo en el CTA de
// cierre de la home ("Hablemos de su próximo vehículo"), ver ContactCta.
// /contacto ya no lleva foto de fondo propia (se sacó a pedido del
// cliente — quedaba "fea"/competía con el formulario); la franja superior
// de esa página ahora es sólo texto sobre el fondo plano del tema.
export const contactoCtaImageUrl = `${ASSETS_BASE_URL}/contacto-cta.jpg`;

// Texto propio (no copiado de la competencia). A propósito NO se estructura
// como un bloque aislado de "bienvenida + historia breve" — ese patrón
// (saludo, párrafo institucional, debajo tres categorías idénticas a las de
// otro dealer del mismo rubro) es justo lo que hace que dos sitios se lean
// como calcados aunque el texto cambie palabra por palabra. Se integra en
// cambio como una línea de confianza más discreta (ver TrustBand) y el resto
// del contenido institucional completo vive sólo en /empresa.
export const confianza = {
  frase:
    "Más de 30 años asesorando a embajadas, misiones diplomáticas y organismos internacionales en la compra y venta de vehículos exonerados en Ecuador.",
};

// "100+ embajadas atendidas" y "800+ vehículos vendidos" se sacaron de acá:
// eran placeholders sin confirmar por el cliente que igual estaban en vivo
// en la home y en /empresa — afirmaciones concretas sobre un negocio real
// que nadie verificó. Sólo queda el dato que sí es real (30+ años, mismo
// que confianza.frase). Si el cliente confirma cifras reales, se agregan
// acá — StatsBand ya sabe mostrar 1 o varios (ver ese componente).
export const indicadores = [{ valor: "30+", etiqueta: "Años en el mercado" }];

export type LineaNegocio = {
  slug: string;
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
};

// Las dos líneas de negocio que captan clientes nuevos (compra). La venta de
// usados ya tiene su propia sección con inventario real más abajo en la
// home, así que no se repite acá como una tercera tarjeta genérica.
export const lineasNegocio: LineaNegocio[] = [
  {
    slug: "vehiculos-diplomaticos",
    titulo: "Vehículos Diplomáticos",
    descripcion:
      "Si se encuentra en misión diplomática en Ecuador, le ayudamos a traer su vehículo mediante importación directa o a adquirirlo localmente, trabajando con plazos cortos para que lo tenga cuanto antes.",
    icono: Landmark,
  },
  {
    slug: "organismos-internacionales",
    titulo: "Organismos Internacionales",
    descripcion:
      "Asesoramos a organismos internacionales en la elección e importación de vehículos a Ecuador, con un proceso diseñado para ser ágil, claro y sin complicaciones de principio a fin.",
    icono: Globe2,
  },
];

export const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/empresa", label: "Empresa" },
  { href: "/inventario", label: "Inventario" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

// PENDIENTE: reemplazar por los datos reales del cliente antes de publicar.
export const contacto = {
  telefonos: ["+593 99 980 8067"],
  email: "info@diplomatic-trading.com",
  sitio: "diplomatic-trading.com",
  direccion:
    "Av. La Coruña N27-36 y Av. Francisco de Orellana. Edificio La Moraleja Business Center, 6to. Piso, oficina 606.",
};

// Marcas que comercializa el dealer.
//
// Los SVG viven en R2 (sitio/marcas/, blancos, viewBox 24x24); BrandStrip
// los tiñe con opacidad. Son marcas registradas de sus dueños y se usan de
// forma nominativa para identificar lo que el concesionario comercializa.
//
// Sin logo todavía: Mercedes-Benz no está en simple-icons (su titular pidió
// retirarla de esa librería) — ver la nota junto a esa marca más abajo. Para
// sumar un logo oficial de una marca nueva, subir el SVG a sitio/marcas/ en
// R2 con `fill="#ffffff"` y referenciarlo acá. Mientras no haya archivo, la
// marca cae al wordmark tipográfico.
// `escala` equilibra ópticamente la fila: todos los SVG vienen en una caja de
// 24x24, pero los logos anchos y bajos (los aros de Audi, las alas de Bentley)
// llenan poca altura y se ven diminutos junto a un escudo como el de Porsche.
// Es ajuste a ojo, no un bug: si se cambia un logo, revisar el número.
// PENDIENTE: confirmar con el cliente la lista real de marcas que comercializa.
// Esta selección es una propuesta coherente con el posicionamiento de lujo.
export const marcas: { nombre: string; logo?: string; escala?: number }[] = [
  { nombre: "BMW", logo: `${ASSETS_BASE_URL}/marcas/bmw.svg` },
  { nombre: "Audi", logo: `${ASSETS_BASE_URL}/marcas/audi.svg`, escala: 1.4 },
  { nombre: "Porsche", logo: `${ASSETS_BASE_URL}/marcas/porsche.svg` },
  { nombre: "Aston Martin", logo: `${ASSETS_BASE_URL}/marcas/astonmartin.svg`, escala: 1.7 },
  { nombre: "Maserati", logo: `${ASSETS_BASE_URL}/marcas/maserati.svg`, escala: 1.05 },
  { nombre: "McLaren", logo: `${ASSETS_BASE_URL}/marcas/mclaren.svg`, escala: 1.75 },
  { nombre: "Volvo", logo: `${ASSETS_BASE_URL}/marcas/volvo.svg`, escala: 1.05 },
  { nombre: "Cadillac", logo: `${ASSETS_BASE_URL}/marcas/cadillac.svg`, escala: 1.3 },
  { nombre: "Toyota", logo: `${ASSETS_BASE_URL}/marcas/toyota.svg`, escala: 1.35 },
  { nombre: "Mazda", logo: `${ASSETS_BASE_URL}/marcas/mazda.svg`, escala: 1.15 },
  { nombre: "Kia", logo: `${ASSETS_BASE_URL}/marcas/kia.svg`, escala: 1.35 },
  // 2026-08-05, a pedido del cliente: se suma un segundo lote de marcas
  // generalistas (Nissan, Honda, Jeep, Ram, Volkswagen, Hyundai, Chevrolet,
  // Land Rover), todas disponibles en simple-icons. `escala` es un primer
  // ajuste a ojo por forma del glifo (insignias circulares ~1, wordmarks
  // anchos y bajos como Chevrolet/Land Rover más grandes) — falta el chequeo
  // visual final en el navegador antes de darlo por cerrado.
  { nombre: "Nissan", logo: `${ASSETS_BASE_URL}/marcas/nissan.svg` },
  { nombre: "Honda", logo: `${ASSETS_BASE_URL}/marcas/honda.svg` },
  { nombre: "Jeep", logo: `${ASSETS_BASE_URL}/marcas/jeep.svg`, escala: 1.3 },
  { nombre: "Ram", logo: `${ASSETS_BASE_URL}/marcas/ram.svg`, escala: 1.1 },
  { nombre: "Volkswagen", logo: `${ASSETS_BASE_URL}/marcas/volkswagen.svg` },
  { nombre: "Hyundai", logo: `${ASSETS_BASE_URL}/marcas/hyundai.svg`, escala: 1.2 },
  { nombre: "Chevrolet", logo: `${ASSETS_BASE_URL}/marcas/chevrolet.svg`, escala: 1.5 },
  { nombre: "Land Rover", logo: `${ASSETS_BASE_URL}/marcas/landrover.svg`, escala: 1.5 },
  // Mercedes-Benz no está en simple-icons (su titular la hizo retirar de esa
  // librería). `mercedes.svg` no viene de ahí: es una estrella de tres
  // puntas redibujada a mano como forma geométrica simple — uso nominativo
  // para identificar que se comercializa la marca, igual que el resto de
  // estos logos. Si el cliente consigue el asset oficial del fabricante,
  // reemplazar el archivo en R2 (mismo nombre) para que quede pixel-perfect.
  { nombre: "Mercedes-Benz", logo: `${ASSETS_BASE_URL}/marcas/mercedes.svg`, escala: 1.05 },
];

export type Servicio = {
  slug: string;
  // Nombre completo — título de la card y de su sección con ancla en
  // /servicios.
  titulo: string;
  // Versión corta (máx. 2 líneas visuales) para la card de descubrimiento en
  // la home y en /servicios.
  resumen: string;
  // Párrafo completo, para la sección propia del servicio en /servicios.
  descripcion: string;
  icono: LucideIcon;
  // Foto del servicio (webp, en R2 sitio/servicios/) — se usa tanto en la
  // card de descubrimiento como en su sección dentro de /servicios.
  // Generadas con IA (Higgsfield/z_image) como placeholder distintivo por
  // servicio — genéricas a propósito (sin autos de marca reconocible, sin
  // texto legible, sin logos) para evitar cualquier problema de marca
  // registrada. Cuando el cliente entregue fotos propias, reemplazar el
  // archivo en R2 con el mismo nombre y no hace falta tocar este archivo.
  imagen?: string;
};

// Orden a propósito: los dos servicios "core" del negocio (importar el
// vehículo en sí, y usar el cupo diplomático para traer bienes) van primero
// — son los que más valen, y ServiciosAdicionales los destaca ocupando los
// dos primeros lugares de la grilla. Matriculación y reexportación son
// trámite de apoyo; los seguros, complementarios — por eso cierran la lista.
export const servicios: Servicio[] = [
  {
    slug: "importacion-vehiculos",
    titulo: "Importación de Vehículos",
    descripcion:
      "¿Desea traer su vehículo desde el exterior? Nos encargamos de todo el proceso de importación, desde el trámite inicial hasta la entrega en su destino final en el país.",
    resumen:
      "Gestionamos todo el proceso para traer su vehículo desde el exterior hasta la entrega.",
    icono: Truck,
    imagen: `${ASSETS_BASE_URL}/servicios/importacion-vehiculos.webp`,
  },
  {
    slug: "importacion-mercaderias",
    titulo: "Importación de Mercaderías con Cupo Diplomático",
    descripcion:
      "Si usted desea hacer uso de su cupo para la importación de bienes con cargo a su cupo diplomático anual, nosotros le ayudamos con la importación de su mercadería vía aérea o marítima, así como de su menaje de casa.",
    resumen:
      "Usamos su cupo diplomático anual para traer bienes y menaje de casa por vía aérea o marítima.",
    icono: Container,
    imagen: `${ASSETS_BASE_URL}/servicios/importacion-mercaderias.webp`,
  },
  {
    slug: "matriculacion-vehicular",
    titulo: "Matriculación Vehicular",
    descripcion:
      "Contamos con el servicio de un gestor que le ayuda con los procesos requeridos por nuestras autoridades para regularizar la matriculación de su vehículo, usted despreocúpese que nosotros somos su soporte.",
    resumen:
      "Un gestor tramita la matriculación ante las autoridades por usted, de inicio a fin.",
    icono: BadgeCheck,
    // Reemplazada: la foto original (lámpara de escritorio) no comunicaba
    // nada del servicio. Ahora es un sello siendo estampado sobre un
    // documento junto a una llave de auto — sin texto legible, sin sello
    // gubernamental real, sin marcas.
    imagen: `${ASSETS_BASE_URL}/servicios/matriculacion-vehicular.png`,
  },
  {
    // Contraparte de "importacion-vehiculos": ese servicio es sólo para
    // traer un vehículo al país, este es sólo para sacarlo al terminar la
    // misión diplomática. Antes vivían mezclados en una sola descripción
    // ("importar o exportar"); se separaron en dos servicios porque son
    // procesos y momentos distintos para el cliente.
    slug: "reexportacion-vehiculos",
    titulo: "Reexportación de Vehículos",
    descripcion:
      "Al terminar su misión diplomática en el país, coordinamos con usted el proceso de reexportación de su vehículo, incluyendo la documentación aduanera y la logística de traslado hacia su próximo destino.",
    resumen:
      "Coordinamos la salida de su vehículo hacia su próximo destino al terminar su misión.",
    icono: PlaneTakeoff,
    // Única foto de servicio sin auto en cuadro: los dos intentos previos
    // (auto en el puerto, auto bajo funda) salieron con parrilla y emblema
    // reconocibles pese a pedir lo contrario en el prompt, así que se
    // resolvió con el buque RoRo y la rampa de carga — comunica lo mismo
    // (el vehículo sale del país) sin riesgo de marca registrada.
    imagen: `${ASSETS_BASE_URL}/servicios/reexportacion-vehiculos.webp`,
  },
  {
    slug: "seguro-vehiculos",
    titulo: "Seguro de Vehículos",
    descripcion:
      "Tenemos para usted las mejores tasas del mercado, con amplios planes de financiamiento y sin intereses hasta 12 meses plazo, para lo cual trabajamos con Aseguradoras de prestigio Nacional e Internacional que le garantizan una atención oportuna y de calidad.",
    resumen:
      "Las mejores tasas del mercado, con financiamiento sin intereses hasta 12 meses.",
    icono: ShieldCheck,
    imagen: `${ASSETS_BASE_URL}/servicios/seguro-vehiculos.webp`,
  },
  {
    slug: "seguro-viajes",
    titulo: "Seguro de Viajes",
    descripcion:
      "Por negocios o vacaciones es importante estar siempre bien protegidos, ponemos a su disposición seguro de viajes que le permitan sentirse seguro y relajado al salir del país.",
    resumen:
      "Cobertura y asistencia 24/7 para salir del país tranquilo, por negocios o vacaciones.",
    icono: Plane,
    imagen: `${ASSETS_BASE_URL}/servicios/seguro-viajes.webp`,
  },
  {
    slug: "seguro-salud",
    titulo: "Seguro de Salud",
    descripcion:
      "Si usted o su familia requieren contar con un seguro médico, tenemos una gama completa de prestadores de servicios médicos que pueden ofrecerle las mejores alternativas.",
    resumen:
      "Una gama completa de prestadores médicos con las mejores alternativas para su familia.",
    icono: HeartPulse,
    imagen: `${ASSETS_BASE_URL}/servicios/seguro-salud.webp`,
  },
];
