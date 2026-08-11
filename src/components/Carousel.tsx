"use client";

import { useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

const images = [
  "/ofertas/oferta5.png",
  "/ofertas/oferta3.png",
];

export default function Carousel() {
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const restartAutoplay = (slider: { next: () => void }) => {
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

  useEffect(() => {
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

  return (
    <section
      className="relative mb-4 w-full overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]"
      aria-label="Carrusel de ofertas"
      role="region"
    >
      <div ref={sliderRef} className="keen-slider w-full">
        {images.map((src, index) => (
          <div className="keen-slider__slide" key={index}>
            <div className="relative aspect-video w-full">
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

      <button
        type="button"
        onClick={() => {
          slider.current?.prev();
          if (slider.current) restartAutoplay(slider.current);
        }}
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-brand/90 p-2 text-white transition hover:bg-brand-dark sm:left-4"
        aria-label="Anterior"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={() => {
          slider.current?.next();
          if (slider.current) restartAutoplay(slider.current);
        }}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-brand/90 p-2 text-white transition hover:bg-brand-dark sm:right-4"
        aria-label="Siguiente"
      >
        ›
      </button>
    </section>
  );
}
