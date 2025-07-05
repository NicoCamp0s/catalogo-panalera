"use client";

import { useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

const images = [
  "/ofertas/oferta1.jpg",
  "/ofertas/oferta2.png",
  "/ofertas/oferta3.png",
];

export default function Carousel() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null); // <- Nuevo

  const [sliderInstanceRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 10,
    },
  });

  // Función para reiniciar autoplay
  const restartAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      slider.current?.next();
    }, 6000);
  };

  // Start autoplay en el mount
  useEffect(() => {
    if (slider.current) {
      restartAutoplay();
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [slider]);

  return (
  <section
    className="relative w-full mb-4 rounded-none overflow-hidden shadow-md"
    aria-label="Carrusel de ofertas"
    role="region"
  >
    <div
      ref={(ref) => {
        sliderRef.current = ref;
        sliderInstanceRef(ref);
      }}
      className="keen-slider w-full"
    >
      {images.map((src, index) => (
        <div className="keen-slider__slide" key={index}>
          <div className="relative w-full aspect-video">
            <Image
              src={src}
              alt={`Oferta ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        </div>
      ))}
    </div>

    {/* Botones */}
    <button
      onClick={() => {
        slider.current?.prev();
        restartAutoplay();
      }}
      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-black rounded-full p-2 hover:bg-white z-10"
      aria-label="Anterior"
    >
      ‹
    </button>
    <button
      onClick={() => {
        slider.current?.next();
        restartAutoplay();
      }}
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-black rounded-full p-2 hover:bg-white z-10"
      aria-label="Siguiente"
    >
      ›
    </button>
  </section>
  );
}
