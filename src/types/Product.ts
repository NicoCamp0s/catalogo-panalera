export type ProductCategory =
  | 'panales'
  | 'perfumeria'
  | 'carritos'
  | 'juguetes'
  | 'otros';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  transfer: number;
  priceCard: number;
  image: string;
  category: ProductCategory;
};
