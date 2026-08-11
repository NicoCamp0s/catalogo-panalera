const XLSX = require("xlsx");
const fs = require("fs");

const START_ID = 56;

const marcasPermitidas = [
  "AVENT",
  "BABELITO",
  "BABIES.CO",
  "BENARE",
  "CHICCO",
  "DANIELLE",
  "DISPITA",
  "ESTRELLA",
  "LOOPI",
  "MUJERCITAS",
  "NONINO",
  "NONISEC",
  "NUTRILON",
  "PETIT ENFANT",
  "TODDLER",
  "UPA LA LA"
];

const CATEGORY_KEYWORDS = [
  {
    id: "juguetes",
    keywords: [
      "juguete",
      "sonajero",
      "mordillo",
      "mordedor",
      "encastr",
      "rompecabezas",
      "bloques",
      "peluche",
      "muneco",
      "muneca",
      "didactic",
      "magnetico",
      "juego de",
      "pelota flex",
      "pop it",
      "tobogan",
      "burbujas",
      "saltarin",
      "gimnasio",
      "pelotero",
      "alfombra musical",
      "dinosaurio",
      "dinosarios",
      "camara de juguete",
      "perro de juguete",
      "conejo de juguete",
      "pinguino",
      "movil",
      "triciclo",
      "camicleta",
      "patacleta",
      "monopatin",
      "cuatriciclo",
      "moto a bateria",
      "auto a bateria",
      "coche de madera",
      "caminador",
      "rodado",
    ],
  },
  {
    id: "carritos",
    keywords: [
      "coche",
      "cochecito",
      "andador",
      "andarin",
      "butaca",
      "corralito",
      "corral cuna",
      "silla de comer",
      "silla bouncer",
      "cuna corralito",
      "huevito",
      "travel system",
      "jumper",
    ],
  },
  {
    id: "panales",
    keywords: ["pañal", "panal", "pampers"],
  },
  {
    id: "perfumeria",
    keywords: [
      "toallita",
      "jabon",
      "shampoo",
      "acondicionador",
      "oleo",
      "algodon",
      "mamario",
      "aposito",
      "bano liquido",
      "baby dove",
      "perfum",
    ],
  },
];

const cleanText = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const matchesKeywords = (haystack, keywords) =>
  keywords.some((keyword) => haystack.includes(keyword));

const CARRITOS_NAME_PRIORITY = [
  "andador",
  "andarin",
  "butaca",
  "corralito",
  "corral cuna",
  "silla de comer",
  "silla bouncer",
  "cuna corralito",
  "huevito",
  "travel system",
  "jumper",
];

const inferCategory = (name, description = "") => {
  const nameHaystack = cleanText(name);
  const fullHaystack = cleanText(`${name} ${description}`);

  if (matchesKeywords(nameHaystack, CARRITOS_NAME_PRIORITY)) {
    return "carritos";
  }

  for (const { id, keywords } of CATEGORY_KEYWORDS) {
    if (matchesKeywords(fullHaystack, keywords)) {
      return id;
    }
  }

  return "otros";
};

const workbook = XLSX.readFile("productosf1.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

const productos = data
  .filter(item =>
    marcasPermitidas.includes(
      item.marca?.toString().trim().toUpperCase()
    )
  )
  .map((item, index) => {
    const price = parseFloat(
      String(item.price).replace(",", ".")
    );
    const name = item.nombre;
    const description = `${item.marca} - ${item.tipo} - x${item.cantxbul}`;

    return {
      id: START_ID + index,
      name,
      description,
      price: price,
      transfer: price,
      priceCard: Math.round(price * 1.15),
      image: "/productos/default.jpg",
      category: inferCategory(name, description),
    };
  });

fs.writeFileSync(
  "productos_filtrados.json",
  JSON.stringify(productos, null, 2)
);

console.log(`Se generaron ${productos.length} productos correctamente`);