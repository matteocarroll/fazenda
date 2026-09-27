"use client";

/**
 * Fazenda — walking buffalo logo.
 * Renders the farmhouse + tree scene with the three buffalo walking in a slow loop beneath it.
 * Assets: /public/buffalo/scene.png and /public/buffalo/herd.png (sprite sheet).
 * Respects prefers-reduced-motion (shows the herd standing still) and pauses when off-screen.
 */
import { useEffect, useId, useRef, type CSSProperties } from "react";

type Piece = [number, number, number, number, number, number]; // x, y, w, h (local), sx, sy (sheet)
type Leg = { hx: number; hy: number; ky: number; L: number; d0: number; ph: number; fore: boolean; u: Piece; l: Piece };
type Buffalo = {
  name: string; x0: number; y: number; T: number; S: number;
  tail: { kind: string; at: number; p: Piece };
  head: { px: number; p: Piece };
  body: Piece;
  legs: Leg[];
};

const SHEET = "/buffalo/herd.png";
const SHEET_W = 1024;
const SHEET_H = 250;
const VIEW_W = 1101;
const VIEW_H = 563;
const BETA = 0.72; // share of each stride a hoof spends on the ground
const K = 0.45;
const START = -240;
const END = 1131;
const SPEED = 14.9573; // scene px per second
const HERD: Buffalo[] = [{"name":"rear","x0":337,"y":455.5,"T":2.6,"S":56,"tail":{"kind":"row","at":104,"p":[0,101,25,32,856,152]},"head":{"px":275,"p":[272,0,104,108,714,4]},"body":[1,0,284,135,312,4],"legs":[{"hx":51.5,"hy":119,"ky":153,"L":76.0,"d0":-33.96,"ph":0.72,"fore":false,"u":[20,116,58,37,532,152],"l":[9,150,35,46,190,152]},{"hx":92.0,"hy":119,"ky":150,"L":70.0,"d0":19.94,"ph":0.22,"fore":false,"u":[74,116,35,34,743,152],"l":[82,147,43,45,229,152]},{"hx":201.0,"hy":125,"ky":156,"L":69.0,"d0":-5.61,"ph":0.47,"fore":true,"u":[184,122,32,34,782,152],"l":[173,153,38,43,322,152]},{"hx":264.0,"hy":124,"ky":152,"L":64.0,"d0":35.79,"ph":0.97,"fore":true,"u":[250,121,41,31,947,152],"l":[271,149,41,42,403,152]}]},{"name":"baby","x0":592,"y":480.0,"T":1.6714,"S":36,"tail":{"kind":"col","at":35,"p":[0,33,38,25,101,215]},"head":{"px":166,"p":[163,0,79,59,4,152]},"body":[24,9,159,81,822,4],"legs":[{"hx":38.0,"hy":89,"ky":108,"L":44.0,"d0":-16.16,"ph":0.47,"fore":false,"u":[25,86,25,22,143,215],"l":[17,105,26,31,992,152]},{"hx":58.5,"hy":89,"ky":107,"L":40.0,"d0":4.79,"ph":0.97,"fore":false,"u":[50,86,26,21,172,215],"l":[51,104,24,28,35,215]},{"hx":125.0,"hy":82,"ky":106,"L":54.0,"d0":-37.32,"ph":0.72,"fore":true,"u":[103,79,34,27,63,215],"l":[80,103,47,36,594,152]},{"hx":146.5,"hy":82,"ky":110,"L":64.0,"d0":11.55,"ph":0.22,"fore":true,"u":[135,79,27,31,4,215],"l":[142,107,27,40,448,152]}]},{"name":"lead","x0":736,"y":444.0,"T":2.6,"S":56,"tail":{"kind":"row","at":117,"p":[0,114,22,36,645,152]},"head":{"px":296,"p":[293,0,110,117,600,4]},"body":[0,6,304,144,4,4],"legs":[{"hx":53.0,"hy":135,"ky":168,"L":75.0,"d0":-38.0,"ph":0.64,"fore":false,"u":[10,132,68,36,671,152],"l":[3,165,38,48,148,152]},{"hx":97.0,"hy":135,"ky":171,"L":82.0,"d0":15.47,"ph":0.14,"fore":false,"u":[67,132,49,39,479,152],"l":[74,168,57,51,87,152]},{"hx":217.0,"hy":145,"ky":176,"L":70.0,"d0":7.48,"ph":0.89,"fore":true,"u":[200,142,34,34,818,152],"l":[197,173,42,45,276,152]},{"hx":259.5,"hy":145,"ky":174,"L":66.0,"d0":5.92,"ph":0.39,"fore":true,"u":[234,142,58,32,885,152],"l":[257,171,35,43,364,152]}]}];

function Sprite({ p }: { p: Piece }) {
  const [x, y, w, h, sx, sy] = p;
  return (
    <svg x={x} y={y} width={w} height={h} viewBox={`${sx} ${sy} ${w} ${h}`} overflow="hidden">
      <image href={SHEET} width={SHEET_W} height={SHEET_H} />
    </svg>
  );
}

