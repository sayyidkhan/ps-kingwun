import type { CSSProperties } from "react";

// Original signature-style lettering for the brand, not a reproduction of a legal signature.
const strokes = [
  { d: "M12 100 C35 100 65 50 77 24 C87 3 99 13 88 35 C75 59 55 95 48 112", delay: .3, duration: .7 },
  { d: "M124 19 C101 41 76 63 57 74 C75 64 83 80 91 94 C98 108 108 112 121 100", delay: .9, duration: .65 },
  { d: "M119 68 C115 79 109 95 115 98 C122 103 135 82 139 71 L130 99 C139 79 149 64 156 69 C163 75 144 99 155 98 C163 98 169 87 174 79", delay: 1.2, duration: .65 },
  { d: "M197 72 C183 59 164 89 174 98 C182 105 194 84 199 70 C194 90 188 120 176 133 C163 147 152 137 165 125 C175 116 198 110 215 91", delay: 1.8, duration: .65 },
  { d: "M243 48 C255 24 269 22 264 45 C260 65 244 111 251 106 C266 91 282 61 290 44 C283 65 270 109 281 104 C304 91 319 49 319 28 C319 16 311 26 312 40 C313 55 325 61 336 53", delay: 2.4, duration: .8 },
  { d: "M329 72 C322 86 314 106 326 99 C335 94 342 81 347 70 C343 82 334 101 343 99 C353 96 362 80 367 69 L357 99 C369 77 379 63 385 69 C391 76 372 99 383 99 C396 99 408 85 418 76", delay: 3.1, duration: .65 },
  { d: "M121 51 L123 48", delay: 3.7, duration: .12 },
  { d: "M419 76 C449 49 463 52 445 73 C416 107 226 129 96 130 C70 130 65 138 96 139 C210 142 346 112 433 119", delay: 3.85, duration: 1.15 },
];

export default function Signature() {
  return <div className="signature-lockup">
    <div className="signature-title">
    <span className="sr-only">King Wun</span>
    <svg className="signature-mark" viewBox="0 -12 480 185" fill="none" aria-hidden="true" focusable="false">
      <g transform="translate(0 20) rotate(-4 235 78) skewX(-5)">
      {strokes.map((stroke, i) => <path className={i === strokes.length - 1 ? "signature-flourish" : "signature-ink"} key={i} d={stroke.d} pathLength="1" style={{ "--ink-delay": `${stroke.delay}s`, "--ink-duration": `${stroke.duration}s` } as CSSProperties} />)}
      {/* Pressure accents on downstrokes give the lettering a pen-drawn contrast. */}
      <path className="signature-pressure" d="M83 44 C70 67 55 95 49 111" pathLength="1" style={{ "--ink-delay": ".65s", "--ink-duration": ".35s" } as CSSProperties} />
      <path className="signature-pressure" d="M72 73 C82 79 85 91 94 101" pathLength="1" style={{ "--ink-delay": "1.2s", "--ink-duration": ".35s" } as CSSProperties} />
      <path className="signature-pressure" d="M119 70 L112 89 M139 72 L131 96 M198 74 C193 94 187 116 178 130" pathLength="1" style={{ "--ink-delay": "1.5s", "--ink-duration": ".85s" } as CSSProperties} />
      <path className="signature-pressure" d="M263 46 C257 66 247 97 251 104 M288 49 C281 72 275 95 280 103" pathLength="1" style={{ "--ink-delay": "2.65s", "--ink-duration": ".55s" } as CSSProperties} />
      <path className="signature-pressure" d="M329 74 C323 87 320 96 324 99 M345 75 L339 93 M366 72 L359 95" pathLength="1" style={{ "--ink-delay": "3.3s", "--ink-duration": ".45s" } as CSSProperties} />
      </g>
    </svg>
    </div>
  </div>;
}
