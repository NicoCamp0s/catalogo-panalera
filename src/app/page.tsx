'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types/Product';
import productsJson from '../../data/product.json';
import ProductCard from '@/components/ProductCard';
import Carousel from '@/components/Carousel';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const products: Product[] = productsJson;

useEffect(() => {
  if (!hasScrolled.current) {
    hasScrolled.current = true;
    return; // No hacer scroll en el primer render
  }

  if (productsRef.current) {
    productsRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [currentPage]);

  // Filtro por búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          📦 ¡Envíos a partir de $20.000!
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
      {/* WhatsApp sección informativa */}
      <div className="mt-12 text-center max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">¿No encontrás lo que estás buscando?</h2>
        <p className="mb-4 text-gray-700">
          Escribinos por WhatsApp y te ayudamos a encontrar el producto que necesitás.
        </p>
        <a
          href="https://wa.me/541161574074"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Contactar por WhatsApp
        </a>
      </div>
      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/541161574074"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12a11.933 11.933 0 001.64 6.02L0 24l6.25-1.64A11.936 11.936 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.243 17.243c-.243.684-1.412 1.3-1.957 1.375-.517.07-1.177.1-1.877-.106-.433-.125-1.014-.33-1.767-.686-3.113-1.449-5.152-5.054-5.307-5.297-.154-.243-1.266-1.69-1.266-3.226s.8-2.287 1.086-2.543c.285-.256.611-.32.814-.32.202 0 .405.002.58.01.188.008.435-.07.68.518.243.58.825 1.996.897 2.138.07.14.116.309.023.494-.094.185-.14.3-.273.46-.132.157-.28.35-.4.47-.13.127-.265.264-.114.518.15.256.663 1.093 1.426 1.77 1.014.907 1.87 1.194 2.133 1.33.27.132.426.11.583-.066.156-.175.675-.786.857-1.056.183-.27.367-.22.614-.132.243.088 1.544.728 1.807.86.27.133.45.198.517.308.07.114.07.66-.173 1.344z" />
        </svg>
      </a>
      {/* Botón flotante: Ir arriba */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-21 right-8 bg-gray-700 hover:bg-gray-800 text-white p-4 rounded-full shadow-lg z-50 transition transform hover:scale-110"
        aria-label="Volver arriba"
      >
        ↑
      </button>
    </main>
  );
}
