"use client";

import { useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

const images = [
  "/ofertas/oferta1.jpg",
  // "/ofertas/oferta2.jpg",
  // "/ofertas/oferta3.jpg",
];

export default function Carousel() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [sliderInstanceRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 10,
    },
  });

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      slider.current?.next();
    }, 6000);
    return () => clearInterval(interval);
  }, [slider]);

  return (
    <section
      className="relative mb-8 mx-auto max-w-5xl rounded-xl overflow-hidden shadow-lg"
      aria-label="Carrusel de ofertas"
      role="region"
    >
      <div
        ref={(ref) => {
          sliderRef.current = ref;
          sliderInstanceRef(ref);
        }}
        className="keen-slider"
      >
        {images.map((src, index) => (
          <div className="keen-slider__slide" key={index}>
            <Image
              src={src}
              alt={`Oferta ${index + 1}`}
              width={1280}
              height={720}
              className="w-full h-auto object-contain bg-white"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Botones */}
      <button
        onClick={() => slider.current?.prev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-black rounded-full p-2 hover:bg-white"
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={() => slider.current?.next()}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-black rounded-full p-2 hover:bg-white"
        aria-label="Siguiente"
      >
        ›
      </button>
    </section>
  );
}
