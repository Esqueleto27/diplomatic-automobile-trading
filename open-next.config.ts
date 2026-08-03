import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Sin override de incrementalCache: no vale la pena un bucket R2 aparte
// sólo para el caché ISR de Next en un sitio de ~20 autos / ~30 visitas
// día — se usa el caché en memoria por defecto de OpenNext.
export default defineCloudflareConfig({});
