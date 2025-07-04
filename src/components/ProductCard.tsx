import { Product } from "@/types/Product";

const whatsappNumber = "541161574074";

export default function ProductCard({ product }: { product: Product }) {
  const whatsappMessage = `Hola, ${product.name}.`;

  return (
    <div className="group border border-gray-200 rounded-2xl p-4 shadow-md bg-white flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg">
      <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <h2 className="text-lg font-semibold text-center text-gray-800 mb-1">{product.name}</h2>

      <div className="mt-2 text-center">
        <p className="text-sm text-gray-500">Precio en efectivo</p>
        <p className="text-xl text-pink-600 font-bold">${product.price}</p>
      </div>

      <div className="mt-2 text-center">
        <p className="text-sm text-gray-500">Precio con transferencia</p>
        <p className="text-xl text-pink-600 font-bold">${product.transfer}</p>
      </div>

      <div className="mt-2 text-center">
        <p className="text-sm text-gray-500">Precio con tarjeta</p>
        <p className="text-xl text-pink-600 font-bold">${product.priceCard}</p>
      </div>

      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.114.55 4.094 1.514 5.824L0 24l6.301-1.647A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.207 17.032c-.23.64-1.34 1.214-1.858 1.288-.49.068-1.116.094-1.78-.102-.41-.118-.962-.31-1.676-.647-2.954-1.374-4.89-4.795-5.037-5.018-.146-.224-1.2-1.604-1.2-3.06s.758-2.174 1.03-2.412c.27-.24.577-.3.768-.3s.384.002.548.01c.178.008.412-.066.643.492.23.55.783 1.896.853 2.03.068.134.11.292.022.466-.087.174-.13.282-.255.434-.124.15-.264.335-.377.45-.123.12-.25.25-.107.49.142.24.623 1.03 1.34 1.67.953.855 1.756 1.124 2 .25.244-.874 1.256-1.303 1.516-1.17.26.133 1.47.693 1.72.82.257.127.427.188.49.293.066.105.066.63-.162 1.27z" />
        </svg>
        Consultar
      </a>
    </div>
  );
}
