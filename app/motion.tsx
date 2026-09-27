"use client";

import { useEffect, useState } from "react";

export default function Motion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const stopped = reduced;
    document.documentElement.dataset.motion = stopped ? "off" : "on";
    if (stopped) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const photographic = entry.target.matches("figure");
        const animation = entry.target.animate(
          photographic
            ? [{ opacity: .3, clipPath: "inset(8% 3% 8% 3%)", transform: "translateY(32px)" }, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", transform: "translateY(0)" }]
            : [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: photographic ? 1100 : 700, easing: "cubic-bezier(.2,.7,.2,1)" }
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(element => observer.observe(element));
    const hero = document.querySelector<HTMLElement>(".hero-image");
    let frame = 0;
    const paintScroll = () => {
      frame = 0;
      if (hero) hero.style.translate = window.innerWidth > 600 ? `0 ${Math.min(window.scrollY * .16, 130)}px` : "";
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(paintScroll); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    paintScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      if (hero) hero.style.translate = "";
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      delete document.documentElement.dataset.motion;
    };
  }, [reduced]);

  return null;
}