function foot(ph: number, S: number): [number, number, number] {
  ph = ((ph % 1) + 1) % 1;
  if (ph < BETA) return [S / 2 - (S * ph) / BETA, 0, 0];
  const u = (ph - BETA) / (1 - BETA);
  return [-S / 2 + (S * (1 - Math.cos(Math.PI * u))) / 2, Math.sin(Math.PI * u), Math.sin(Math.PI * Math.min(1, u * 1.15))];
}

function pose(el: SVGGElement, b: Buffalo, t: number) {
  const LP = END - START;
  const x = ((((b.x0 - START + SPEED * t) % LP) + LP) % LP) + START;
  el.setAttribute("transform", `translate(${x.toFixed(2)} ${b.y}) scale(0.5)`);
  const g = t / b.T;
  const f0 = b.legs[2].ph, f1 = b.legs[3].ph;
  const dip = (p: number) => {
    const q = (((g + p) % 1) + 1) % 1;
    return Math.exp(-Math.pow((q - 0.08) / 0.09, 2));
  };
  const bob = 3.4 * (dip(f0) + dip(f1)) - 1.7;
  el.querySelector(".bob")?.setAttribute("transform", `translate(0 ${bob.toFixed(2)})`);
  const nod = 4.2 * (dip(f0 - 0.04) + dip(f1 - 0.04)) - 0.8;
  el.querySelector(".head")?.setAttribute("transform", `translate(${b.head.px} 0) skewY(${nod.toFixed(2)}) translate(${-b.head.px} 0)`);
  const sw = Math.sin(2 * Math.PI * (g + 0.3));
  el.querySelector(".tail")?.setAttribute(
    "transform",
    b.tail.kind === "row"
      ? `translate(0 ${b.tail.at}) skewX(${(7 * sw).toFixed(2)}) translate(0 ${-b.tail.at})`
      : `translate(${b.tail.at} 0) skewY(${(-9 * sw).toFixed(2)}) translate(${-b.tail.at} 0)`
  );
  const uppers = el.querySelectorAll(".lu");
  b.legs.forEach((lc, i) => {
    const u = uppers[i];
    if (!u) return;
    const [d, lift, flex] = foot(g + lc.ph, b.S);
    const sy = (lc.L - bob - lift * 0.12 * lc.L) / lc.L;
    const th = Math.atan((d - K * lc.d0) / (lc.L * sy));
    const thd = Math.max(-36, Math.min(36, (th * 180) / Math.PI));
    u.setAttribute("transform", `translate(${lc.hx} ${lc.hy}) skewX(${thd.toFixed(2)}) scale(1 ${sy.toFixed(4)}) translate(${-lc.hx} ${-lc.hy})`);
    const kf = -(lc.fore ? 30 : 24) * flex;
    u.querySelector(".ll")?.setAttribute("transform", `translate(0 ${lc.ky}) skewX(${kf.toFixed(2)}) translate(0 ${-lc.ky})`);
  });
}

export default function WalkingBuffalo({ className, style }: { className?: string; style?: CSSProperties }) {
  const root = useRef<SVGSVGElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const els = Array.from(svg.querySelectorAll<SVGGElement>(".buffalo"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = true;
    let last: number | null = null;
    let t = 0;
    const frame = (now: number) => {
      if (last !== null) t += Math.min(0.1, (now - last) / 1000);
      last = now;
      els.forEach((el, i) => pose(el, HERD[i], t));
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      last = null;
      if (visible && !reduce.matches) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    });
    io.observe(svg);
    reduce.addEventListener("change", run);
    run();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      reduce.removeEventListener("change", run);
    };
  }, []);

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={className}
      style={{ display: "block", height: "auto", overflow: "hidden", ...style }}
      role="img"
      aria-label="Fazenda: a farmhouse under a tree, with three water buffalo walking past"
    >
      <defs>
        <linearGradient id={`${id}-edge`} x1="0" x2={VIEW_W} y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.05" stopColor="#fff" />
          <stop offset="0.95" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-fade`} maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW_W} height={VIEW_H}>
          <rect width={VIEW_W} height={VIEW_H} fill={`url(#${id}-edge)`} />
        </mask>
      </defs>
      <image href="/buffalo/scene.png" x="0" y="0" width={VIEW_W} height="460" />
      <g mask={`url(#${id}-fade)`}>
        {HERD.map((b) => (
          <g key={b.name} className="buffalo" transform={`translate(${b.x0} ${b.y}) scale(0.5)`}>
            <g className="bob">
              <g className="tail"><Sprite p={b.tail.p} /></g>
              {b.legs.map((l, i) => (
                <g key={i} className="lu">
                  <g className="ll"><Sprite p={l.l} /></g>
                  <Sprite p={l.u} />
                </g>
              ))}
              <Sprite p={b.body} />
              <g className="head"><Sprite p={b.head.p} /></g>
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
