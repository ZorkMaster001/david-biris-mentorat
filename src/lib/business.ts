/**
 * Datele afacerii, intr-un singur loc. Apar in metadate, in graful de date
 * structurate si in subsolul paginii, deci nu au voie sa se contrazica.
 *
 * Mentoratul se desfasoara **doar online**. Orasul de mai jos e locul din care
 * lucreaza David, adica adresa afacerii — nu locul in care se tine antrenamentul.
 * De aceea `LocalBusiness` pastreaza localitatea si judetul, dar raza de actiune
 * (`areaServed`) e tara intreaga: altfel schema ar promite ceva ce nu se vinde.
 *
 * TODO(client): lipsesc, si nu se inventeaza — intervalul de pret (`priceRange`)
 * si programul in care raspunde (`openingHours`). Adresa exacta si coordonatele nu
 * se mai pun deloc: fara antrenamente fata in fata n-ar avea ce sa insemne pentru
 * cineva care cauta, iar o adresa care nu primeste clienti e mai rea decat una
 * lipsa. Google verifica datele locale si o nepotrivire strica increderea in tot
 * restul profilului.
 */
export const CITY = "Târgu Mureș";
export const REGION = "Mureș";

/**
 * Subiectele pe care le acopera, in engleza fiindca `knowsAbout` e citit de motoare,
 * nu de oameni, iar vocabularul lor de referinta e englezesc.
 *
 * Boxul, inotul si cataratul stau pe persoana, nu pe serviciu: le practica el, dar nu
 * le preda. Ce vinde e sala, mancarea si obiceiul din jurul lor.
 */
export const KNOWS_ABOUT = [
  "online personal training",
  "strength training",
  "muscle building",
  "body recomposition",
  "weight loss",
  "nutrition coaching",
  "online coaching",
  "habit building",
  "fitness lifestyle",
  "motivation",
  "discipline",
  "boxing",
  "climbing",
  "swimming",
];
