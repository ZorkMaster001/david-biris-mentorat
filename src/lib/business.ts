/**
 * Datele locale ale afacerii, intr-un singur loc. Apar in metadate, in graful de
 * date structurate si in subsolul paginii, deci nu au voie sa se contrazica.
 *
 * TODO(client): lipsesc, si nu se inventeaza —
 *   - adresa exacta a salii unde antreneaza (strada + numar);
 *   - coordonatele (`geo`), care se pun doar impreuna cu adresa reala;
 *   - programul (`openingHours`) si intervalul de pret (`priceRange`).
 * Pana atunci schema declara doar localitatea si judetul, ceea ce e adevarat.
 * O adresa aproximativa ar fi mai rea decat una lipsa: Google verifica datele
 * locale, iar o nepotrivire strica increderea in tot restul profilului.
 */
export const CITY = "Târgu Mureș";
export const REGION = "Mureș";

/**
 * Subiectele pe care le acopera, in engleza fiindca `knowsAbout` e citit de motoare,
 * nu de oameni, iar vocabularul lor de referinta e englezesc.
 */
export const KNOWS_ABOUT = [
  "personal training",
  "strength training",
  "weight loss",
  "nutrition coaching",
  "boxing",
  "climbing",
  "swimming",
  "habit building",
];
