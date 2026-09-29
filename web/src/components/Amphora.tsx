"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings, prefersReducedMotion } from "@/lib/settings";
import styles from "./Amphora.module.css";

/**
 * A neck-amphora turned on a lathe in WebGL, with its decoration painted procedurally in the
 * black-figure manner: black gloss on clay, with added red. It turns slowly and can be dragged.
 * On phones it also turns as the phone is tilted, where the phone allows it (an iPhone asks first).
 * three.js is loaded only when this component mounts, so other pages never download it.
 */
export default function Amphora() {
  const stageRef = useRef<HTMLDivElement>(null);
  const motion = useSettings((s) => s.motion);
  const reduceRef = useRef(false);
  useEffect(() => { reduceRef.current = prefersReducedMotion(motion); }, [motion]);

  // tilting the phone left or right turns the vase that way (on top of its own slow turn)
  const tiltRef = useRef(0);
  const [tilt, setTilt] = useState<"off" | "ask" | "on">("off");
  const stopTilt = useRef<() => void>(() => {});
  const listenTilt = () => {
    const on = (e: DeviceOrientationEvent) => {
      if (e.gamma === null) return;
      tiltRef.current = Math.max(-1, Math.min(1, e.gamma / 40));
      setTilt((t) => (t === "on" ? t : "on"));
    };
    addEventListener("deviceorientation", on);
    stopTilt.current = () => removeEventListener("deviceorientation", on);
  };
  useEffect(() => {
    if (typeof DeviceOrientationEvent === "undefined" || !matchMedia("(pointer: coarse)").matches) return;
    const D = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof D.requestPermission === "function") setTilt("ask");
    else listenTilt();
    return () => stopTilt.current();
  }, []);
  const askTilt = () => {
    const D = DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> };
    D.requestPermission().then((r) => { if (r === "granted") listenTilt(); else setTilt("off"); }, () => setTilt("off"));
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const canvas = renderer.domElement;
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "A black-figure neck-amphora, slowly turning. Its panels read ΜΑΘΗΣΙΣ and ΣΤΟΙΧΕΙΩΝ.");
      canvas.className = styles.canvas;
      stage.prepend(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(0, 1.15, 6.4);
      camera.lookAt(0, 1.02, 0);

      // Profile of a neck-amphora: [radius, height], foot at y = 0.
      const prof: [number, number][] = [[0.001, 0], [0.34, 0], [0.35, 0.05], [0.27, 0.11], [0.21, 0.17], [0.26, 0.28], [0.42, 0.5],
        [0.56, 0.78], [0.63, 1.02], [0.62, 1.2], [0.53, 1.4], [0.38, 1.56], [0.25, 1.64], [0.21, 1.72], [0.21, 1.86], [0.24, 1.97],
        [0.31, 2.02], [0.32, 2.08], [0.27, 2.1], [0.22, 2.06], [0.2, 1.98]];
      const spline = new THREE.SplineCurve(prof.map(([x, y]) => new THREE.Vector2(x, y)));
      const pts = spline.getSpacedPoints(220);
      const geo = new THREE.LatheGeometry(pts, 160);

      // --- paint the decoration onto a texture wrapped around the lathe -----------------
      const TW = 2048, TH = 1024, N = pts.length - 1;
      const tex = document.createElement("canvas");
      tex.width = TW; tex.height = TH;
      const g = tex.getContext("2d")!;
      const vOf = (y: number) => { for (let i = 0; i < N; i++) if (pts[i + 1].y >= y) return i / N; return 1; };
      const rowOf = (y: number) => (1 - vOf(y)) * TH;
      const rAt = (y: number) => { for (let i = 0; i < N; i++) if (pts[i + 1].y >= y) return pts[i].x; return 0.3; };
      const L = pts.reduce((s, p, i) => (i ? s + p.distanceTo(pts[i - 1]) : 0), 0);
      // pixels-per-unit around the pot vs. along it, so shapes are not stretched
      const aspect = (y: number) => (TW / (2 * Math.PI * rAt(y))) / (TH / L);

      const CLAY = "#C8703A", GLOSS = "#15100c", RED = "#8e2a14";
      // next/font renames the family, so read the real name from its CSS variable
      const DIDOT = `${getComputedStyle(document.documentElement).getPropertyValue("--font-didot").trim() || '"GFS Didot"'}, serif`;
      const band = (y0: number, y1: number, c: string) => { g.fillStyle = c; g.fillRect(0, rowOf(y1), TW, rowOf(y0) - rowOf(y1)); };

      function paint() {
        g.fillStyle = CLAY; g.fillRect(0, 0, TW, TH);
        band(0, 0.17, GLOSS);
        { // rays rising from the foot
          const y0 = rowOf(0.2), y1 = rowOf(0.44), n = 36, w = TW / n; g.fillStyle = GLOSS;
          for (let i = 0; i < n; i++) { g.beginPath(); g.moveTo(i * w + 4, y0); g.lineTo(i * w + w / 2, y1); g.lineTo(i * w + w - 4, y0); g.fill(); }
        }
        band(0.17, 0.2, GLOSS); band(0.46, 0.48, GLOSS);
        { // meander
          const y0 = rowOf(0.64), y1 = rowOf(0.5), h = y0 - y1, cell = h * aspect(0.57), n = Math.round(TW / cell), cw = TW / n;
          g.strokeStyle = GLOSS; g.lineWidth = h * 0.1; g.lineCap = "square";
          for (let i = 0; i < n; i++) {
            const x = i * cw, u = cw / 20, v = h / 20;
            g.beginPath();
            g.moveTo(x, y1 + v); g.lineTo(x + cw, y1 + v); g.moveTo(x, y1 + 19 * v); g.lineTo(x + cw, y1 + 19 * v);
            g.moveTo(x + 3 * u, y1 + 19 * v); g.lineTo(x + 3 * u, y1 + 4 * v); g.lineTo(x + 16 * u, y1 + 4 * v); g.lineTo(x + 16 * u, y1 + 16 * v);
            g.lineTo(x + 7 * u, y1 + 16 * v); g.lineTo(x + 7 * u, y1 + 8 * v); g.lineTo(x + 12 * u, y1 + 8 * v); g.lineTo(x + 12 * u, y1 + 12 * v);
            g.stroke();
          }
        }
        band(0.66, 0.68, RED);
        band(0.68, 1.44, GLOSS);
        const panel = (u0: number, u1: number, text: string) => {
          const x0 = u0 * TW, x1 = u1 * TW, yT = rowOf(1.36), yB = rowOf(0.76);
          g.fillStyle = CLAY; g.fillRect(x0, yT, x1 - x0, yB - yT);
          const th = (yB - yT) * 0.12, tw = th * 0.8 * aspect(1.3), tn = Math.round((x1 - x0) / tw), tww = (x1 - x0) / tn;
          for (let i = 0; i < tn; i++) { // tongues along the top of the panel
            g.fillStyle = i % 2 ? RED : GLOSS; g.beginPath();
            g.moveTo(x0 + i * tww + 2, yT); g.lineTo(x0 + (i + 1) * tww - 2, yT); g.lineTo(x0 + (i + 1) * tww - 2, yT + th * 0.55);
            g.quadraticCurveTo(x0 + (i + 0.5) * tww, yT + th * 1.25, x0 + i * tww + 2, yT + th * 0.55); g.fill();
          }
          // painted inscription, like the names painted on real vases
          g.save();
          const a = aspect(1.06);
          g.translate((x0 + x1) / 2, yT + (yB - yT) * 0.6); g.scale(a, 1);
          let fs = (yB - yT) * 0.3;
          const font = (px: number) => `700 ${px}px ${DIDOT}`;
          g.font = font(fs);
          const maxW = ((x1 - x0) * 0.86) / a, mw = g.measureText(text).width;
          if (mw > maxW) { fs *= maxW / mw; g.font = font(fs); }
          g.fillStyle = GLOSS; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, 0, 0);
          g.fillStyle = RED;
          for (const dx of [-1, 1]) { g.beginPath(); g.arc(dx * (Math.min(mw, maxW) / 2 + fs * 0.35), 0, fs * 0.09, 0, 7); g.fill(); }
          g.restore();
          g.strokeStyle = GLOSS; g.lineWidth = 5; g.strokeRect(x0 + 10, yT + 4, x1 - x0 - 20, yB - yT - 8);
        };
        panel(0.13, 0.37, "ΜΑΘΗΣΙΣ");
        panel(0.63, 0.87, "ΣΤΟΙΧΕΙΩΝ");
        band(1.44, 1.46, RED);
        { // shoulder tongues
          const y1 = rowOf(1.62), y0 = rowOf(1.47), h = y0 - y1, tw = h * 0.55 * aspect(1.54), n = Math.round(TW / tw), w = TW / n;
          for (let i = 0; i < n; i++) {
            g.fillStyle = i % 3 === 1 ? RED : GLOSS; g.beginPath();
            g.moveTo(i * w + 3, y1); g.lineTo(i * w + w - 3, y1); g.lineTo(i * w + w - 3, y1 + h * 0.5);
            g.quadraticCurveTo(i * w + w / 2, y0 + h * 0.15, i * w + 3, y1 + h * 0.5); g.fill();
          }
        }
        band(1.62, 2.2, GLOSS);
        { // neck: a reserved band of dots
          const yc = (rowOf(1.74) + rowOf(1.84)) / 2, h = rowOf(1.74) - rowOf(1.84);
          g.fillStyle = CLAY; g.fillRect(0, yc - h / 2, TW, h);
          const n = 40, w = TW / n;
          for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? RED : GLOSS; g.beginPath(); g.ellipse(i * w + w / 2, yc, h * 0.28 * aspect(1.79), h * 0.28, 0, 0, 7); g.fill(); }
        }
        let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(255,230,200,${rnd() * 0.05})`; g.fillRect(rnd() * TW, rnd() * TH, 2, 2); }
      }

      const texture = new THREE.CanvasTexture(tex);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.42, metalness: 0.04, side: THREE.DoubleSide });
      const vase = new THREE.Group();
      vase.add(new THREE.Mesh(geo, mat));
      const hMat = new THREE.MeshStandardMaterial({ color: 0x15100c, roughness: 0.4 });
      const handles: InstanceType<typeof THREE.TubeGeometry>[] = [];
      for (const s of [1, -1]) {
        const c = new THREE.CatmullRomCurve3(([[0.2, 1.82], [0.42, 1.86], [0.58, 1.74], [0.57, 1.56], [0.47, 1.47]] as const).map(([x, y]) => new THREE.Vector3(s * x, y, 0)));
        const tg = new THREE.TubeGeometry(c, 48, 0.034, 12);
        handles.push(tg);
        vase.add(new THREE.Mesh(tg, hMat));
      }
      scene.add(vase);
      scene.add(new THREE.HemisphereLight(0xfff1e0, 0x3a2414, 2.2));
      const key = new THREE.DirectionalLight(0xfff0dc, 3.6); key.position.set(-3, 4, 5); scene.add(key);
      const rim = new THREE.DirectionalLight(0xffc89a, 2.4); rim.position.set(4, 2, -4); scene.add(rim);

      const resize = () => {
        const w = stage.clientWidth, h = stage.clientHeight;
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize); ro.observe(stage);

      const SPEED = 0.0045;
      let rot = -0.6, vel = reduceRef.current ? 0 : SPEED, rise = reduceRef.current ? 1 : 0, visible = true, raf = 0, tilted = 0;
      let drag: { x: number; rot: number } | null = null;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
      io.observe(stage);
      const down = (e: PointerEvent) => { drag = { x: e.clientX, rot }; canvas.setPointerCapture(e.pointerId); };
      const move = (e: PointerEvent) => { if (drag) { const nr = drag.rot + (e.clientX - drag.x) * 0.012; vel = (nr - rot) * 0.5; rot = nr; } };
      const up = () => { drag = null; };
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);

      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!visible) return;
        const reduce = reduceRef.current;
        if (!drag) { vel += ((reduce ? 0 : SPEED) - vel) * 0.02; rot += vel; }
        rise = reduce ? 1 : Math.min(1, rise + 0.012);
        const e = 1 - Math.pow(1 - rise, 3);
        tilted += (tiltRef.current * 0.9 - tilted) * 0.06;   // eased, so a shaky hand does not jolt it
        vase.rotation.y = rot + tilted; vase.position.y = -0.35 * (1 - e); vase.scale.setScalar(0.9 + 0.1 * e);
        renderer.render(scene, camera);
      };
      const start = () => { if (disposed) return; paint(); texture.needsUpdate = true; frame(); };
      document.fonts.load(`700 80px ${DIDOT}`, "ΜΑΘΗΣΙΣ").then(start, start);

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
        geo.dispose(); handles.forEach((h) => h.dispose()); mat.dispose(); hMat.dispose(); texture.dispose();
        renderer.dispose(); canvas.remove();
      };
    });

    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <figure className={styles.figure}>
      <div ref={stageRef} className={styles.stage}><div className={styles.shadow} aria-hidden="true" /></div>
      <figcaption className={styles.cap}>
        A neck-amphora in the black-figure style: black gloss painted on orange clay. Drag to turn it{tilt === "on" ? ", or tilt your phone" : ""}.
        {tilt === "ask" && <> <button type="button" className={styles.tiltBtn} onClick={askTilt}>Turn it by tilting the phone</button></>}
      </figcaption>
    </figure>
  );
}
