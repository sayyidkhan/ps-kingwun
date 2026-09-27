"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import courtyard from "@/assets/architectural-courtyard-v1.png";
import apartment from "@/assets/apartment-living-v1.png";
import home from "@/assets/tropical-home-v1.png";

const slides = [
  { image: courtyard, title: "Space to slow down.", type: "THE COURTYARD", alt: "Illustrative tropical courtyard residence beside a reflecting pool" },
  { image: apartment, title: "Light changes everything.", type: "THE APARTMENT", alt: "Illustrative apartment living room opening onto a planted balcony" },
  { image: home, title: "Room for your next chapter.", type: "THE FAMILY HOME", alt: "Illustrative double-storey tropical home with landscaped garden and driveway" },
];

export default function PropertyGallery() {
  const [active, setActive] = useState(0);
  const host = useRef<HTMLElement>(null);
  const interacting = useRef(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: .15 });
    if (host.current) observer.observe(host.current);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden && !preference.matches && !interacting.current) setActive(value => (value + 1) % slides.length);
    }, 6500);
    return () => { clearInterval(timer); observer.disconnect(); };
  }, []);

  return <figure className="property-gallery" ref={host} aria-label="Architectural inspiration gallery" onMouseEnter={() => { interacting.current = true; }} onMouseLeave={() => { interacting.current = !!host.current?.contains(document.activeElement); }} onFocusCapture={() => { interacting.current = true; }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) interacting.current = false; }}>
    <div className="gallery-stage">
      {slides.map((slide, i) => <div className="gallery-slide" key={slide.type} data-active={active === i} aria-hidden={active !== i}>
        <Image src={slide.image} alt={slide.alt} fill sizes="(max-width:600px) 100vw, 90vw" />
      </div>)}
      <div className="gallery-overlay"><span className="eyebrow">{slides[active].type}</span><p>{slides[active].title}</p></div>
      <div className="gallery-arrows"><button type="button" aria-label="Previous property image" onClick={() => setActive(value => (value + slides.length - 1) % slides.length)}>←</button><button type="button" aria-label="Next property image" onClick={() => setActive(value => (value + 1) % slides.length)}>→</button></div>
    </div>
    <div className="gallery-thumbnails" role="group" aria-label="Choose property image">
      {slides.map((slide, i) => <button type="button" key={slide.type} aria-label={`Show ${slide.type.toLowerCase()}`} aria-pressed={active === i} onClick={() => setActive(i)}><Image src={slide.image} alt="" sizes="90px" /><span><small>0{i + 1}</small>{slide.type.replace("THE ", "")}</span></button>)}
    </div>
    <figcaption><span>0{active + 1} / 0{slides.length} · A DIFFERENT PERSPECTIVE</span><span>ARCHITECTURAL CONCEPTS · AI-GENERATED · NOT LISTINGS</span></figcaption>
  </figure>;
}
