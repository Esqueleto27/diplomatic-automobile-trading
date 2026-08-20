import {
  Accessibility,
  Award,
  BadgeCheck,
  Container,
  Globe2,
  HeartPulse,
  Landmark,
  Handshake,
  Plane,
  PlaneTakeoff,
  ShieldCheck,
  ShieldHalf,
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

// nombre/apellido son el nombre de marca (no se traducen). El tagline del
// hero se sacó de acá — vive en messages/{locale}.json (namespace "hero"),
// ver Hero, para que el toggle ES/EN lo traduzca.
export const siteConfig = {
  nombre: "Diplomatic",
  apellido: "Automobile Trading",
};

// Dominio de producción del sitio nuevo (reemplaza al sitio actual en el
// mismo dominio). Se usa para metadata absoluta (Open Graph, canonical,
// sitemap, robots) — hardcodeado a propósito, mismo criterio que
// ASSETS_BASE_URL: es estable y cambiarla ya implica tocar código.
export const siteUrl = "https://diplomatic-trading.com";

export const heroImageUrl = `${ASSETS_BASE_URL}/hero.jpg`;
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

// Las tres de /empresa sí son generadas (no fotos del negocio), con el mismo
// criterio que los fondos de servicios: sin logos, sin texto legible y sin
// caras reconocibles. Se subieron ya convertidas a webp (~100-230 KB cada
// una, contra 3 MB del JPG original).
export const trayectoriaImageUrl = `${ASSETS_BASE_URL}/empresa/trayectoria.webp`;
export const experienciaImageUrl = `${ASSETS_BASE_URL}/empresa/experiencia.webp`;

// La frase de confianza (+30 años) vivía acá; se movió a
// messages/{locale}.json (namespace "brandStrip", clave "confianza") para
// que el toggle ES/EN la traduzca — BrandStrip y /empresa la leen desde ahí.
// A propósito NO se estructura como un bloque aislado de "bienvenida +
// historia breve": ese patrón (saludo, párrafo institucional, tres
// categorías idénticas a las de otro dealer del mismo rubro) es justo lo
// que hace que dos sitios se lean calcados aunque el texto cambie palabra
// por palabra. Se integra en cambio como una línea de confianza discreta.

// "100+ embajadas atendidas" y "800+ vehículos vendidos" existieron acá
// como `indicadores` (con su franja StatsBand): eran placeholders sin
// confirmar por el cliente que igual estaban en vivo — afirmaciones
// concretas sobre un negocio real que nadie verificó. Quedó sólo el dato
// real (30+ años), y hoy vive como texto en messages/{locale}.json
// ("empresa.aniosValor"/"empresa.aniosEtiqueta"), dentro de la presentación
// de /empresa. Si el cliente confirma cifras reales y quieren volver a una
// franja de indicadores, esto se rearma.

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

// `key` en vez de un `label` fijo: el label sale de messages/{locale}.json
// (namespace "nav", ver header.tsx/footer.tsx) para que el menú se traduzca
// con el toggle ES/EN sin tocar esta lista.
export const navLinks = [
  { href: "/", key: "inicio" },
  { href: "/empresa", key: "empresa" },
  { href: "/inventario", key: "inventario" },
  { href: "/servicios", key: "servicios" },
  { href: "/contacto", key: "contacto" },
] as const;

// PENDIENTE: reemplazar por los datos reales del cliente antes de publicar.
export const contacto = {
  // El primero es el principal: es el que usan el WhatsApp flotante
  // (QuickContact), los botones de WhatsApp de cada auto y el JSON-LD del
  // layout, que toman telefonos[0]. Los dos se listan completos en
  // /contacto y en el footer, que recorren el array entero.
  telefonos: ["+593 99 980 8067", "+593 98 431 2146"],
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
  // McLaren se sacó a pedido del cliente y se reemplazó por Fiat en el mismo
  // lugar de la lista. SVG de simple-icons, mismo tratamiento (blanco,
  // fill="#ffffff") que el resto — subido a R2 en sitio/marcas/fiat.svg.
  { nombre: "Fiat", logo: `${ASSETS_BASE_URL}/marcas/fiat.svg` },
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

/**
 * "¿Por qué confiar en nosotros?" de /empresa. Igual que `servicios`, acá
 * viven sólo el orden y el ícono: título y texto salen de
 * messages/{locale}.json ("empresa.razones.<slug>") para que el toggle ES/EN
 * los traduzca. Agregar, quitar o reordenar una razón es tocar este array.
 */
export const razonesConfianza: { slug: string; icono: LucideIcon }[] = [
  { slug: "experiencia", icono: Award },
  { slug: "atencion", icono: Handshake },
  { slug: "confianza", icono: ShieldCheck },
  { slug: "respaldo", icono: BadgeCheck },
];

export type Servicio = {
  slug: string;
  icono: LucideIcon;
  // Foto del servicio (webp, en R2 sitio/servicios/) — se usa tanto en la
  // card de descubrimiento como en su sección dentro de /servicios.
  // 2026-08-20 v5: quinta pasada, todas generadas con IA (Higgsfield,
  // nano_banana_pro) sobre un mismo "mundo" — hora azul del atardecer
  // (cielo índigo, luces prácticas doradas), gama cinematográfica
  // desaturada, para que las 9 se lean como parte de un mismo set en vez
  // de fotos sueltas.
  //
  // La categoría de mayor riesgo de marca real siguió siendo cualquier
  // plano de auto con la parrilla/faros visibles — el modelo reproduce
  // diseños reales reconocibles (Rolls-Royce Ghost, Range Rover, Lucid
  // Air, Mercedes-Maybach) pese a pedir explícitamente "unbranded,
  // generic, no real manufacturer cues". Mitigaciones que sí funcionaron:
  // 1) planos de detalle (rueda/guardabarros) que sacan la parrilla y los
  //    faros del cuadro — ojo igual con el texto real de neumático
  //    (Michelin, Continental salieron legibles en dos intentos antes de
  //    dar con uno sin texto visible);
  // 2) para "importación de mercaderías", abandonar la idea de un SUV de
  //    lujo (3/3 intentos salieron Range Rover) y resolverlo con un objeto
  //    sin auto (baúles de viaje de cuero en un muelle);
  // 3) para "blindaje", un plano donde el auto queda mayormente oscuro/
  //    fuera de foco detrás de la persona trabajando.
  // Cuando el cliente entregue fotos propias, reemplazar el archivo en R2
  // con el mismo nombre y no hace falta tocar este archivo.
  imagen?: string;
  /**
   * Los seguros los atiende una segunda línea telefónica del negocio: su
   * botón de WhatsApp en /servicios va a WHATSAPP_NUMBER_SEGUROS y no al
   * número principal (ver getWhatsappNumberSeguros en src/lib/whatsapp.ts).
   * Sin la marca, el servicio usa el número de siempre.
   */
  lineaSeguros?: boolean;
};

// Título/resumen/descripción de cada servicio viven en
// messages/{locale}.json (namespace "servicios.items.<slug>"), no acá — así
// el toggle ES/EN los traduce sin tocar este archivo. Este array sólo tiene
// lo que NO se traduce: slug (clave hacia el mensaje), ícono y foto.
//
// Orden a propósito: los dos servicios "core" del negocio (importar el
// vehículo en sí, y usar el cupo diplomático para traer bienes) van primero
// — son los que más valen, y ServiciosAdicionales los destaca ocupando los
// dos primeros lugares de la grilla. Matriculación y reexportación son
// trámite de apoyo; los seguros, complementarios — por eso cierran la lista.
export const servicios: Servicio[] = [
  {
    slug: "importacion-vehiculos",
    icono: Truck,
    // 2026-08-20 v5: plano de detalle de guardabarros/rueda sobre la
    // rampa de una plataforma de transporte, hora azul — se pasó a este
    // encuadre (en vez del auto completo de la v4) porque ningún intento
    // de auto completo salió sin diseño real reconocible, ver nota en
    // `imagen` del type Servicio arriba.
    imagen: `${ASSETS_BASE_URL}/servicios/importacion-vehiculos.webp`,
  },
  {
    slug: "importacion-mercaderias",
    icono: Container,
    // 2026-08-20 v5: baúles de viaje de cuero apilados en un muelle
    // privado a la hora azul, con un farol encendido — se abandonó la
    // idea de un auto/SUV de lujo (3/3 intentos salieron Range Rover
    // real, ver nota en `imagen` arriba) y se resolvió con un objeto que
    // igual comunica "sus pertenencias llegando con estilo".
    imagen: `${ASSETS_BASE_URL}/servicios/importacion-mercaderias.webp`,
  },
  {
    slug: "matriculacion-vehicular",
    icono: BadgeCheck,
    // 2026-08-20 v5: portafolio de cuero con documentos, pluma dorada y
    // llave de auto sobre un escritorio de madera oscura, luz de
    // lámpara cálida contra la ventana a la hora azul.
    imagen: `${ASSETS_BASE_URL}/servicios/matriculacion-vehicular.webp`,
  },
  {
    // Contraparte de "importacion-vehiculos": ese servicio es sólo para
    // traer un vehículo al país, este es sólo para sacarlo al terminar la
    // misión diplomática. Antes vivían mezclados en una sola descripción
    // ("importar o exportar"); se separaron en dos servicios porque son
    // procesos y momentos distintos para el cliente.
    slug: "reexportacion-vehiculos",
    icono: PlaneTakeoff,
    // Única foto de servicio sin auto en cuadro. 2026-08-20 v5: buque
    // portacontenedores saliendo de puerto a la hora azul, luces cálidas
    // en el casco — mismo concepto que versiones anteriores, sin naviera
    // ni auto.
    imagen: `${ASSETS_BASE_URL}/servicios/reexportacion-vehiculos.webp`,
  },
  {
    // Cierra el bloque de servicios sobre el vehículo en sí (importar,
    // matricular, reexportar) antes de los tres seguros: el cliente no
    // compra blindaje como una póliza, es una intervención sobre el auto.
    slug: "blindaje-vehiculos",
    icono: ShieldHalf,
    // 2026-08-20 v5: técnico instalando un panel de blindaje en la puerta
    // de un sedán, taller en penumbra con una sola luz de trabajo cálida
    // — a pedido explícito del cliente ("una persona trabajando en los
    // vehículos, como poniendo eso"), en vez del soldador genérico de la
    // v4 que no mostraba un auto de por medio.
    imagen: `${ASSETS_BASE_URL}/servicios/blindaje-vehiculos.webp`,
  },
  {
    slug: "seguro-vehiculos",
    icono: ShieldCheck,
    lineaSeguros: true,
    // 2026-08-20 v5: mismo concepto (entrega de llave), con el fondo de
    // estudio tiñendo hacia el índigo de la hora azul en vez de negro
    // neutro, para que combine con el resto del set.
    imagen: `${ASSETS_BASE_URL}/servicios/seguro-vehiculos.webp`,
  },
  {
    slug: "seguro-viajes",
    icono: Plane,
    lineaSeguros: true,
    // 2026-08-20 v5: viajero con maleta y sombrero frente al ventanal de
    // una terminal aérea a la hora azul, avión sin librea visible en la
    // pista — a pedido del cliente ("una persona en un aeropuerto"), en
    // vez del arco de piedra genérico de la v4.
    imagen: `${ASSETS_BASE_URL}/servicios/seguro-viajes.webp`,
  },
  {
    slug: "seguro-salud",
    icono: HeartPulse,
    lineaSeguros: true,
    // 2026-08-20 v5: mismo concepto (mano con estetoscopio), con un
    // resplandor índigo de fondo a través de una ventana de clínica en
    // vez del negro neutro de la v4, para que combine con el resto.
    imagen: `${ASSETS_BASE_URL}/servicios/seguro-salud.webp`,
  },
  {
    // Al final, no arriba con los otros "importación": ese primer bloque
    // (importacion-vehiculos / importacion-mercaderias) está marcado como
    // "los dos core, van primero" — insertar acá arriba habría corrido esa
    // jerarquía sin que nadie lo pidiera. Como cae en la posición 9, no
    // entra en los 6 que ServiciosAdicionales destaca en el home
    // (DESTACADOS = 6, ver ese archivo) — sólo se ve en /servicios, mismo
    // trato que seguro-viajes/seguro-salud. Si el cliente quiere que
    // aparezca en el home, avisar para reordenar el array.
    slug: "importacion-discapacidad",
    icono: Accessibility,
    // 2026-08-20 v5: auto sin marca de espaldas en una calle a la hora
    // azul, con el símbolo internacional de accesibilidad en el vidrio
    // trasero — a pedido explícito del cliente ("un auto de espaldas y
    // en el vidrio poner el símbolo de discapacitados"), en vez de la
    // rampa/elevador de la v4.
    imagen: `${ASSETS_BASE_URL}/servicios/importacion-discapacidad.webp`,
  },
];
