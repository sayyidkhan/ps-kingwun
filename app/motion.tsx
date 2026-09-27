"use client";

import { useEffect, useState } from "react";

export default function Motion() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const stopped = paused || reduced;
    document.documentElement.dataset.motion = stopped ? "off" : "on";
    if (stopped) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const animation = entry.target.animate(
          [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 700, easing: "cubic-bezier(.2,.7,.2,1)" }
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(element => observer.observe(element));
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      delete document.documentElement.dataset.motion;
    };
  }, [paused, reduced]);

  return <button
    type="button"
    className="motion-toggle"
    aria-pressed={paused || reduced}
    aria-label={paused || reduced ? "Enable page motion" : "Pause page motion"}
    onClick={() => { if (!reduced) setPaused(value => !value); }}
    disabled={reduced}
    title={reduced ? "Reduced motion follows your device preference" : undefined}
  ><span aria-hidden="true">{paused || reduced ? "▷" : "Ⅱ"}</span>{reduced ? "Reduced motion" : paused ? "Motion paused" : "Pause motion"}</button>;
}
