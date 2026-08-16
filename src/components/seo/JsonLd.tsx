/**
 * Continut static, construit de noi din modulul de continut tipat. Nu exista
 * input de utilizator care sa ajunga aici, deci serializarea e sigura.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
