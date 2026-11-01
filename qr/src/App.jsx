import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { DONATE } from "./config.js";
import ColorPicker from "./ColorPicker.jsx";
import { CATEGORIES, ALL_ICONS, iconSrc, maskSrc } from "./icons.js";

const DOT_STYLES = ["square", "dots", "rounded", "extra-rounded", "classy", "classy-rounded"];
const EYE_FRAMES = ["square", "extra-rounded", "dot"];
const EYE_DOTS = ["square", "dot"];
const TABS = ["Content", "Shape", "Color", "Logo"];
const isLight = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 > 0.5; };

const Seg = ({ value, options, onChange }) => (
  <div className="seg">
    {options.map((o) => (<button key={o} className={o === value ? "on" : ""} onClick={() => onChange(o)}>{o.replace("-", " ")}</button>))}
  </div>
);
const Field = ({ label, children }) => (<div className="field"><label>{label}</label>{children}</div>);
const Sun = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>);
const Moon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>);
const Dl = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16"/></svg>);

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("qr-theme") || "light"; } catch { return "light"; }
  });
  const [tab, setTab] = useState("Content");
  const [target, setTarget] = useState("Dots");
  const [cat, setCat] = useState("Social");
  const [text, setText] = useState("https://example.com");
  const [dot, setDot] = useState("rounded");
  const [frame, setFrame] = useState("extra-rounded");
  const [eyeDot, setEyeDot] = useState("dot");
  const [fg, setFg] = useState("#111827");
  const [eye, setEye] = useState("#2563eb");
  const [bg, setBg] = useState("#ffffff");
  const [iconId, setIconId] = useState("");       // selected library icon
  const [upload, setUpload] = useState("");       // uploaded logo (data URL)
  const [iconMode, setIconMode] = useState("auto"); // auto | brand | custom
  const [iconColor, setIconColor] = useState("#111827");
  const [logoSize, setLogoSize] = useState(0.3);
  const [size, setSize] = useState(1024);
  const [toast, setToast] = useState("");
  const [donate, setDonate] = useState(false);
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState("");
  const prev = useRef("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("qr-theme", theme); } catch {}
  }, [theme]);

  // Library icons are recolored; "auto" contrasts with the QR background (light bg -> dark icon).
  const icon = ALL_ICONS.find((i) => i.id === iconId);
  const autoColor = isLight(bg) ? "#111827" : "#ffffff";
  const logoSrc = icon
    ? iconSrc(icon, iconMode === "brand" ? "brand" : iconMode === "custom" ? iconColor : autoColor)
    : upload;

  const opts = () => ({
    width: 300, height: 300, type: "svg", margin: 10, data: text || " ",
    image: logoSrc || undefined,
    qrOptions: { errorCorrectionLevel: logoSrc ? "H" : "M" },
    dotsOptions: { color: fg, type: dot },
    backgroundOptions: { color: bg },
    cornersSquareOptions: { color: eye, type: frame },
    cornersDotOptions: { color: eye, type: eyeDot },
    imageOptions: { imageSize: logoSize, margin: 6, crossOrigin: "anonymous", hideBackgroundDots: true },
  });

  // Realtime preview: render off-screen, preload, then swap (no flicker). Only one render runs at a time and
  // it always restarts with the latest options, so the QR keeps up while you drag a color.
  const key = JSON.stringify(opts());
  const latest = useRef(null);
  latest.current = opts();
  const busy = useRef(false);
  const dirty = useRef(false);
  useEffect(() => {
    const run = async () => {
      if (busy.current) { dirty.current = true; return; }
      busy.current = true;
      do {
        dirty.current = false;
        try {
          const blob = await new QRCodeStyling(latest.current).getRawData("svg");
          const url = URL.createObjectURL(blob);
          await new Promise((res) => { const im = new Image(); im.onload = im.onerror = res; im.src = url; });
          const old = prev.current; prev.current = url; setPreview(url);
          if (old) setTimeout(() => URL.revokeObjectURL(old), 1000);
        } catch {}
      } while (dirty.current);
      busy.current = false;
    };
    run();
  }, [key]);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 1800); };
  const download = async (ext) => {
    const big = new QRCodeStyling({ ...opts(), width: size, height: size, margin: Math.round(size / 30), type: ext === "svg" ? "svg" : "canvas" });
    await big.download({ name: "qr-code", extension: ext });
    flash(`${ext === "jpeg" ? "JPG" : ext.toUpperCase()} downloaded`);
  };
  const copy = async () => {
    try {
      const big = new QRCodeStyling({ ...opts(), type: "canvas", width: 1024, height: 1024, margin: 34 });
      const blob = await big.getRawData("png");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      flash("Copied to clipboard");
    } catch { flash("Your browser blocked image copy"); }
  };
  const readFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = () => {
      const set = (d) => { setUpload(d); setIconId(""); };
      if (f.type === "image/svg+xml") return set(r.result);
      const im = new Image(); // downscale big images so updates stay fast
      im.onload = () => {
        const m = Math.min(1, 256 / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = Math.round(im.width * m); c.height = Math.round(im.height * m);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        set(c.toDataURL("image/png"));
      };
      im.src = r.result;
    };
    r.readAsDataURL(f);
  };

  return (
    <div className="app">
      <div className="row"><header className="in nav">
        <div className="brand"><img className="mark" src="/favicon.svg" alt="" />QR Studio</div>
        <div className="nav-r">
          <span className="badge"><i />No ads · No sign-up</span>
          <button className="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
        </div>
      </header></div>

      <div className="row"><section className="in head">
        <h1>Create a QR code</h1>
        <p>Customize shape, color and logo, then export as PNG, JPG or SVG.</p>
      </section></div>

      <main className="frame"><div className="in split">
        <aside className="side">
          <nav className="tabs">
            {TABS.map((t) => (<button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>))}
          </nav>
          <div className="body">
            {tab === "Content" && (
              <>
                <Field label="URL or text">
                  <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="https://yourwebsite.com" />
                </Field>
                <Field label="Export size (px)">
                  <Seg value={String(size)} options={["512", "1024", "2048"]} onChange={(v) => setSize(+v)} />
                </Field>
              </>
            )}
            {tab === "Shape" && (
              <>
                <Field label="Dot style"><Seg value={dot} options={DOT_STYLES} onChange={setDot} /></Field>
                <Field label="Corner frame"><Seg value={frame} options={EYE_FRAMES} onChange={setFrame} /></Field>
                <Field label="Corner dot"><Seg value={eyeDot} options={EYE_DOTS} onChange={setEyeDot} /></Field>
              </>
            )}
            {tab === "Color" && (
              <>
                <div className="targets">
                  {[["Dots", fg], ["Corners", eye], ["Background", bg]].map(([n, c]) => (
                    <button key={n} className={target === n ? "on" : ""} onClick={() => setTarget(n)}><i style={{ background: c }} />{n}</button>
                  ))}
                </div>
                <ColorPicker key={target} value={target === "Dots" ? fg : target === "Corners" ? eye : bg}
                  onChange={target === "Dots" ? setFg : target === "Corners" ? setEye : setBg} />
              </>
            )}
            {tab === "Logo" && (
              <>
                <label className={"drop" + (drag ? " over" : "")}
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => { e.preventDefault(); setDrag(false); readFile(e.dataTransfer.files[0]); }}>
                  <input type="file" accept="image/*" hidden onChange={(e) => readFile(e.target.files?.[0])} />
                  {upload ? <img src={upload} alt="" /> : <span className="plus">+</span>}
                  <div><b>{upload ? "Replace logo" : "Upload your logo"}</b><small>Click or drop an image · PNG, JPG, SVG</small></div>
                </label>
                <Field label="Icon library">
                  <div className="seg cats">
                    {CATEGORIES.map((c) => (<button key={c.name} className={cat === c.name ? "on" : ""} onClick={() => setCat(c.name)}>{c.name}</button>))}
                  </div>
                  <div className="icons">
                    {CATEGORIES.find((c) => c.name === cat).icons.map((i) => (
                      <button key={i.id} title={i.label} aria-label={i.label} className={iconId === i.id ? "on" : ""} onClick={() => setIconId(i.id)}>
                        <span className="glyph" style={{ WebkitMaskImage: `url("${maskSrc(i)}")`, maskImage: `url("${maskSrc(i)}")` }} />
                      </button>
                    ))}
                  </div>
                </Field>
                {icon && (
                  <Field label="Icon color">
                    <Seg value={iconMode} options={["auto", "brand", "custom"]} onChange={setIconMode} />
                    {iconMode === "custom" && <div style={{ marginTop: 14 }}><ColorPicker key="icon" value={iconColor} onChange={setIconColor} /></div>}
                  </Field>
                )}
                {logoSrc && (
                  <div className="logo-ctl">
                    <input className="range" type="range" min="0.15" max="0.45" step="0.01" value={logoSize} onChange={(e) => setLogoSize(+e.target.value)} aria-label="Logo size" />
                    <button className="remove" onClick={() => { setIconId(""); setUpload(""); }}>Remove</button>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        <section className="canvas">
          <div className="card"><div className="qr">{preview && <img src={preview} alt="QR code preview" />}</div></div>
          <div className="toolbar">
            <button className="btn dark" onClick={() => download("png")}><Dl />PNG</button>
            <button className="btn dark" onClick={() => download("jpeg")}><Dl />JPG</button>
            <button className="btn dark" onClick={() => download("svg")}><Dl />SVG</button>
            <button className="btn" onClick={copy}>Copy image</button>
          </div>
        </section>
      </div></main>

      <div className="row top"><footer className="in foot">
        <p><b>We run no ads.</b> No tracking, no sign-up, and your content never leaves your browser. Your support keeps it free.</p>
        <button className="btn donate" onClick={() => setDonate(true)}>♥ Donate</button>
      </footer></div>

      {donate && <DonateModal onClose={() => setDonate(false)} flash={flash} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function DonateModal({ onClose, flash }) {
  const [tab, setTab] = useState("coffee");
  const tabs = { coffee: "Buy Me a Coffee", qris: "QRIS (Indonesia)", paypal: "PayPal", crypto: "Crypto" };
  const copy = (t) => navigator.clipboard.writeText(t).then(() => flash("Address copied"));
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Donate">
        <div className="mh"><h2>Support QR Studio</h2><button className="icon" onClick={onClose} aria-label="Close">✕</button></div>
        <div className="mtabs">
          {Object.entries(tabs).map(([k, v]) => (<button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{v}</button>))}
        </div>
        <div className="mb">
          {tab === "coffee" && <a className="btn dark wide" href={DONATE.buymeacoffee} target="_blank" rel="noreferrer">Open Buy Me a Coffee</a>}
          {tab === "paypal" && <a className="btn dark wide" href={DONATE.paypal} target="_blank" rel="noreferrer">Donate with PayPal</a>}
          {tab === "qris" && (<><img className="qris" src={DONATE.qris} alt="QRIS" /><small>Scan with GoPay, OVO, DANA, or any mobile banking app.</small></>)}
          {tab === "crypto" && DONATE.crypto.map((c) => (
            <div className="addr" key={c.name}>
              <div><b>{c.name}</b><code>{c.address}</code></div>
              <button onClick={() => copy(c.address)}>Copy</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}