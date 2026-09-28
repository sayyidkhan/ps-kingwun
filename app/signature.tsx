import type { CSSProperties } from "react";

// Original pen trajectories, in writing order. Each path follows the centre of
// a letter so dash animation traces the ink, rather than revealing a text box.
const strokes = [
  { letter: "K stem", d: "M16 83 C-2 51 39 46 62 55 C79 63 63 89 43 111 C37 119 31 123 35 111 L91 23 C100 10 109 13 99 28 C83 50 66 70 55 90", start: 4, end: 13 },
  { letter: "K arm", d: "M119 29 C103 39 73 68 55 83 C70 70 78 79 82 96 C87 119 100 116 112 99", start: 13, end: 20 },
  { letter: "h", d: "M109 101 C121 75 146 35 144 26 C141 13 128 36 122 52 L101 112 C115 84 126 74 133 79 C141 86 119 109 130 111 C138 113 146 101 151 94", start: 20, end: 27 },
  { letter: "i", d: "M153 80 C149 90 139 110 147 111 C154 113 164 98 168 90", start: 27, end: 31 },
  { letter: "n", d: "M173 79 L160 112 C174 85 186 72 192 80 C197 87 176 109 185 111 C197 114 211 99 221 89", start: 31, end: 37 },
  { letter: "W", d: "M237 64 C219 43 237 28 259 32 C280 36 266 63 253 92 C248 104 245 118 252 112 C270 95 292 52 300 34 C291 65 276 114 286 112 C302 107 331 57 338 28 C341 16 334 13 330 26 C324 44 336 54 348 48", start: 37, end: 49 },
  { letter: "first o", d: "M347 82 C331 73 314 103 325 111 C336 119 353 91 347 82 C341 74 337 89 348 93 C356 96 362 90 366 85", start: 49, end: 54 },
  { letter: "second o", d: "M379 82 C363 73 346 103 357 111 C368 119 385 91 379 82 C373 74 369 89 380 93 C388 96 394 90 398 85", start: 54, end: 59 },
  { letter: "final n", d: "M403 80 L391 112 C405 85 418 72 424 80 C430 88 407 110 418 111 C433 114 450 96 466 81", start: 59, end: 65 },
  { letter: "i dot", d: "M158 64 L160 61", start: 65, end: 67 },
  { letter: "flourish", d: "M469 82 C499 55 508 61 491 79 C448 121 193 150 79 139 C56 137 58 132 83 131 C204 126 334 129 446 119", start: 67, end: 78 },
];

// Preserve the existing pen speed while extending the completed-signature hold.
const originalTimelineSeconds = 6.8;
const holdSeconds = 4;
const cycleSeconds = originalTimelineSeconds * strokes[strokes.length - 1].end / 100 + holdSeconds;
const timingScale = originalTimelineSeconds / cycleSeconds;

export default function Signature() {
  return <div className="signature-lockup">
    <div className="signature-title">
    <span className="sr-only">Khin Woon</span>
    <svg className="signature-mark" viewBox="-10 0 540 180" aria-hidden="true" focusable="false" style={{ "--signature-cycle": `${cycleSeconds}s` } as CSSProperties}>
      <g transform="translate(5 16) rotate(-3 250 80)">
        {strokes.map(stroke => <path
          key={stroke.letter}
          className={stroke.letter === "flourish" ? "signature-stroke signature-flourish" : "signature-stroke"}
          d={stroke.d}
          pathLength="1"
          style={{ "--stroke-start": `${stroke.start * timingScale}%`, "--stroke-end": `${stroke.end * timingScale}%` } as CSSProperties}
        />)}
      </g>
    </svg>
    </div>
  </div>;
}
