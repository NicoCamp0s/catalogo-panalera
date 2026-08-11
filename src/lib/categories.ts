import type { ProductCategory } from '@/types/Product';

export type CategoryFilterId = 'todos' | ProductCategory;

export const CATEGORIES: { id: CategoryFilterId; label: string; emoji: string }[] = [
  { id: 'todos', label: 'Todos', emoji: '🛍️' },
  { id: 'panales', label: 'Pañales', emoji: '👶' },
  { id: 'perfumeria', label: 'Perfumería', emoji: '🧴' },
  { id: 'carritos', label: 'Carritos', emoji: '🚼' },
  { id: 'juguetes', label: 'Juguetes', emoji: '🧸' },
  { id: 'otros', label: 'Otros', emoji: '📦' },
];

/**
 * Keywords para inferir category al generar/migrar datos. La app lee `product.category`.
 * Se evalúan en orden: la primera categoría que matchea gana.
 */
export const CATEGORY_KEYWORDS: { id: ProductCategory; keywords: string[] }[] = [
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

const cleanText = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const matchesKeywords = (haystack: string, keywords: string[]) =>
  keywords.some((keyword) => haystack.includes(keyword));

/** Keywords de carritos que, si aparecen en el nombre, tienen prioridad sobre juguetes. */
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

export const inferCategory = (name: string, description = ''): ProductCategory => {
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
