import {
  BadgeCheck,
  Container,
  Globe2,
  HeartPulse,
  Landmark,
  Plane,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

export const siteConfig = {
  nombre: "Diplomatic",
  apellido: "Automobile Trading",
  tagline: "Exclusive Vehicles for Global Citizens.",
};

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
// Los SVG viven en `public/img/marcas/` (blancos, viewBox 24x24); BrandStrip
// los tiñe con opacidad. Son marcas registradas de sus dueños y se usan de
// forma nominativa para identificar lo que el concesionario comercializa.
//
// Sin logo todavía: Mercedes-Benz y Land/Range Rover no están en las librerías
// abiertas de iconos porque sus titulares pidieron retirarlos. Para sumarlas
// hay que pedirle el SVG oficial al cliente, guardarlo en esa carpeta con
// `fill="#ffffff"` y referenciarlo acá. Mientras no haya archivo, la marca
// cae al wordmark tipográfico.
// `escala` equilibra ópticamente la fila: todos los SVG vienen en una caja de
// 24x24, pero los logos anchos y bajos (los aros de Audi, las alas de Bentley)
// llenan poca altura y se ven diminutos junto a un escudo como el de Porsche.
// Es ajuste a ojo, no un bug: si se cambia un logo, revisar el número.
// PENDIENTE: confirmar con el cliente la lista real de marcas que comercializa.
// Esta selección es una propuesta coherente con el posicionamiento de lujo.
export const marcas: { nombre: string; logo?: string; escala?: number }[] = [
  { nombre: "BMW", logo: "/img/marcas/bmw.svg" },
  { nombre: "Audi", logo: "/img/marcas/audi.svg", escala: 1.4 },
  { nombre: "Porsche", logo: "/img/marcas/porsche.svg" },
  { nombre: "Bentley", logo: "/img/marcas/bentley.svg", escala: 1.55 },
  { nombre: "Rolls-Royce", logo: "/img/marcas/rollsroyce.svg", escala: 0.92 },
  { nombre: "Ferrari", logo: "/img/marcas/ferrari.svg", escala: 1.05 },
  { nombre: "Lamborghini", logo: "/img/marcas/lamborghini.svg", escala: 1.05 },
  { nombre: "Aston Martin", logo: "/img/marcas/astonmartin.svg", escala: 1.7 },
  { nombre: "Maserati", logo: "/img/marcas/maserati.svg", escala: 1.05 },
  { nombre: "McLaren", logo: "/img/marcas/mclaren.svg", escala: 1.75 },
  { nombre: "Volvo", logo: "/img/marcas/volvo.svg", escala: 1.05 },
  { nombre: "Cadillac", logo: "/img/marcas/cadillac.svg", escala: 1.3 },
  { nombre: "Toyota", logo: "/img/marcas/toyota.svg", escala: 1.35 },
  { nombre: "Mazda", logo: "/img/marcas/mazda.svg", escala: 1.15 },
  { nombre: "Kia", logo: "/img/marcas/kia.svg", escala: 1.35 },
  // Mercedes-Benz no está en simple-icons (su titular la hizo retirar de esa
  // librería). `mercedes.svg` no viene de ahí: es una estrella de tres
  // puntas redibujada a mano como forma geométrica simple — uso nominativo
  // para identificar que se comercializa la marca, igual que el resto de
  // estos logos. Si el cliente consigue el asset oficial del fabricante,
  // reemplazar el archivo (mismo nombre) para que quede pixel-perfect.
  { nombre: "Mercedes-Benz", logo: "/img/marcas/mercedes.svg", escala: 1.05 },
];

export type Servicio = {
  slug: string;
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
  // Foto de fondo de la tarjeta (webp, en public/img/servicios/). Generadas
  // con IA (Higgsfield/z_image) como placeholder distintivo por servicio —
  // genéricas a propósito (sin autos de marca reconocible, sin texto legible,
  // sin logos) para evitar cualquier problema de marca registrada. Cuando el
  // cliente entregue fotos propias, reemplazar el archivo con el mismo
  // nombre y no hace falta tocar este archivo.
  imagen?: string;
};

export const servicios: Servicio[] = [
  {
    slug: "matriculacion-vehicular",
    titulo: "Matriculación Vehicular",
    descripcion:
      "Contamos con el servicio de un gestor que le ayuda con los procesos requeridos por nuestras autoridades para regularizar la matriculación de su vehículo, usted despreocúpese que nosotros somos su soporte.",
    icono: BadgeCheck,
    imagen: "/img/servicios/matriculacion-vehicular.webp",
  },
  {
    slug: "importacion-mercaderias",
    titulo: "Importación de Mercaderías con Cupo Diplomático",
    descripcion:
      "Si usted desea hacer uso de su cupo para la importación de bienes con cargo a su cupo diplomático anual, nosotros le ayudamos con la importación de su mercadería vía aérea o marítima, así como de su menaje de casa.",
    icono: Container,
    imagen: "/img/servicios/importacion-mercaderias.webp",
  },
  {
    slug: "importacion-vehiculos",
    titulo: "Importación de Vehículos",
    descripcion:
      "¿Desea importar o exportar desde o hasta otro país su vehículo? Estamos para ayudarle en todo el proceso hasta concluir con la entrega del mismo en su destino final.",
    icono: Truck,
    imagen: "/img/servicios/importacion-vehiculos.webp",
  },
  {
    slug: "seguro-vehiculos",
    titulo: "Seguro de Vehículos",
    descripcion:
      "Tenemos para usted las mejores tasas del mercado, con amplios planes de financiamiento y sin intereses hasta 12 meses plazo, para lo cual trabajamos con Aseguradoras de prestigio Nacional e Internacional que le garantizan una atención oportuna y de calidad.",
    icono: ShieldCheck,
    imagen: "/img/servicios/seguro-vehiculos.webp",
  },
  {
    slug: "seguro-viajes",
    titulo: "Seguro de Viajes",
    descripcion:
      "Por negocios o vacaciones es importante estar siempre bien protegidos, ponemos a su disposición seguro de viajes que le permitan sentirse seguro y relajado al salir del país.",
    icono: Plane,
    imagen: "/img/servicios/seguro-viajes.webp",
  },
  {
    slug: "seguro-salud",
    titulo: "Seguro de Salud",
    descripcion:
      "Si usted o su familia requieren contar con un seguro médico, tenemos una gama completa de prestadores de servicios médicos que pueden ofrecerle las mejores alternativas.",
    icono: HeartPulse,
    imagen: "/img/servicios/seguro-salud.webp",
  },
];
