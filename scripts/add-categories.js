/**
 * One-shot / re-runnable: adds `category` to each product in data/product.json
 * using the same keyword rules as src/lib/categories.ts
 */
const fs = require('fs');
const path = require('path');

const PRODUCT_PATH = path.join(__dirname, '..', 'data', 'product.json');

const CATEGORY_KEYWORDS = [
  {
    id: 'juguetes',
    keywords: [
      'juguete',
      'sonajero',
      'mordillo',
      'mordedor',
      'encastr',
      'rompecabezas',
      'bloques',
      'peluche',
      'muneco',
      'muneca',
      'didactic',
      'magnetico',
      'juego de',
      'pelota flex',
      'pop it',
      'tobogan',
      'burbujas',
      'saltarin',
      'gimnasio',
      'pelotero',
      'alfombra musical',
      'dinosaurio',
      'dinosarios',
      'camara de juguete',
      'perro de juguete',
      'conejo de juguete',
      'pinguino',
      'movil',
      'triciclo',
      'camicleta',
      'patacleta',
      'monopatin',
      'cuatriciclo',
      'moto a bateria',
      'auto a bateria',
      'coche de madera',
      'caminador',
      'rodado',
    ],
  },
  {
    id: 'carritos',
    keywords: [
      'coche',
      'cochecito',
      'andador',
      'andarin',
      'butaca',
      'corralito',
      'corral cuna',
      'silla de comer',
      'silla bouncer',
      'cuna corralito',
      'huevito',
      'travel system',
      'jumper',
    ],
  },
  {
    id: 'panales',
    keywords: ['pañal', 'panal', 'pampers'],
  },
  {
    id: 'perfumeria',
    keywords: [
      'toallita',
      'jabon',
      'shampoo',
      'acondicionador',
      'oleo',
      'algodon',
      'mamario',
      'aposito',
      'bano liquido',
      'baby dove',
      'perfum',
    ],
  },
];

const cleanText = (text) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const matchesKeywords = (haystack, keywords) =>
  keywords.some((keyword) => haystack.includes(keyword));

const CARRITOS_NAME_PRIORITY = [
  'andador',
  'andarin',
  'butaca',
  'corralito',
  'corral cuna',
  'silla de comer',
  'silla bouncer',
  'cuna corralito',
  'huevito',
  'travel system',
  'jumper',
];

const inferCategory = (name, description = '') => {
  const nameHaystack = cleanText(name);
  const fullHaystack = cleanText(`${name} ${description}`);

  if (matchesKeywords(nameHaystack, CARRITOS_NAME_PRIORITY)) {
    return 'carritos';
  }

  for (const { id, keywords } of CATEGORY_KEYWORDS) {
    if (matchesKeywords(fullHaystack, keywords)) {
      return id;
    }
  }

  return 'otros';
};

const products = JSON.parse(fs.readFileSync(PRODUCT_PATH, 'utf8'));
const counts = { panales: 0, perfumeria: 0, carritos: 0, juguetes: 0, otros: 0 };

const updated = products.map((product) => {
  const category = inferCategory(product.name, product.description ?? '');
  counts[category] += 1;
  const { category: _old, ...rest } = product;
  return { ...rest, category };
});

fs.writeFileSync(PRODUCT_PATH, JSON.stringify(updated, null, 2) + '\n');
console.log(`Actualizados ${updated.length} productos:`, counts);
