/**
 * Cardul de previzualizare al paginii.
 *
 * Fisierele de imagine din Next se aplica segmentului in care stau, nu si celor
 * de sub el: cat timp exista doar la `[locale]`, paginile secundare se trimiteau
 * pe WhatsApp si Instagram fara nicio poza, ca linkuri goale. Reexportam acelasi
 * modul in loc sa-l copiem, ca sa ramana o singura compozitie de intretinut.
 */
export { default, size, contentType, alt, generateStaticParams } from "../opengraph-image";
