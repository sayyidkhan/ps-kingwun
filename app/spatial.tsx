"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import courtyard from "@/assets/architectural-courtyard-v1.png";

type View = "exterior" | "plan" | "layers" | "level1" | "level2" | "explode" | "inside";
type Housing = "bungalow" | "semi-d" | "double-storey" | "apartment";
const housingTypes = [
  { id: "bungalow" as const, label: "Bungalow", detail: "Two-bedroom concept · front porch → living / dining → bedrooms, kitchen and bathroom" },
  { id: "semi-d" as const, label: "Semi-D", detail: "Two independent compact homes · separate front doors, living / dining, bedroom, kitchen and bathroom" },
  { id: "double-storey" as const, label: "Double-storey", detail: "Enter through the timber door under the front canopy. Living, kitchen and bathroom below; bedrooms above." },
  { id: "apartment" as const, label: "Apartment", detail: "Enter from the shared landing on the right · two bedrooms, bathroom, open kitchen / living and front balcony" },
];
type SceneAPI = { housing: (housing: Housing) => void; view: (view: View) => void; light: (dark: boolean) => void; rotate: (amount: number) => void; tilt: (amount: number) => void; zoom: (factor: number) => void; reset: () => void; tourStep: (delta: number) => void; tourPlay: () => void };

