// Banderas propias en SVG (no una librería aparte solo por dos íconos) —
// mismo criterio que el logo de Mercedes-Benz redibujado a mano en
// public/img/marcas/: forma geométrica simple, no arte con licencia.
// viewBox 3:2 (proporción estándar de bandera) para que ambas midan igual
// una al lado de la otra sin distorsión.

export function FlagES({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden focusable={false}>
      <rect width="30" height="20" fill="#AA151B" />
      <rect y="5" width="30" height="10" fill="#F1BF00" />
    </svg>
  );
}

export function FlagUS({ className }: { className?: string }) {
  const stripeH = 20 / 13;
  const stripes = Array.from({ length: 13 }, (_, i) => (
    <rect
      key={i}
      y={i * stripeH}
      width="30"
      height={stripeH}
      fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"}
    />
  ));
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden focusable={false}>
      {stripes}
      <rect width="13" height={stripeH * 7} fill="#3C3B6E" />
    </svg>
  );
}
