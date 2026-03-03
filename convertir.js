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

    return {
      id: START_ID + index,
      name: item.nombre,
      description: `${item.marca} - ${item.tipo} - x${item.cantxbul}`,
      price: price,
      transfer: price,
      priceCard: Math.round(price * 1.15),
      image: "/productos/default.jpg"
    };
  });

fs.writeFileSync(
  "productos_filtrados.json",
  JSON.stringify(productos, null, 2)
);

console.log(`Se generaron ${productos.length} productos correctamente`);