export default function Spatial() {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<SceneAPI | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<View>("exterior");
  const [dusk, setDusk] = useState(false);
  const [housing, setHousing] = useState<Housing>("bungalow");
  const [tourRoom, setTourRoom] = useState("");
  const [tourPlaying, setTourPlaying] = useState(true);
  const [tourTravelling, setTourTravelling] = useState(false);
  const [tourProgress, setTourProgress] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let started = false;
    let cleanup = () => {};
    const visibility = new IntersectionObserver(async entries => {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      try {
        const T = await import("three");
        if (disposed) return;
        const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = T.PCFSoftShadowMap;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.4;
        renderer.domElement.setAttribute("aria-label", "Interactive 3D bungalow concept. Use the view and rotation buttons to explore.");
        renderer.domElement.setAttribute("role", "img");
        renderer.domElement.tabIndex = 0;
        element.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(36, 1, .1, 100);
        const model = new T.Group();
        scene.add(model);
        const mats: InstanceType<typeof T.MeshStandardMaterial>[] = [];
        const material = (color: number, options = {}) => {
          const mat = new T.MeshStandardMaterial({ color, roughness: .72, ...options });
          mats.push(mat);
          return mat;
        };
        const stone = material(0xcbbf9e);
        const pale = material(0xe6dfcd);
        const wood = material(0x755239);
        const metal = material(0x222d2a, { metalness: .5, roughness: .35 });
        const glass = material(0x819e92, { transparent: true, opacity: .32, metalness: .35, roughness: .1, depthWrite: false });
        const foliage = material(0x567454);
        const upholstery = material(0xc3b49b);
        const linen = material(0xf3eee5);
        const rug = material(0x8a9b91);
        const wetFloor = material(0x9cafad);
        const brass = material(0xb89558, { metalness: .45 });
        const roof = new T.Group();
        model.add(roof);
        const cube = (w: number, h: number, d: number, x: number, y: number, z: number, mat = stone, parent = model) => {
          const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), mat);
          mesh.position.set(x, y, z);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          parent.add(mesh);
          return mesh;
        };
        const tiles = material(0x755547);
        const glazing = material(0x48616a, { metalness: .3, roughness: .2 });
        const renderHouseRoof = (w: number, d: number, eave: number, rise: number, x: number, z: number, parent: InstanceType<typeof T.Group>, turn = 0) => {
          const assembly = new T.Group();
          assembly.position.set(x, 0, z); assembly.rotation.y = turn; parent.add(assembly);
          const slope = Math.hypot(d / 2, rise), pitch = Math.atan2(rise, d / 2);
          for (const side of [-1, 1]) {
            const plane = new T.Group();
            plane.position.set(0, eave + rise / 2, side * d / 4);
            plane.rotation.x = side * pitch; assembly.add(plane);
            cube(w, .13, slope, 0, 0, 0, tiles, plane);
            // Raised tile courses and vertical seams catch the daylight.
            for (let i = 1; i < 9; i++) cube(w, .022, .025, 0, .077, -slope / 2 + i * slope / 9, wood, plane);
            for (let i = 0; i <= Math.floor(w / .28); i++) cube(.014, .018, slope, -w / 2 + i * .28, .076, 0, tiles, plane);
            cube(w + .05, .13, .09, 0, eave - .03, side * d / 2, pale, assembly);
          }
          cube(w + .1, .14, .14, 0, eave + rise + .03, 0, tiles, assembly);
          for (const side of [-1, 1]) {
            const shape = new T.BufferGeometry();
            shape.setAttribute("position", new T.Float32BufferAttribute([side * (w / 2 - .22), eave, -d / 2 + .2, side * (w / 2 - .22), eave + rise - .12, 0, side * (w / 2 - .22), eave, d / 2 - .2], 3));
            shape.computeVertexNormals();
            const gableMaterial = material(0xe6dfcd, { side: T.DoubleSide });
            const gable = new T.Mesh(shape, gableMaterial); gable.castShadow = true; assembly.add(gable);
          }
        };
        const windowFrame = (x: number, y: number, z: number, w: number, h: number, parent: InstanceType<typeof T.Group>, turn = 0) => {
          const frame = new T.Group(); frame.position.set(x, y, z); frame.rotation.y = turn; parent.add(frame);
          cube(w, h, .06, 0, 0, 0, glazing, frame);
          for (const side of [-1, 1]) {
            cube(.07, h + .12, .13, side * w / 2, 0, .025, pale, frame);
            cube(w + .14, .07, .13, 0, side * h / 2, .025, pale, frame);
          }
          cube(.045, h, .09, 0, 0, .045, metal, frame);
          cube(w, .045, .09, 0, 0, .045, metal, frame);
          cube(w + .22, .08, .26, 0, -h / 2 - .05, .065, pale, frame);
        };
        const fence = (x: number, z: number, w: number, parent: InstanceType<typeof T.Group>) => {
          cube(w, .18, .16, x, .23, z, stone, parent);
          for (const side of [-1, 1]) cube(.2, .9, .2, x + side * w / 2, .6, z, pale, parent);
          for (let i = 0; i < Math.floor(w / .18); i++) cube(.035, .65, .035, x - w / 2 + .12 + i * .18, .62, z, metal, parent);
          cube(w, .05, .05, x, .96, z, metal, parent);
        };
        // Interior pieces are grouped in local coordinates so every home uses
        // recognisable furniture at a consistent scale, rather than solid blocks.
        const placed = (x: number, y: number, z: number, parent: InstanceType<typeof T.Group>, turn = 0) => {
          const group = new T.Group(); group.position.set(x, y, z); group.rotation.y = turn; parent.add(group); return group;
        };
        const bed = (x: number, z: number, parent: InstanceType<typeof T.Group>, y = .36, width = 1.35) => {
          const g = placed(x, y, z, parent);
          cube(width, .22, 1.7, 0, .13, 0, wood, g);
          cube(width + .06, .7, .1, 0, .4, -.87, wood, g);
          cube(width - .05, .18, 1.64, 0, .33, 0, linen, g);
          cube(width - .03, .045, .9, 0, .44, .32, rug, g);
          for (const side of [-1, 1]) cube(width * .36, .12, .36, side * width * .23, .47, -.53, linen, g);
          cube(.4, .42, .4, width / 2 + .27, .21, -.6, wood, g);
        };
        const sofa = (x: number, z: number, parent: InstanceType<typeof T.Group>, width = 1.8, y = .36, turn = 0) => {
          const g = placed(x, y, z, parent, turn);
          cube(width, .18, .7, 0, .18, 0, wood, g);
          cube(width, .58, .14, 0, .46, -.32, upholstery, g);
          for (const side of [-1, 1]) {
            cube(.14, .42, .72, side * (width / 2 - .07), .37, 0, upholstery, g);
            cube(width / 2 - .19, .17, .52, side * width / 4, .35, .04, linen, g);
            cube(.3, .3, .12, side * width * .28, .6, -.2, rug, g);
          }
          cube(width + .2, .025, 1.45, 0, .018, .65, rug, g);
          cube(width * .6, .08, .5, 0, .34, .85, wood, g);
          for (const side of [-1, 1]) cube(.055, .28, .36, side * width * .23, .17, .85, metal, g);
        };
        const dining = (x: number, z: number, parent: InstanceType<typeof T.Group>, y = .36) => {
          const g = placed(x, y, z, parent);
          cube(.95, .08, .65, 0, .65, 0, wood, g);
          for (const sx of [-1, 1]) for (const sz of [-1, 1]) cube(.055, .62, .055, sx * .37, .32, sz * .23, metal, g);
          for (const side of [-1, 1]) {
            cube(.4, .09, .4, 0, .36, side * .6, upholstery, g);
            cube(.4, .55, .07, 0, .48, side * .78, wood, g);
            for (const sx of [-1, 1]) cube(.055, .34, .32, sx * .15, .17, side * .6, wood, g);
          }
        };
        const kitchen = (x: number, z: number, parent: InstanceType<typeof T.Group>, y = .36, turn = 0) => {
          const g = placed(x, y, z, parent, turn);
          cube(1.8, .75, .5, 0, .375, 0, wood, g);
          cube(1.86, .07, .56, 0, .785, 0, linen, g);
          cube(.5, .015, .35, -.48, .83, 0, metal, g);
          cube(.35, .02, .27, -.48, .84, 0, wetFloor, g);
          cube(.04, .2, .04, -.48, .92, -.15, metal, g);
          cube(.48, .02, .4, .48, .83, 0, metal, g);
          for (const dx of [-.12, .12]) for (const dz of [-.1, .1]) cube(.1, .01, .1, .48 + dx, .85, dz, stone, g);
          for (const dx of [-.6, 0, .6]) cube(.2, .03, .025, dx, .62, .258, brass, g);
        };
        const bathroom = (x: number, z: number, parent: InstanceType<typeof T.Group>, y = .36, width = 1.5, depth = 1.9) => {
          const g = placed(x, y, z, parent);
          cube(width, .025, depth, 0, .02, 0, wetFloor, g);
          cube(.65, .08, .7, -width / 2 + .38, .075, -depth / 2 + .4, linen, g);
          cube(.04, 1.3, .7, -width / 2 + .73, .7, -depth / 2 + .4, glass, g);
          cube(.04, 1.3, .04, -width / 2 + .12, .7, -depth / 2 + .12, metal, g);
          cube(.23, .04, .2, -width / 2 + .2, 1.36, -depth / 2 + .2, metal, g);
          cube(.38, .35, .5, width / 2 - .3, .2, -depth / 2 + .55, linen, g);
          cube(.38, .55, .13, width / 2 - .3, .3, -depth / 2 + .22, linen, g);
          cube(.2, .015, .28, width / 2 - .3, .385, -depth / 2 + .55, wetFloor, g);
          cube(.36, .6, .55, -width / 2 + .22, .3, depth / 2 - .4, wood, g);
          cube(.4, .09, .58, -width / 2 + .22, .64, depth / 2 - .4, linen, g);
          cube(.22, .015, .3, -width / 2 + .22, .69, depth / 2 - .4, wetFloor, g);
        };
        const partitions: { mesh: InstanceType<typeof T.Mesh>; base: number; height: number }[] = [];
        const partition = (w: number, d: number, x: number, z: number, parent: InstanceType<typeof T.Group>, base = .36) => {
          const height = 2.1;
          const mesh = cube(w, height, d, x, base + height / 2, z, pale, parent);
          partitions.push({ mesh, base, height });
        };
        const entryDoors: InstanceType<typeof T.Object3D>[] = [];
        const door = (x: number, z: number, parent: InstanceType<typeof T.Group>, y = .36, turn = 0, width = .85) => {
          const g = placed(x, y, z, parent, turn);
          for (const side of [-1, 1]) cube(.07, 2.05, .16, side * (width / 2 + .035), 1.025, 0, wood, g);
          cube(width + .14, .08, .16, 0, 2.04, 0, wood, g);
          const leaf = placed(-width / 2, 0, 0, g, -.65);
          entryDoors.push(leaf);
          cube(width, 1.98, .065, width / 2, .99, 0, wood, leaf);
          cube(.055, .18, .1, width - .13, .95, .065, brass, leaf);
          cube(width + .15, .03, .32, 0, .015, .05, stone, g);
        };
        const labelTextures: InstanceType<typeof T.CanvasTexture>[] = [];
        const labelMaterials: InstanceType<typeof T.MeshBasicMaterial>[] = [];
        const planLabels: InstanceType<typeof T.Mesh>[] = [];
        const floorLabel = (text: string, x: number, z: number, parent: InstanceType<typeof T.Group>, y = .4, always = false, turn = 0) => {
          const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 96;
          const ctx = canvas.getContext("2d"); if (!ctx) return;
          ctx.fillStyle = "#26352f"; ctx.fillRect(0, 0, 512, 96);
          ctx.fillStyle = "#f6f5ee"; ctx.font = "500 38px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, 256, 49);
          const texture = new T.CanvasTexture(canvas); texture.colorSpace = T.SRGBColorSpace; labelTextures.push(texture);
          const mat = new T.MeshBasicMaterial({ map: texture, side: T.DoubleSide }); labelMaterials.push(mat);
          const mesh = new T.Mesh(new T.PlaneGeometry(1.35, .253), mat);
          mesh.rotation.set(-Math.PI / 2, 0, turn); mesh.position.set(x, y, z); parent.add(mesh);
          if (!always) { mesh.visible = false; planLabels.push(mesh); }
        };
        // Detached home: solid rendered walls, tiled pitched roof and a covered entrance.
        cube(10.6, .28, 8.2, 0, -.18, 0, metal);
        cube(10.2, .12, 7.8, 0, .04, 0, foliage);
        cube(7.4, .2, 4.6, 0, .26, -1, pale);
        cube(7.4, 2.4, .18, 0, 1.55, -3.3, pale);
        for (const side of [-1, 1]) {
          cube(.18, 2.4, 4.6, side * 3.7, 1.55, -1, pale);
          windowFrame(side * 3.81, 1.55, -1.4, 1.4, 1.1, model, side * Math.PI / 2);
          cube(2.8, .65, .18, side * 2.25, .68, 1.3, pale);
          cube(2.8, .5, .18, side * 2.25, 2.5, 1.3, pale);
          for (const offset of [-1.14, 1.14]) cube(.5, 1.3, .18, side * 2.25 + offset, 1.65, 1.3, pale);
          windowFrame(side * 2.25, 1.65, 1.36, 1.75, 1.25, model);
        }
        cube(1.8, .45, .18, 0, 2.52, 1.3, pale);
        for (const x of [-.67, .67]) cube(.3, 2, .18, x, 1.35, 1.3, pale);
        entryDoors.push(cube(1, 1.98, .14, 0, 1.35, 1.36, wood));
        entryDoors.push(cube(.06, .22, .08, .35, 1.3, 1.47, metal));
        cube(2.2, .2, 1.3, 0, .27, 1.95, stone);
        cube(1.8, .14, .4, 0, .16, 2.75, pale);
        for (const x of [-.96, .96]) cube(.13, 2.25, .13, x, 1.48, 2.44, pale);
        renderHouseRoof(8, 5.25, 2.82, 1.22, 0, -1, roof);
        renderHouseRoof(2, 2.5, 2.68, .5, 0, 1.85, roof, Math.PI / 2);
        cube(1.65, .06, 1.05, 0, .14, 3.3, stone);
        cube(2.15, .06, 2.5, 3.4, .14, 2.65, stone);
        for (const z of [2, 2.4, 2.8, 3.2]) cube(2.05, .012, .018, 3.4, .18, z, pale);
        fence(-2.65, 3.8, 3.7, model);
        fence(1.45, 3.8, 1.15, model);
        // Rear private rooms open onto the clear central circulation zone.
        for (const x of [-.85, .85]) partition(.12, 2.05, x, -2.18, model);
        partition(1.8, .12, -2.72, -1.1, model);
        partition(1.8, .12, 2.72, -1.1, model);
        partition(.38, .12, -.65, -1.1, model);
        partition(.38, .12, .65, -1.1, model);
        bed(-2.5, -2.25, model); bed(2.15, -2.25, model);
        bathroom(0, -2.2, model, .36, 1.55, 1.9);
        sofa(-2.35, -.55, model, 1.9);
        dining(1.65, .05, model);
        kitchen(3.3, -.1, model, .36, -Math.PI / 2);
        floorLabel("BEDROOM 1", -2.4, -1.22, model);
        floorLabel("BEDROOM 2", 2.4, -1.22, model);
        floorLabel("BATH", 0, -2.2, model, 1.1);
        floorLabel("LIVING", -2.35, .95, model);
        floorLabel("DINING", 1.65, .9, model);
        floorLabel("ENTRY ↑", 0, 2.4, model, .39, true);
        for (const x of [-4.4, 4.4]) for (let i = 0; i < 5; i++) {
          cube(.55, .35, .55, x, .3, -2.8 + i * .8, foliage);
        }
        const semi = new T.Group();
        const semiRoof = new T.Group();
        semi.add(semiRoof); semi.visible = false; scene.add(semi);
        const semiBox = (w: number, h: number, d: number, x: number, y: number, z: number, mat = stone) => cube(w, h, d, x, y, z, mat, semi);
        semiBox(10.6, .28, 8.2, 0, -.18, 0, metal);
        semiBox(10.2, .12, 7.8, 0, .04, 0, foliage);
        semiBox(7.8, .2, 4.6, 0, .26, -.9, pale);
        semiBox(.2, 2.4, 4.6, 0, 1.55, -.9, pale);
        semiBox(.12, .65, 2.6, 0, .46, 2.7, pale);
        for (const side of [-1, 1]) {
          const x = side * 1.95;
          semiBox(3.9, 2.4, .18, x, 1.55, -3.2, pale);
          semiBox(.18, 2.4, 4.6, side * 3.9, 1.55, -.9, pale);
          windowFrame(side * 4.01, 1.55, -1.2, 1.3, 1.1, semi, side * Math.PI / 2);
          semiBox(3.9, .45, .18, x, 2.53, 1.4, pale);
          semiBox(2, .65, .18, side * 2.6, .68, 1.4, pale);
          for (const offset of [-.9, .9]) semiBox(.2, 1.3, .18, side * 2.6 + offset, 1.65, 1.4, pale);
          windowFrame(side * 2.6, 1.65, 1.46, 1.5, 1.25, semi);
          semiBox(.45, 2, .18, side * .25, 1.35, 1.4, pale);
          semiBox(.3, 2, .18, side * 1.52, 1.35, 1.4, pale);
          entryDoors.push(semiBox(.9, 1.98, .14, side * .9, 1.35, 1.47, wood));
          entryDoors.push(semiBox(.06, .2, .08, side * .6, 1.3, 1.57, metal));
          renderHouseRoof(5.2, 4.05, 2.82, 1.2, x, -.9, semiRoof, Math.PI / 2);
          cube(3.6, .14, 1.25, x, 2.55, 2, tiles, semiRoof);
          for (const offset of [-1.55, 1.55]) semiBox(.12, 2.2, .12, x + offset, 1.38, 2.5, pale);
          semiBox(3.5, .16, 1.35, x, .22, 2.05, stone);
          semiBox(2.4, .06, 1.25, side * 1.35, .14, 3.35, stone);
          fence(side * 3.45, 3.8, 1.9, semi);
          // One-bedroom compact unit on each side; the party wall stays solid.
          partition(.12, 2, side * 1.6, -2.15, semi);
          partition(1.4, .12, side * 3.15, -1.1, semi);
          partition(.5, .12, side * .35, -1.1, semi);
          bed(side * 2.55, -2.25, semi, .36, 1.1);
          bathroom(side * .8, -2.15, semi, .36, 1.4, 1.85);
          sofa(side * 2.85, -.58, semi, 1.45);
          kitchen(side * .36, -.08, semi, .36, side * Math.PI / 2);
          // Dining perch leaves the route from the front door to both rooms open.
          cube(.7, .07, .45, side * 1.85, 1.02, .68, wood, semi);
          cube(.08, .64, .3, side * 1.85, .68, .68, metal, semi);
          cube(.35, .4, .35, side * 1.85, .57, .15, upholstery, semi);
          floorLabel("BEDROOM", side * 2.65, -1.25, semi);
          floorLabel("BATH", side * .8, -2.15, semi, 1.1);
          floorLabel("LIVING", side * 2.85, 1.03, semi);
          floorLabel("ENTRY ↑", side * .9, 2.3, semi, .32, true);
          for (let i = 0; i < 5; i++) semiBox(.55, .35, .55, side * 4.55, .3, -2.5 + i * .8, foliage);
        }
        const double = new T.Group();
        const upperFloor = new T.Group();
        const doubleRoof = new T.Group();
        double.add(upperFloor, doubleRoof);
        double.visible = false;
        double.scale.setScalar(.88);
        scene.add(double);
        const dBox = (w: number, h: number, d: number, x: number, y: number, z: number, mat = stone, parent = double) => cube(w, h, d, x, y, z, mat, parent);
        dBox(10.6, .28, 8.2, 0, -.18, 0, metal);
        dBox(10.2, .16, 7.8, 0, .04, 0, pale);
        dBox(7.2, .18, 4.8, 0, .25, -.8, pale);
        for (const [level, parent] of [[0, double], [2.5, upperFloor]] as const) {
          dBox(7.2, 2.25, .18, 0, 1.47 + level, -3.2, stone, parent);
          dBox(.18, 2.25, 4.8, -3.6, 1.47 + level, -.8, stone, parent);
          dBox(.18, 2.25, 4.8, 3.6, 1.47 + level, -.8, stone, parent);
          if (level === 0) {
            // The entrance is a real break in the glazing, not a door on a solid wall.
            dBox(4.05, 2, .05, -1.48, 1.4, 1.6, glass, parent);
            dBox(1.85, 2, .05, 2.63, 1.4, 1.6, glass, parent);
            for (const x of [-3, -2, -1, 0, 2, 3]) dBox(.065, 2.25, .08, x, 1.47, 1.62, metal, parent);
          } else {
            dBox(2.15, 2, .05, -2.43, 1.4 + level, 1.6, glass, parent);
            dBox(3.75, 2, .05, 1.63, 1.4 + level, 1.6, glass, parent);
            for (const x of [-3, -2, -1.35, -.25, 1, 2, 3]) dBox(.065, 2.25, .08, x, 1.47 + level, 1.62, metal, parent);
          }
        }
        // Floor slab leaves an opening over the stair flight.
        dBox(5.7, .18, 4.8, -.75, 2.8, -.8, pale, upperFloor);
        dBox(1.5, .18, 1.8, 2.85, 2.8, -2.3, pale, upperFloor);
        for (let i = 0; i < 12; i++) dBox(.95, .2, .25, 2.8, .43 + i * .205, 1.3 - i * .25, wood);
        partition(.12, 3.2, -.1, -1.5, upperFloor, 2.9);
        for (const x of [-1.8, 1.15]) {
          dBox(1.5, .3, 2, x, 3.08, -1.9, wood, upperFloor);
          dBox(1.45, .18, 1.95, x, 3.32, -1.9, upholstery, upperFloor);
          dBox(1.25, .12, .4, x, 3.47, -2.55, pale, upperFloor);
        }
        sofa(-2, .8, double, 2.2, .35, Math.PI);
        dining(-1.7, -1.25, double, .35);
        kitchen(-2.25, -2.8, double, .35);
        bathroom(.8, -2.2, double, .35, 1.5, 1.75);
        partition(.12, 1.9, -.04, -2.2, double, .35);
        partition(.12, 1.9, 1.65, -2.2, double, .35);
        partition(.55, .12, .2, -1.2, double, .35);
        door(1.12, 1.65, double, .35, 0, 1);
        dBox(1.9, .15, 1.1, 1.12, .25, 2.18, stone);
        dBox(1.6, .12, .45, 1.12, .14, 2.92, pale);
        dBox(1.9, .12, .9, 1.12, 2.52, 2, wood);
        dBox(1.45, .04, .95, 1.12, .15, 3.35, stone);
        floorLabel("ENTRY ↑", 1.12, 3.35, double, .18, true);
        floorLabel("LIVING", -2.1, .1, double, .4);
        floorLabel("KITCHEN / DINING", -1.7, -2.05, double, 1.15);
        floorLabel("BATH", .8, -2.2, double, 1.15);
        floorLabel("STAIRS ↑", 2.8, .1, double, 1.55);
        dBox(7.5, .16, 5.2, 0, 5.28, -.8, pale, doubleRoof);
        dBox(7.6, .05, 5.3, 0, 5.39, -.8, metal, doubleRoof);
        dBox(4.6, .16, 1.25, -.8, 2.8, 2.2, pale, upperFloor);
        dBox(4.6, .8, .055, -.8, 3.28, 2.8, glass, upperFloor);
        for (const x of [-3.05, -.8, 1.45]) dBox(.06, .9, .06, x, 3.32, 2.8, metal, upperFloor);
        dBox(4.6, .06, .06, -.8, 3.8, 2.8, metal, upperFloor);
        dBox(3.7, .08, 1.8, -2.1, .16, 2.9, foliage);
        dBox(1.65, .08, 2.1, 3.55, .16, 2.8, stone);
        // Keep both storeys independently movable, including the ground-level site.
        const groundFloor = new T.Group();
        for (const child of [...double.children]) {
          if (child !== upperFloor && child !== doubleRoof) groundFloor.add(child);
        }
        double.add(groundFloor);
        floorLabel("LEVEL 2 · BEDROOMS", -.9, .7, upperFloor, 2.91);

        const apartment = new T.Group();
        const ceiling = new T.Group();
        apartment.add(ceiling);
        apartment.visible = false;
        scene.add(apartment);
        const aBox = (w: number, h: number, d: number, x: number, y: number, z: number, mat = stone, parent = apartment) => cube(w, h, d, x, y, z, mat, parent);
        aBox(10.6, .32, 7.4, .7, -.16, 0, metal);
        aBox(8.8, .14, 7, 0, .08, 0, pale);
        aBox(8.8, 2.3, .18, 0, 1.3, -3.45);
        aBox(.18, 2.3, 5.6, -4.35, 1.3, -.65);
        // Right-hand shared landing and a clear 1m opening into the foyer.
        aBox(.18, 2.3, 3.6, 4.35, 1.3, -1.65);
        aBox(.18, 2.3, 1, 4.35, 1.3, 1.65);
        aBox(.18, .25, 1, 4.35, 2.32, .65);
        aBox(1.5, .14, 5.6, 5.2, .08, -.65, stone);
        door(4.35, .65, apartment, .15, -Math.PI / 2, 1);
        floorLabel("ENTRY ←", 5.35, .65, apartment, .16, true, Math.PI / 2);
        floorLabel("SHARED LANDING", 5.2, -1.6, apartment, .16, true, Math.PI / 2);
        // Two bedrooms and a bathroom have separate openings onto the living hall.
        partition(.14, 2.8, -1.25, -2, apartment, .15);
        partition(.14, 2.8, 1.8, -2, apartment, .15);
        partition(2, .14, -3.25, -.6, apartment, .15);
        partition(2.05, .14, -.15, -.6, apartment, .15);
        partition(1.5, .14, 3.55, -.6, apartment, .15);
        bed(-3.15, -2.15, apartment, .15, 1.45);
        bed(.05, -2.15, apartment, .15, 1.35);
        bathroom(3.05, -2, apartment, .15, 2.2, 2.6);
        sofa(-2.8, .03, apartment, 2.15, .15);
        dining(.1, .8, apartment, .15);
        kitchen(2.45, 1.75, apartment, .15, Math.PI);
        aBox(.5, .6, .45, 3.9, .45, -.2, wood);
        floorLabel("BEDROOM 1", -3, -1, apartment, .2);
        floorLabel("BEDROOM 2", .05, -1, apartment, .2);
        floorLabel("BATH", 3, -1.6, apartment, .9);
        floorLabel("LIVING", -2.8, 1.75, apartment, .2);
        floorLabel("KITCHEN / DINING", 1.5, .05, apartment, .2);
        aBox(4.5, 2, .035, -2, 1.25, 2.15, glass);
        aBox(2.7, 2, .035, 2.9, 1.25, 2.15, glass);
        for (const x of [-4, -3, -2, -1, .25, 1.55, 3, 4]) aBox(.05, 2.2, .05, x, 1.25, 2.15, metal);
        floorLabel("BALCONY", .8, 2.95, apartment, .16);
        // Balcony edge is deliberately exposed, unlike a freestanding house.
        aBox(8.6, .9, .05, 0, .66, 3.45, glass);
        aBox(8.7, .06, .06, 0, 1.15, 3.45, metal);
        for (const x of [-4.3, 0, 4.3]) aBox(.06, 1, .06, x, .65, 3.45, metal);
        aBox(1.5, .4, .5, -3.3, .4, 2.95, stone);
        aBox(1.4, .3, .45, -3.3, .75, 2.95, foliage);
        aBox(9, .16, 5.8, 0, 2.56, -.65, pale, ceiling);
        aBox(9, .05, 5.8, 0, 2.67, -.65, metal, ceiling);
        const models = { bungalow: model, "semi-d": semi, "double-storey": double, apartment };
        const roofs = [roof, semiRoof, doubleRoof, ceiling];
        let activeHousing: Housing = "bungalow";
        const hemisphere = new T.HemisphereLight(0xf6edda, 0x243b35, 3);
        scene.add(hemisphere);
        const sun = new T.DirectionalLight(0xffe4b6, 4);
        sun.position.set(-4, 9, 5);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1024, 1024);
        Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9 });
        sun.shadow.normalBias = .03;
        scene.add(sun);
        const interior = new T.PointLight(0xffad5d, 0, 10);
        interior.position.set(0, 1.5, -1.2);
        scene.add(interior);
        const grid = new T.GridHelper(24, 24, 0x576a5b, 0x33443a);
        grid.position.y = -.38;
        scene.add(grid);
        let activeView: View = "exterior";
        let angle = .55, targetAngle = .55, pitch = .53, targetPitch = .53;
        let distance = 18, targetDistance = 18;
        let upperX = 0, upperY = 0, groundY = 0, focusHeight = .3;
        let roofY = 0, targetRoof = 0, frame = 0, lastTime = 0;
        let visible = true, dragging = false, auto = true;
        const pointers = new Map<number, { x: number; y: number }>();
        let stopped = document.documentElement.dataset.motion === "off" || matchMedia("(prefers-reduced-motion: reduce)").matches;
        let dirty = true, framing = 1;
        type Stop = { name: string; p: [number, number, number]; look: [number, number, number] };
        const tours: Record<Housing, Stop[]> = {
          bungalow: [
            { name: "Living room", p: [0, 1.85, .65], look: [-2.35, 1, -.3] },
            { name: "Dining area", p: [.45, 1.85, .7], look: [1.65, .9, .05] },
            { name: "Kitchen", p: [2.6, 1.85, .75], look: [3.3, 1, -.1] },
            { name: "Bedroom 1", p: [-1.3, 1.85, -1.35], look: [-2.5, 1, -2.25] },
            { name: "Bedroom 2", p: [1.2, 1.85, -1.35], look: [2.15, 1, -2.25] },
            { name: "Bathroom", p: [0, 1.85, -1.3], look: [0, 1, -2.6] },
          ],
          "semi-d": [-1, 1].flatMap(side => [
            { name: `${side < 0 ? "Left" : "Right"} home · Living`, p: [side * 1, 1.85, .7] as [number, number, number], look: [side * 2.85, 1, -.3] as [number, number, number] },
            { name: `${side < 0 ? "Left" : "Right"} home · Kitchen`, p: [side * 1.35, 1.85, .3] as [number, number, number], look: [side * .36, 1, -.1] as [number, number, number] },
            { name: `${side < 0 ? "Left" : "Right"} home · Bedroom`, p: [side * 1.95, 1.85, -1.35] as [number, number, number], look: [side * 2.65, 1, -2.25] as [number, number, number] },
            { name: `${side < 0 ? "Left" : "Right"} home · Bathroom`, p: [side * .9, 1.85, -1.3] as [number, number, number], look: [side * .8, 1, -2.5] as [number, number, number] },
          ]),
          "double-storey": [
            { name: "Level 1 · Living", p: [1.1, 1.85, .8], look: [-2, 1, .3] },
            { name: "Level 1 · Kitchen & dining", p: [-.65, 1.85, -1], look: [-2, 1, -2.4] },
            { name: "Level 1 · Bathroom", p: [.9, 1.85, -1.4], look: [.8, 1, -2.5] },
            { name: "Level 2 · Landing", p: [2.8, 4.4, -2.1], look: [1, 3.6, -1.7] },
            { name: "Level 2 · Bedroom 1", p: [-.9, 4.4, .3], look: [-1.8, 3.5, -1.9] },
            { name: "Level 2 · Bedroom 2", p: [.8, 4.4, .3], look: [1.15, 3.5, -1.9] },
            { name: "Level 2 · Balcony", p: [-.8, 4.35, 2.2], look: [0, 3.5, 4] },
          ],
          apartment: [
            { name: "Entrance & dining", p: [3.65, 1.65, .65], look: [.1, .9, .8] },
            { name: "Living room", p: [-1.5, 1.65, 1.5], look: [-2.8, .8, .1] },
            { name: "Kitchen", p: [1.5, 1.65, .65], look: [2.45, .9, 1.75] },
            { name: "Bedroom 1", p: [-1.7, 1.65, -.95], look: [-3.15, .8, -2.15] },
            { name: "Bedroom 2", p: [1.3, 1.65, -.95], look: [.05, .8, -2.15] },
            { name: "Bathroom", p: [2.25, 1.65, -.95], look: [3.2, .9, -2.4] },
            { name: "Balcony", p: [.8, 1.65, 2.7], look: [-2.5, .6, 3] },
          ],
        };
        let tourIndex = 0, tourTime = 0, tourAuto = true, tourYaw = 0, tourPitch = 0, tourFov = 72;
        const tourPosition = new T.Vector3();
        type Point = [number, number, number];
        // Room-to-hall portals keep travel out of furniture and solid partitions.
        const portals: Record<Housing, Point[][]> = {
          bungalow: [[], [], [], [[-1.3,1.85,-.65]], [[1.2,1.85,-.65]], [[0,1.85,-.7]]],
          "semi-d": [[], [], [[-1.95,1.85,-.65]], [[-.9,1.85,-.65]], [], [], [[1.95,1.85,-.65]], [[.9,1.85,-.65]]],
          "double-storey": [[], [[-.65,1.85,-.6]], [[.9,1.85,-.8]], [[2.8,4.4,-1.8],[1.98,4.4,-1.8],[1.98,4.4,.65]], [[-.9,4.4,.65]], [[.8,4.4,.65]], [[-.8,4.35,1.2],[-.8,4.4,.65]]],
          apartment: [[], [[-1.3,1.65,-.15]], [], [[-1.7,1.65,-.3]], [[1.3,1.65,-.3]], [[2.25,1.65,-.3]], [[.85,1.65,1.6]]],
        };
        const hub = (index: number): Point => activeHousing === "bungalow" ? [0,1.85,.7] : activeHousing === "semi-d" ? [index < 4 ? -1.05 : 1.05,1.85,.85] : activeHousing === "apartment" ? [1.35,1.65,-.15] : index >= 3 ? [.5,4.4,.65] : [1.65,1.85,.7];
        const entry: Record<Housing, Point> = { bungalow:[0,1.85,3.25], "semi-d":[-.9,1.85,3.25], "double-storey":[1.12,1.85,3.25], apartment:[5.2,1.65,.65] };
        let tourMoving = false, travelTime = 0, travelDuration = 1, routeLength = 0, reportedProgress = -1;
        let route: InstanceType<typeof T.Vector3>[] = [];
        let routeDistances: number[] = [];
        let arrivalYaw = 0, arrivalPitch = 0;
        const routePoint = (distanceAlong: number) => {
          const distance = T.MathUtils.clamp(distanceAlong, 0, routeLength);
          let segment = 1;
          while (segment < routeDistances.length - 1 && routeDistances[segment] < distance) segment++;
          const length = routeDistances[segment] - routeDistances[segment - 1];
          return route[segment - 1].clone().lerp(route[segment], length > 0 ? (distance - routeDistances[segment - 1]) / length : 1);
        };
        const visitRoom = (index: number, enter = false) => {
          const stops = tours[activeHousing], previous = tourIndex;
          tourIndex = (index + stops.length) % stops.length; tourTime = 0;
          const stop = stops[tourIndex], scale = activeHousing === "double-storey" ? .88 : 1;
          const points: Point[] = [];
          if (!enter && route.length > 1 && travelTime < travelDuration) {
            const progress = travelTime / travelDuration;
            const travelled = progress * progress * (3 - 2 * progress) * routeLength;
            for (let i = 1; i < route.length; i++) {
              if (routeDistances[i] > travelled) points.push([route[i].x / scale, route[i].y / scale, route[i].z / scale]);
            }
          }
          if (enter) {
            tourPosition.set(...entry[activeHousing]).multiplyScalar(scale);
            points.push(activeHousing === "apartment" ? [3.65,1.65,.65] : activeHousing === "double-storey" ? [1.12,1.85,.8] : hub(0));
          } else {
            points.push(...portals[activeHousing][previous], hub(previous));
            if (activeHousing === "semi-d" && (previous < 4) !== (tourIndex < 4)) {
              const side = previous < 4 ? -1 : 1;
              points.push([side * .9,1.85,2.9],[side * .9,1.85,4.4],[-side * .9,1.85,4.4],[-side * .9,1.85,2.9]);
            }
            if (activeHousing === "double-storey" && (previous >= 3) !== (tourIndex >= 3)) {
              const stairRoute: Point[] = [[1.75,1.85,.9],[2.8,1.85,1.4],[2.8,4.4,-1.8],[1.98,4.4,-1.8],[1.98,4.4,.65]];
              points.push(...(previous < 3 ? stairRoute : [...stairRoute].reverse()));
            }
            points.push(hub(tourIndex), ...[...portals[activeHousing][tourIndex]].reverse());
          }
          points.push(stop.p);
          route = [tourPosition.clone(), ...points.map(point => new T.Vector3(...point).multiplyScalar(scale))];
          routeDistances = [0]; routeLength = 0;
          for (let i = 1; i < route.length; i++) { routeLength += route[i].distanceTo(route[i - 1]); routeDistances.push(routeLength); }
          travelTime = 0; travelDuration = T.MathUtils.clamp(routeLength / 1.1, 1.5, 12); tourMoving = true;
          reportedProgress = 0; setTourProgress(0); setTourTravelling(true);
          const direction = new T.Vector3(...stop.look).sub(new T.Vector3(...stop.p));
          arrivalYaw = Math.atan2(direction.x, direction.z);
          arrivalPitch = Math.atan2(direction.y, Math.hypot(direction.x, direction.z));
          if (enter) {
            const ahead = routePoint(Math.min(.5, routeLength)).sub(tourPosition);
            tourYaw = Math.atan2(ahead.x, ahead.z); tourPitch = -.08;
          }
          setTourRoom(`${tourIndex + 1} / ${stops.length} · ${stop.name}`); dirty = true;
        };
        const holdTour = () => { tourAuto = false; tourMoving = false; setTourPlaying(false); setTourTravelling(false); dirty = true; };
        const turn = (amount: number) => { if (activeView === "inside") { holdTour(); tourYaw += amount; } else targetAngle += amount; auto = false; dirty = true; };
        const tilt = (amount: number) => {
          if (activeView === "inside") { holdTour(); tourPitch = T.MathUtils.clamp(tourPitch + amount, -.9, .9); }
          else targetPitch = T.MathUtils.clamp(targetPitch + amount, .12, Math.PI / 2 - .01);
          auto = false; dirty = true;
        };
        const zoom = (factor: number) => { if (activeView === "inside") tourFov = T.MathUtils.clamp(tourFov * factor, 45, 90); else targetDistance = T.MathUtils.clamp(targetDistance * factor, 7, 28); auto = false; dirty = true; };
        const resetCamera = () => {
          if (activeView === "inside") { tourFov = 72; visitRoom(tourIndex); return; }
          targetAngle = activeView === "plan" ? 0 : .55;
          targetPitch = activeView === "plan" ? Math.PI / 2 - .01 : activeView !== "exterior" ? .85 : .53;
          targetDistance = activeView === "plan" ? 17 : activeView === "explode" ? 25 : activeView === "level2" ? 14 : activeView === "layers" ? 19.5 : 18;
          auto = activeView === "exterior"; dirty = true;
        };
        const render = (time: number) => {
          const dt = Math.min((time - lastTime) / 1000 || .016, .04);
          lastTime = time;
          if (visible && !document.hidden) {
            if (auto && !stopped && !dragging && activeView === "exterior") targetAngle += dt * .065;
            const speed = stopped ? 1 : 1 - Math.exp(-dt * 6);
            angle += (targetAngle - angle) * speed;
            pitch += (targetPitch - pitch) * speed;
            distance += (targetDistance - distance) * speed;
            roofY += (targetRoof - roofY) * speed;
            roofs.forEach(part => { part.position.y = roofY; part.position.z = -roofY * 2.5; part.visible = activeView !== "plan"; });
            const cutaway = activeView !== "exterior" && activeView !== "inside";
            partitions.forEach(({ mesh, base, height }) => {
              const h = cutaway ? .75 : height;
              mesh.scale.y = h / height; mesh.position.y = base + h / 2;
            });
            planLabels.forEach(label => { label.visible = cutaway; });
            const level1 = activeHousing === "double-storey" && activeView === "level1";
            const level2 = activeHousing === "double-storey" && activeView === "level2";
            const exploded = activeHousing === "double-storey" && activeView === "explode";
            upperX += ((level1 ? 14 : 0) - upperX) * speed;
            upperY += ((level1 ? 4 : level2 ? -2.5 : exploded ? 3.4 : 0) - upperY) * speed;
            groundY += ((level2 ? -8 : 0) - groundY) * speed;
            upperFloor.position.set(upperX, upperY, 0);
            groundFloor.position.y = groundY;
            upperFloor.visible = activeView !== "plan" && !(level1 && upperX > 13.8);
            groundFloor.visible = !(level2 && groundY < -7.8);
            const targetFocus = exploded ? 3.2 : activeHousing === "double-storey" && activeView === "exterior" ? 1.4 : .3;
            focusHeight += (targetFocus - focusHeight) * speed;
            const focusY = focusHeight;
            const radius = Math.cos(pitch) * distance * framing;
            camera.position.set(Math.sin(angle) * radius, focusY + Math.sin(pitch) * distance * framing, Math.cos(angle) * radius);
            camera.lookAt(0, focusY, 0);
            grid.visible = activeView !== "inside";
            entryDoors.forEach(door => { door.visible = activeView !== "inside"; });
            if (activeView === "inside") {
              if (tourMoving && !dragging) {
                travelTime = stopped ? travelDuration : Math.min(travelDuration, travelTime + dt);
                const progress = travelTime / travelDuration;
                const displayProgress = Math.floor(progress * 20) * 5;
                if (displayProgress !== reportedProgress) { reportedProgress = displayProgress; setTourProgress(displayProgress); }
                const eased = progress * progress * (3 - 2 * progress);
                tourPosition.copy(routePoint(eased * routeLength));
                const direction = routePoint(Math.min(routeLength, eased * routeLength + .65)).sub(tourPosition);
                const facing = progress > .88 ? arrivalYaw : Math.atan2(direction.x, direction.z);
                const deltaYaw = Math.atan2(Math.sin(facing - tourYaw), Math.cos(facing - tourYaw));
                tourYaw += deltaYaw * (stopped ? 1 : 1 - Math.exp(-dt * 3));
                tourPitch += ((progress > .88 ? arrivalPitch : -.1) - tourPitch) * (stopped ? 1 : 1 - Math.exp(-dt * 3));
                if (progress >= 1) { tourMoving = false; tourTime = 0; setTourTravelling(false); }
              } else if (tourAuto && !dragging && !stopped) {
                tourTime += dt;
                if (tourTime > 6) visitRoom(tourIndex + 1);
              }
              const scan = !tourMoving && tourAuto && !stopped ? Math.sin(tourTime / 6 * Math.PI * 2) * .28 : 0;
              camera.position.copy(tourPosition);
              camera.lookAt(tourPosition.x + Math.sin(tourYaw + scan) * Math.cos(tourPitch), tourPosition.y + Math.sin(tourPitch), tourPosition.z + Math.cos(tourYaw + scan) * Math.cos(tourPitch));
              camera.fov = tourFov;
              renderer.domElement.style.opacity = "1";
            } else { camera.fov = 36; renderer.domElement.style.opacity = "1"; }
            camera.updateProjectionMatrix();
            if (!stopped || dirty) { renderer.render(scene, camera); dirty = false; }
          }
          frame = requestAnimationFrame(render);
        };
        const resize = new ResizeObserver(() => {
          const { width, height } = element.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          framing = Math.max(1, 1.35 / camera.aspect);
          camera.updateProjectionMatrix();
          dirty = true;
        });
        resize.observe(element);
        const viewObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; dirty = true; });
        viewObserver.observe(element);
        const motionObserver = new MutationObserver(() => {
          stopped = document.documentElement.dataset.motion === "off";
          dirty = true;
        });
        motionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
        const down = (event: PointerEvent) => {
          if (activeView === "inside") holdTour();
          pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
          dragging = true; auto = false; renderer.domElement.focus({ preventScroll: true });
          renderer.domElement.setPointerCapture(event.pointerId);
        };
        const move = (event: PointerEvent) => {
          const previous = pointers.get(event.pointerId); if (!previous) return;
          const other = [...pointers.entries()].find(([id]) => id !== event.pointerId)?.[1];
          if (other) {
            const before = Math.hypot(previous.x - other.x, previous.y - other.y);
            const after = Math.hypot(event.clientX - other.x, event.clientY - other.y);
            if (before > 4 && after > 4) zoom(before / after);
          } else {
            turn(-(event.clientX - previous.x) * .009);
            tilt(-(event.clientY - previous.y) * .006);
          }
          pointers.set(event.pointerId, { x: event.clientX, y: event.clientY }); dirty = true;
        };
        const up = (event: PointerEvent) => { pointers.delete(event.pointerId); dragging = pointers.size > 0; };
        const wheel = (event: WheelEvent) => { event.preventDefault(); zoom(Math.exp(T.MathUtils.clamp(event.deltaY * (event.deltaMode === 1 ? 16 : 1), -200, 200) * .002)); };
        const keydown = (event: KeyboardEvent) => {
          if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "+", "=", "-", "Home"].includes(event.key)) return;
          event.preventDefault(); auto = false; dirty = true;
          if (event.key === "ArrowUp") tilt(.15);
          else if (event.key === "ArrowDown") tilt(-.15);
          else if (event.key === "ArrowLeft") turn(-.2);
          else if (event.key === "ArrowRight") turn(.2);
          else if (event.key === "Home") resetCamera();
          else zoom(event.key === "-" ? 1.15 : 1 / 1.15);
        };
        const lost = (event: Event) => { event.preventDefault(); visible = false; setFailed(true); setReady(false); };
        renderer.domElement.addEventListener("pointerdown", down);
        renderer.domElement.addEventListener("pointermove", move);
        renderer.domElement.addEventListener("pointerup", up);
        renderer.domElement.addEventListener("pointercancel", up);
        renderer.domElement.addEventListener("lostpointercapture", up);
        renderer.domElement.addEventListener("wheel", wheel, { passive: false });
        renderer.domElement.addEventListener("keydown", keydown);
        renderer.domElement.addEventListener("webglcontextlost", lost);
        api.current = {
          housing: next => {
            activeHousing = next;
            Object.entries(models).forEach(([type, group]) => { group.visible = type === next; });
            resetCamera();
            renderer.domElement.setAttribute("aria-label", `Interactive 3D ${housingTypes.find(type => type.id === next)?.label} concept. Use the view and rotation buttons to explore.`);
            dirty = true;
          },
          view: next => {
            activeView = next; targetRoof = next === "exterior" || next === "plan" || next === "inside" ? 0 : next === "explode" ? 6.2 : 2.8;
            if (next === "inside") { upperX = 0; upperY = 0; groundY = 0; roofY = 0; tourIndex = 0; tourFov = 72; tourAuto = !stopped; setTourPlaying(!stopped); visitRoom(0, true); }
            else { setTourTravelling(false); resetCamera(); }
          },
          light: dark => { hemisphere.intensity = dark ? 1 : 3; sun.intensity = dark ? .7 : 4; sun.color.setHex(dark ? 0xabc1ed : 0xffe4b6); interior.intensity = dark ? 35 : 0; dirty = true; },
          rotate: turn,
          tilt, zoom, reset: resetCamera,
          tourStep: delta => {
            if (tourMoving) return;
            pointers.clear(); dragging = false;
            holdTour(); visitRoom(tourIndex + delta);
          },
          tourPlay: () => { tourAuto = !tourAuto; setTourPlaying(tourAuto); if (tourAuto && travelTime < travelDuration) tourMoving = true; else if (!tourAuto) tourMoving = false; setTourTravelling(tourMoving); dirty = true; },
        };
        frame = requestAnimationFrame(render);
        setReady(true);
        cleanup = () => {
          cancelAnimationFrame(frame);
          resize.disconnect(); viewObserver.disconnect(); motionObserver.disconnect();
          renderer.domElement.removeEventListener("webglcontextlost", lost);
          renderer.domElement.removeEventListener("pointerdown", down);
          renderer.domElement.removeEventListener("pointermove", move);
          renderer.domElement.removeEventListener("pointerup", up);
          renderer.domElement.removeEventListener("pointercancel", up);
          renderer.domElement.removeEventListener("lostpointercapture", up);
          renderer.domElement.removeEventListener("wheel", wheel);
          renderer.domElement.removeEventListener("keydown", keydown);
          scene.traverse(object => { if (object instanceof T.Mesh || object instanceof T.LineSegments) object.geometry.dispose(); });
          mats.forEach(mat => mat.dispose());
          labelTextures.forEach(texture => texture.dispose());
          labelMaterials.forEach(mat => mat.dispose());
          if (Array.isArray(grid.material)) grid.material.forEach(mat => mat.dispose()); else grid.material.dispose();
          renderer.dispose(); renderer.domElement.remove(); api.current = null;
        };
      } catch { if (!disposed) setFailed(true); }
    }, { rootMargin: "250px" });
    visibility.observe(element);
    return () => { disposed = true; visibility.disconnect(); cleanup(); };
  }, []);

  const selectView = (next: View) => { setView(next); api.current?.view(next); };
  const selectHousing = (next: Housing) => { setHousing(next); api.current?.housing(next); setView("exterior"); api.current?.view("exterior"); };
  return <section className="spatial-section" id="spatial" aria-labelledby="spatial-title">
    <div className="wrap spatial-heading"><div><p className="eyebrow">THE PERSPECTIVE LAB / INTERACTIVE 3D</p><h2 id="spatial-title">Every angle.<br /><em>A new possibility.</em></h2></div><p>Step outside the photograph. Explore how space, structure, and light work together.</p></div>
    <div className="housing-selector wrap">
      <div className="housing-tabs" role="tablist" aria-label="Housing type">
        {housingTypes.map((type, index) => <button key={type.id} ref={element => { tabs.current[index] = element; }} type="button" role="tab" id={`housing-tab-${type.id}`} aria-controls="housing-panel" aria-selected={housing === type.id} tabIndex={housing === type.id ? 0 : -1} disabled={!ready} onClick={() => selectHousing(type.id)} onKeyDown={event => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === "Home" ? 0 : event.key === "End" ? housingTypes.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + housingTypes.length) % housingTypes.length;
          selectHousing(housingTypes[next].id); tabs.current[next]?.focus();
        }}><span aria-hidden="true">0{index + 1}</span>{type.label}</button>)}
      </div>
      <p aria-live="polite">{housingTypes.find(type => type.id === housing)?.detail}</p>
    </div>
    <div role="tabpanel" id="housing-panel" aria-labelledby={`housing-tab-${housing}`} tabIndex={0}>
    <div className="spatial-stage wrap" data-view={view}>
      <div className="spatial-canvas" ref={host}>
        {!ready && <Image src={courtyard} alt="Courtyard architecture preview" fill sizes="90vw" />}
      </div>
      <div className="model-label"><span>KW / {housingTypes.find(type => type.id === housing)?.label.toUpperCase()} STUDY</span><span>0{housingTypes.findIndex(type => type.id === housing) + 1} — {housing === "apartment" ? "UNIT CONCEPT" : "RESIDENCE CONCEPT"}</span></div>
      <div className="spatial-instruction" role="status">{failed ? "3D unavailable on this device. Architectural preview shown." : ready ? view === "inside" ? "Eye-level showroom · drag to look around · use Next room to explore" : "Drag to turn & look up/down · scroll or pinch to zoom" : "Preparing your perspective…"}</div>
    </div>
    <div className="showroom-toolbar wrap">
      {view === "inside" ? <>
        <div className="tour-status"><p aria-live="polite">{tourTravelling ? "Moving to " : "Viewing "}{tourRoom}</p>{tourTravelling && <progress aria-label="Travel to room" value={tourProgress} max={100} />}</div>
        <div><button type="button" disabled={tourTravelling} onClick={() => api.current?.tourStep(-1)}>Previous room</button><button type="button" disabled={tourTravelling} onClick={() => api.current?.tourStep(1)}>Next room →</button><button type="button" aria-pressed={tourPlaying} onClick={() => api.current?.tourPlay()}>{tourPlaying ? "Look around" : "Resume tour"}</button><button type="button" onClick={() => selectView("exterior")}>Exit showroom ↗</button></div>
      </> : <><p>See it from a different perspective.</p><button type="button" disabled={!ready} onClick={() => selectView("inside")}>Enter showroom <span aria-hidden="true">↗</span></button></>}
    </div>
    <div className="spatial-controls wrap">
      <div className="view-options" role="group" aria-label="Architectural view">{((housing === "double-storey" ? ["exterior", "level1", "level2", "explode"] : ["exterior", "plan", "layers"]) as View[]).map((option, i) => <button type="button" disabled={!ready} key={option} aria-pressed={view === option} onClick={() => selectView(option)}><span>0{i + 1}</span>{option === "level1" ? "Level 1" : option === "level2" ? "Level 2" : option === "explode" ? "Separate floors" : option === "exterior" ? housing === "apartment" ? "Unit view" : "Exterior" : option === "plan" ? "Floor plan" : housing === "apartment" ? "Lift the ceiling" : "Lift the roof"}</button>)}</div>
      <div className="scene-options" role="group" aria-label="Camera and lighting controls">
        <button type="button" disabled={!ready} aria-label="Rotate model left" title="Rotate left" onClick={() => api.current?.rotate(-.45)}>←</button>
        <button type="button" disabled={!ready} aria-label="Rotate model right" title="Rotate right" onClick={() => api.current?.rotate(.45)}>→</button>
        <button type="button" disabled={!ready} aria-label="Look down into rooms" title="Raise viewpoint" onClick={() => api.current?.tilt(.18)}>↑</button>
        <button type="button" disabled={!ready} aria-label="Lower viewpoint" title="Lower viewpoint" onClick={() => api.current?.tilt(-.18)}>↓</button>
        <button type="button" disabled={!ready} aria-label="Zoom in" title="Zoom in" onClick={() => api.current?.zoom(.82)}>+</button>
        <button type="button" disabled={!ready} aria-label="Zoom out" title="Zoom out" onClick={() => api.current?.zoom(1.22)}>−</button>
        <button type="button" disabled={!ready} aria-label="Reset camera" title="Reset camera" onClick={() => api.current?.reset()}>↺</button>
        <button type="button" disabled={!ready} aria-pressed={dusk} onClick={() => { setDusk(!dusk); api.current?.light(!dusk); }}>{dusk ? "Dusk" : "Daylight"} <span aria-hidden="true">◐</span></button>
      </div>
    </div>
    <p className="spatial-disclaimer wrap">An interactive architectural concept, not a property listing or construction plan.</p>
    </div>
  </section>;
}
