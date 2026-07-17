import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';
import { buildWhatsAppUrl, formatCurrency } from '@/lib/catalog';
import { Product } from '@/types/Product';

export default function ProductCard({ product }: { product: Product }) {
  const whatsappMessage = `Hola, consulto por: ${product.name}.`;
  const cardPrice = product.priceCard > 0 ? formatCurrency(product.priceCard) : null;

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <h2 className="text-center text-lg font-semibold text-gray-800">{product.name}</h2>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg bg-pink-50 py-2 text-center">
          <p className="text-sm text-gray-500">Precio en efectivo</p>
          <p className="text-2xl font-bold text-pink-600">
            {product.price === 0 ? 'Sin stock' : formatCurrency(product.price)}
          </p>
        </div>

        <div className="rounded-lg bg-pink-50 py-2 text-center">
          <p className="text-sm text-gray-500">Precio con transferencia</p>
          <p className="text-2xl font-bold text-pink-600">
            {product.transfer === 0 ? 'Sin stock' : formatCurrency(product.transfer)}
          </p>
        </div>

        {/* {cardPrice && (
          <div className="rounded-lg bg-pink-50 py-2 text-center">
            <p className="text-sm text-gray-500">Precio con tarjeta</p>
            <p className="text-2xl font-bold text-pink-600">{cardPrice}</p>
          </div>
        )} */}
      </div>

      <div className="mt-5 flex gap-3">
        <a
          href={buildWhatsAppUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-green-700 hover:shadow-md"
          aria-label={`Consultar por ${product.name}`}
        >
          <FaWhatsapp size={22} />
          Consultar
        </a>
      </div>
    </div>
  );
}