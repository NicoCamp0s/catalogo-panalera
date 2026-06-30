"use client";

import { useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

const images = [
  "/ofertas/oferta5.png",
  // "/ofertas/oferta2.png",
  "/ofertas/oferta3.png",
];

export default function Carousel() {
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Reinicia el temporizador
  const restartAutoplay = (slider: any) => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    autoplayRef.current = setInterval(() => {
      slider.next();
    }, 10000);
  };

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 10,
    },
    created(instance) {
      restartAutoplay(instance);
    },
  });

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

  return (
    <section
      className="relative w-full mb-4 overflow-hidden shadow-md"
      aria-label="Carrusel de ofertas"
      role="region"
    >
      <div ref={sliderRef} className="keen-slider w-full">
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

      {/* Botón anterior */}
      <button
        onClick={() => {
          slider.current?.prev();
          if (slider.current) restartAutoplay(slider.current);
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 text-black hover:bg-white"
        aria-label="Anterior"
      >
        ‹
      </button>

      {/* Botón siguiente */}
      <button
        onClick={() => {
          slider.current?.next();
          if (slider.current) restartAutoplay(slider.current);
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 text-black hover:bg-white"
        aria-label="Siguiente"
      >
        ›
      </button>
    </section>
  );
}