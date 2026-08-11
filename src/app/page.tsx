'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';
import Carousel from '@/components/Carousel';
import productsJson from '../../data/product.json';
import { Product } from '@/types/Product';
import { CATEGORIES, type CategoryFilterId } from '@/lib/categories';
import { instagramUrl, productsPerPage } from '@/lib/catalog';

const MAX_VISIBLE_PAGES = 5;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterId>('todos');
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

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilterId, number> = {
      todos: products.length,
      panales: 0,
      perfumeria: 0,
      carritos: 0,
      juguetes: 0,
      otros: 0,
    };

    products.forEach((product) => {
      counts[product.category] += 1;
    });

    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const cleanedSearch = cleanText(searchTerm);
    const searchWords = cleanedSearch.split(/\s+/).filter((word) => word.length > 0);

    return products
      .filter((product) => selectedCategory === 'todos' || product.category === selectedCategory)
      .filter((product) => {
        if (searchWords.length === 0) return true;

        const productNameClean = cleanText(product.name);
        const productDescClean = cleanText(product.description);
        const fullProductText = `${productNameClean} ${productDescClean}`;

        return searchWords.every((word) => fullProductText.includes(word));
      });
  }, [products, searchTerm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const hasSearchTerm = searchTerm.trim().length > 0;
  const hasActiveFilters = hasSearchTerm || selectedCategory !== 'todos';
  const totalProductsLabel = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto' : 'productos'}`;

  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = end - MAX_VISIBLE_PAGES + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const showStartEllipsis = visiblePageNumbers[0] > 1;
  const showEndEllipsis = visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectCategory = (categoryId: CategoryFilterId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('todos');
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen p-4 pb-56 sm:p-6 sm:pb-28">
      <header className="animate-brand-rise mx-auto mb-6 max-w-5xl overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-soft)]">
        <div className="bg-emerald-700 px-4 pb-5 pt-6 text-center sm:px-8 sm:pb-8 sm:pt-10">
          <div className="relative mx-auto aspect-[5/1] w-full max-w-[520px] sm:max-w-[640px] md:max-w-[720px]">
            <Image
              src="/images/panalera_nico.png"
              alt="Pañalera Nico"
              fill
              sizes="(max-width: 640px) 520px, (max-width: 768px) 640px, 720px"
              className="object-contain"
              priority
            />
          </div>
          <p className="mt-4 font-display text-2xl font-extrabold tracking-tight text-white sm:mt-5 sm:text-4xl md:text-5xl">
            Pañalera <span className="italic font-semibold text-white/95">Nico</span>
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-emerald-100/90 sm:text-base">
            Todo para tu bebé, en un solo lugar
          </p>
        </div>
        <div className="bg-amber-300 px-3 py-3 text-center text-sm font-semibold text-emerald-900 sm:text-lg">
          📦 ¡Envíos a partir de $15.000!
        </div>
      </header>

      <div className="animate-brand-rise-delay mx-auto mb-8 max-w-3xl text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Catálogo de productos
        </h1>
        <p className="mt-2 text-muted">Pañales, perfumería, carritos, juguetes y más.</p>
      </div>

      <div className="animate-brand-rise-delay-2 mx-auto mb-10 px-1" style={{ maxWidth: '1280px' }}>
        <Carousel />
      </div>

      <div className="mx-auto mb-6 flex max-w-4xl flex-wrap justify-center gap-2 px-1">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleSelectCategory(category.id)}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'border-brand bg-brand text-white shadow-sm'
                  : 'border-black/10 bg-surface text-ink-soft hover:border-brand/40 hover:bg-brand-soft'
              }`}
            >
              <span aria-hidden="true">{category.emoji}</span>
              {category.label}
              <span className={isActive ? 'text-white/80' : 'text-muted'}>
                ({categoryCounts[category.id]})
              </span>
            </button>
          );
        })}
      </div>

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
            className="w-full rounded-xl border border-black/10 bg-surface p-3 pl-10 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            🔍
          </div>
        </div>
      </div>

      <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-between gap-3 px-1 text-sm text-muted">
        <p>
          {hasActiveFilters
            ? `Mostrando ${currentProducts.length} de ${totalProductsLabel}`
            : `Mostrando ${totalProductsLabel}`}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="rounded-full border border-brand/40 px-3 py-1 font-medium text-brand transition hover:bg-brand-soft"
          >
            Ver todos los productos
          </button>
        )}
      </div>

      {currentProducts.length === 0 ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-black/15 bg-surface p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-ink">No se encontraron productos.</p>
          <p className="mt-2 text-muted">
            Probá con otro término, otra categoría, o volvé a ver todos los productos.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 rounded-full bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand-dark"
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
        <nav
          className="mx-auto mt-8 flex max-w-lg items-center justify-between gap-3 px-1 sm:max-w-none sm:justify-center sm:gap-2"
          aria-label="Paginación"
        >
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="shrink-0 rounded-full border border-black/10 bg-surface px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>

          <p className="text-center text-sm font-medium text-ink-soft sm:hidden" aria-live="polite">
            Página {currentPage} de {totalPages}
          </p>

          <div className="hidden flex-wrap items-center justify-center gap-2 sm:flex">
            {showStartEllipsis && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className="rounded-full bg-black/8 px-4 py-2 font-medium text-ink-soft transition hover:bg-black/12"
                >
                  1
                </button>
                <span className="px-1 text-muted">…</span>
              </>
            )}

            {visiblePageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`rounded-full px-4 py-2 font-medium transition ${
                  currentPage === pageNumber
                    ? 'bg-brand text-white'
                    : 'bg-black/8 text-ink-soft hover:bg-black/12'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {showEndEllipsis && (
              <>
                <span className="px-1 text-muted">…</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  className="rounded-full bg-black/8 px-4 py-2 font-medium text-ink-soft transition hover:bg-black/12"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="shrink-0 rounded-full border border-black/10 bg-surface px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        </nav>
      )}

      <div className="mx-auto mt-12 mb-4 max-w-xl rounded-2xl border border-black/8 bg-surface p-6 shadow-[var(--shadow-soft)]">
        <h2 className="mb-2 text-center font-display text-2xl font-bold text-ink">
          ¿Necesitás ayuda?
        </h2>

        <p className="mb-6 text-center text-muted">
          Si no encontrás el producto que buscás o tenés alguna consulta, escribinos o seguinos en
          Instagram para ver novedades y ofertas.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="https://wa.me/541161574074"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-semibold text-white transition hover:bg-[#1ebe57]"
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

      <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3 sm:right-6">
        <a
          href="https://wa.me/541161574074"
          target="_blank"
          rel="noopener noreferrer"
          className="fab-whatsapp flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#1ebe57]"
          aria-label="WhatsApp"
          title="Escribinos por WhatsApp"
        >
          <FaWhatsapp size={30} />
        </a>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:opacity-90"
          aria-label="Instagram"
          title="Seguinos en Instagram"
        >
          <FaInstagram size={28} />
        </a>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-ink-soft"
          aria-label="Volver arriba"
          type="button"
        >
          ↑
        </button>
      </div>
    </main>
  );
}
