/**
 * Datele afacerii, intr-un singur loc. Apar in metadate, in graful de date
 * structurate si in subsolul paginii, deci nu au voie sa se contrazica.
 *
 * Mentoratul se desfasoara **doar online**. Orasul de mai jos e locul din care
 * lucreaza David, adica adresa afacerii — nu locul in care se tine antrenamentul.
 * De aceea `LocalBusiness` pastreaza localitatea si judetul, dar raza de actiune
 * (`areaServed`) e tara intreaga: altfel schema ar promite ceva ce nu se vinde.
 *
 * TODO(client): lipseste, si nu se inventeaza — programul in care raspunde
 * (`openingHours`). Adresa exacta si coordonatele nu
 * se mai pun deloc: fara antrenamente fata in fata n-ar avea ce sa insemne pentru
 * cineva care cauta, iar o adresa care nu primeste clienti e mai rea decat una
 * lipsa. Google verifica datele locale si o nepotrivire strica increderea in tot
 * restul profilului.
 */
export const CITY = "Târgu Mureș";
export const REGION = "Mureș";

/**
 * Pretul abonamentului, ca numere si cod de moneda, pentru datele structurate.
 * Textul citit de om sta in continut (`pricing`), fiindca se traduce; schema are
 * nevoie de cifre si de un cod ISO, care nu se traduc. Cele doua trebuie sa spuna
 * acelasi lucru: un pret afisat diferit de cel din schema e o nepotrivire pe care
 * Google o vede.
 *
 * `PRICE_AMOUNT` e pretul care se plateste acum, deci el intra in `Offer`.
 * `PRICE_STANDARD_AMOUNT` e cat va costa dupa ce se ocupa locurile de lansare — sta
 * aici doar ca sa fie scris o singura data, nu se pune in schema: schema descrie ce
 * se vinde azi, nu ce se va vinde.
 *
 * TODO(client): cand se ocupa cele `PRICE_LAUNCH_SEATS` locuri, `PRICE_AMOUNT`
 * devine 399 si dispar din `pricing` eticheta de lansare, randul cu pretul de dupa
 * si promisiunea de pastrare a pretului.
 */
export const PRICE_AMOUNT = 349;
export const PRICE_STANDARD_AMOUNT = 399;
export const PRICE_LAUNCH_SEATS = 10;
export const PRICE_CURRENCY = "RON";
/** Codul UN/CEFACT pentru luna, cerut de `UnitPriceSpecification.unitCode`. */
export const PRICE_PERIOD = "MON";

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
