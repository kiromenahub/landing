import { useEffect, useRef, useState } from "react";

const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const hexToRgb = (h) => {
  h = h.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHsv = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255;
  const m = Math.max(r, g, b), d = m - Math.min(r, g, b);
  let h = 0;
  if (d) { h = m === r ? ((g - b) / d) % 6 : m === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  return [h, m ? d / m : 0, m];
};
const hsvToHex = ([h, s, v]) => {
  const f = (n) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
  return "#" + [f(5), f(3), f(1)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
};
const SWATCHES = ["#000000", "#ffffff", "#2563eb", "#7c3aed", "#db2777", "#ef4444", "#f97316", "#eab308", "#16a34a", "#0ea5e9"];

export default function ColorPicker({ value, onChange }) {
  const [hsv, setHsv] = useState(() => rgbToHsv(hexToRgb(value)));
  const [hex, setHex] = useState(value);
  const last = useRef(value);

  useEffect(() => {
    if (value.toLowerCase() !== last.current.toLowerCase()) { setHsv(rgbToHsv(hexToRgb(value))); last.current = value; }
    setHex(value);
  }, [value]);

  const push = (n) => { setHsv(n); const x = hsvToHex(n); last.current = x; onChange(x); };
  const drag = (fn) => (e) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const mv = (ev) => { const r = el.getBoundingClientRect(); fn(clamp((ev.clientX - r.left) / r.width), clamp((ev.clientY - r.top) / r.height)); };
    mv(e);
    el.onpointermove = mv;
    el.onpointerup = () => { el.onpointermove = null; };
  };
  const typeHex = (v) => {
    setHex(v);
    if (/^#?[0-9a-f]{6}$/i.test(v)) push(rgbToHsv(hexToRgb(v)));
  };
  const eyedrop = async () => {
    try { const r = await new window.EyeDropper().open(); push(rgbToHsv(hexToRgb(r.sRGBHex))); } catch {}
  };
  const [h, s, v] = hsv;

  return (
    <div className="cp">
      <div className="cp-sv" style={{ background: `linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(${h},100%,50%))` }}
        onPointerDown={drag((x, y) => push([h, x, 1 - y]))}>
        <span className="cp-thumb" style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%`, background: value }} />
      </div>
      <div className="cp-row">
        {"EyeDropper" in window && <button className="cp-eye" onClick={eyedrop} aria-label="Pick color from screen">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 22 1-1h3l9-9M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3z"/></svg>
        </button>}
        <div className="cp-hue" onPointerDown={drag((x) => push([x * 360, s || 0.01, v || 0.01]))}>
          <span className="cp-thumb" style={{ left: `${(h / 360) * 100}%`, background: `hsl(${h},100%,50%)` }} />
        </div>
      </div>
      <div className="cp-hexrow">
        <span className="cp-chip" style={{ background: value }} />
        <input value={hex.toUpperCase()} onChange={(e) => typeHex(e.target.value)} spellCheck={false} maxLength={7} aria-label="Hex color" />
      </div>
      <div className="cp-sw">
        {SWATCHES.map((c) => (
          <button key={c} style={{ background: c }} className={c === value.toLowerCase() ? "on" : ""} onClick={() => push(rgbToHsv(hexToRgb(c)))} aria-label={c} />
        ))}
      </div>
    </div>
  );
}
