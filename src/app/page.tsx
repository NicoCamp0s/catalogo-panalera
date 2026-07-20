'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';
import Carousel from '@/components/Carousel';
import productsJson from '../../data/product.json';
import { Product } from '@/types/Product';
import { instagramUrl, productsPerPage } from '@/lib/catalog';

export default function Home() {
const [searchTerm, setSearchTerm] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const productsRef = useRef<HTMLDivElement>(null);
const hasScrolled = useRef(false);
const products = productsJson as Product[];

useEffect(() => {
  if (!hasScrolled.current) {
    hasScrolled.current = true;
    return;
  }

  productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, [currentPage]);

const cleanText = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const filteredProducts = useMemo(() => {
  const cleanedSearch = cleanText(searchTerm);
  const searchWords = cleanedSearch.split(/\s+/).filter((word) => word.length > 0);

  if (searchWords.length === 0) {
    return products;
  }

  return products.filter((product) => {
    const productNameClean = cleanText(product.name);
    const productDescClean = cleanText(product.description);
    const fullProductText = `${productNameClean} ${productDescClean}`;

    return searchWords.every((word) => fullProductText.includes(word));
  });
}, [products, searchTerm]);

const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
const hasSearchTerm = searchTerm.trim().length > 0;
const totalProductsLabel = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto' : 'productos'}`;

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
  setCurrentPage(1);
};

const handleResetSearch = () => {
  setSearchTerm('');
  setCurrentPage(1);
};

return (
  <main className="min-h-screen bg-emerald-50 p-4">
    <div className="mb-8 overflow-hidden rounded-xl bg-emerald-100 shadow-md">
      <div className="border-b border-emerald-200 bg-emerald-200 p-4 text-center">
        <Image
          src="/images/panalera_nico.png"
          alt="Logo Pañalera Nico"
          width={600}
          height={300}
          className="mx-auto"
          priority
        />
      </div>
      <div className="bg-yellow-300 py-3 text-center text-base font-semibold text-yellow-900 animate-pulse sm:text-lg">
        📦 ¡Envíos a partir de $15.000!
      </div>
    </div>

    <div className="mx-auto mb-8 px-4" style={{ maxWidth: '1280px' }}>
      <Carousel />
    </div>

    <h1 className="mb-10 text-center text-4xl font-extrabold tracking-tight text-emerald-800 drop-shadow-sm sm:text-5xl">
      🛍️ Catálogo de Productos
    </h1>

    <div className="mx-auto mb-6 max-w-md">
      <label htmlFor="product-search" className="sr-only">
        Buscar productos
      </label>
      <div className="relative">
        <input
          id="product-search"
          type="text"
          placeholder="Buscar por nombre o descripción"
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Buscar productos"
          className="w-full rounded-lg border border-gray-300 p-3 pl-10 shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-400"
        />
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>
    </div>

    <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-between gap-3 px-1 text-sm text-gray-600">
      <p>
        {hasSearchTerm
          ? `Mostrando ${currentProducts.length} de ${totalProductsLabel}`
          : `Mostrando ${totalProductsLabel}`}
      </p>
      {hasSearchTerm && (
        <button
          type="button"
          onClick={handleResetSearch}
          className="rounded-full border border-emerald-500 px-3 py-1 font-medium text-emerald-700 transition hover:bg-emerald-50"
        >
          Ver todos los productos
        </button>
      )}
    </div>

    {currentProducts.length === 0 ? (
      <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-gray-700">No se encontraron productos.</p>
        <p className="mt-2 text-gray-500">
          Probá con otro término o volvé a ver todos los productos.
        </p>
        <button
          type="button"
          onClick={handleResetSearch}
          className="mt-4 rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
        >
          Mostrar todos los productos
        </button>
      </div>
    ) : (
      <div
        ref={productsRef}
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
      >
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )}

    {totalPages > 1 && (
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          disabled={currentPage === 1}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentPage(i + 1)}
            className={`rounded-full px-4 py-2 font-medium transition ${
              currentPage === i + 1
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    )}

    <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <h2 className="mb-2 text-center text-2xl font-bold text-emerald-800">
        ¿Necesitás ayuda?
      </h2>

      <p className="mb-6 text-center text-gray-600">
        Si no encontrás el producto que buscás o tenés alguna consulta,
        escribinos o seguinos en Instagram para ver novedades y ofertas.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="https://wa.me/541161574074"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600"
        >
          <FaWhatsapp size={22} />
          Escribir por WhatsApp
        </a>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 py-3 font-semibold text-white transition hover:opacity-90"
        >
          <FaInstagram size={22} />
          Seguinos en Instagram
        </a>
      </div>
    </div>

    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href="https://wa.me/541161574074"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-green-600"
        aria-label="WhatsApp"
        title="Escribinos por WhatsApp"
      >
        <FaWhatsapp size={30} />
      </a>

      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Instagram"
        title="Seguinos en Instagram"
      >
        <FaInstagram size={28} />
      </a>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-700 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-gray-800"
        aria-label="Volver arriba"
        type="button"
      >
        ↑
      </button>
    </div>
  </main>
);
}
