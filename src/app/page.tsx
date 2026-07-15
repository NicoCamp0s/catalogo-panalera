'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types/Product';
import productsJson from '../../data/product.json';
import ProductCard from '@/components/ProductCard';
import Carousel from '@/components/Carousel';
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const products: Product[] = productsJson;
  const instagramUrl = "https://www.instagram.com/panialeranico?igsh=MTlqdWsyYmlvNnRiOQ==";

useEffect(() => {
  if (!hasScrolled.current) {
    hasScrolled.current = true;
    return; // No hacer scroll en el primer render
  }

  if (productsRef.current) {
    productsRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [currentPage]);

const cleanText = (text: string) => 
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const filteredProducts = products.filter((product) => {
  const searchTermClean = cleanText(searchTerm);
  const productNameClean = cleanText(product.name);
  const productDescClean = cleanText(product.description);

  return productNameClean.includes(searchTermClean) || productDescClean.includes(searchTermClean);
});

  // Filtro por búsqueda
  // const filteredProducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   product.description.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Paginación
  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear página al buscar
  };

  return (
    <main className="min-h-screen bg-emerald-50 p-4">
      {/* Logo + Envío */}
      <div className="bg-emerald-100 mb-8 rounded-xl overflow-hidden shadow-md">
        {/* Logo */}
        <div className="p-4 text-center border-b border-emerald-200 bg-emerald-200">
          <Image
            src="/images/panalera_nico.png"
            alt="Logo Pañalera Nico"
            width={600}
            height={300}
            className="mx-auto"
            priority
          />
        </div>
        {/* Cartel de envíos */}
        <div className="bg-yellow-300 text-yellow-900 font-semibold text-center py-3 text-base sm:text-lg animate-pulse">
          📦 ¡Envíos a partir de $30.000!
        </div>
      </div>
      {/* Carrusel */}
      <div className="mx-auto mb-8 px-4" style={{ maxWidth: '1280px' }}>
        <Carousel />
      </div>
      {/* Título */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-emerald-800 drop-shadow-sm tracking-tight">
        🛍️ Catálogo de Productos
      </h1>
      {/* Buscador */}
      <div className="relative max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>
      {/* Productos */}
      {currentProducts.length === 0 ? (
        <p className="text-center text-gray-500">No se encontraron productos.</p>
      ) : (
        <div
        ref={productsRef} 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded transition font-medium ${
                currentPage === i + 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      {/* Contacto */}
      <div className="mt-12 mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
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
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 via-pink-500 to-orange-400 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <FaInstagram size={22} />
            Seguinos en Instagram
          </a>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* WhatsApp */}
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

        {/* Instagram */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Instagram"
          title="Seguinos en Instagram"
        >
          <FaInstagram size={28} />
        </a>

        {/* Volver arriba */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-700 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-gray-800"
          aria-label="Volver arriba"
        >
          ↑
        </button>
      </div>
    </main>
  );
}
