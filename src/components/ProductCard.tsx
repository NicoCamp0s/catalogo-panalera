'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaWhatsapp, FaExpand, FaTimes } from 'react-icons/fa';
import { buildWhatsAppUrl, formatCurrency } from '@/lib/catalog';
import { Product } from '@/types/Product';

export default function ProductCard({ product }: { product: Product }) {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const whatsappMessage = `Hola, consulto por: ${product.name}.`;
  const hasDescription =
    product.description && product.description.trim().length > 0 && product.description.trim() !== 'a';

  // Cerrar el lightbox con la tecla Escape
  useEffect(() => {
    if (!isImageOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsImageOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isImageOpen]);

  return (
    <>
      <div className="group flex flex-col rounded-2xl border border-black/8 bg-surface p-4 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <button
          type="button"
          onClick={() => setIsImageOpen(true)}
          className="relative mb-4 h-48 w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label={`Ampliar imagen de ${product.name}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-ink shadow sm:hidden">
            <FaExpand size={10} />
            Ampliar
          </span>
          <span className="absolute inset-0 hidden items-center justify-center bg-black/0 opacity-0 transition-all duration-200 sm:flex group-hover:bg-black/20 group-hover:opacity-100">
            <span className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow">
              <FaExpand size={12} />
              Ampliar
            </span>
          </span>
        </button>

        <h2 className="text-center text-lg font-semibold text-ink">{product.name}</h2>

        {hasDescription && (
          <p className="mt-2 line-clamp-3 text-center text-sm text-muted">{product.description}</p>
        )}

        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-red-50 py-2 text-center">
            <p className="text-sm text-muted">Precio en efectivo</p>
            <p className="text-2xl font-bold text-red-600">
              {product.price === 0 ? 'Sin stock' : formatCurrency(product.price)}
            </p>
          </div>

          <div className="rounded-lg bg-red-50/70 py-2 text-center">
            <p className="text-sm text-muted">Precio con transferencia</p>
            <p className="text-2xl font-bold text-red-600">
              {product.transfer === 0 ? 'Sin stock' : formatCurrency(product.transfer)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <a
            href={buildWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#1ebe57] hover:shadow-md"
            aria-label={`Consultar por ${product.name}`}
          >
            <FaWhatsapp size={22} />
            Consultar
          </a>
        </div>
      </div>

      {isImageOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsImageOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ampliada de ${product.name}`}
        >
          <button
            type="button"
            onClick={() => setIsImageOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Cerrar imagen ampliada"
          >
            <FaTimes size={22} />
          </button>

          <div
            className="relative h-[80vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <p className="absolute bottom-6 left-1/2 w-full max-w-lg -translate-x-1/2 px-4 text-center text-sm text-white/90">
            {product.name}
          </p>
        </div>
      )}
    </>
  );
}