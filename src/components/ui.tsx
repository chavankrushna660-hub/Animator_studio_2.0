import React from "react";
import { TEXTURES } from "../constants";

export const colorPickStyle = { width: 32, height: 26, border: "none", borderRadius: 6, cursor: "pointer", background: "transparent" };

export function SL({ label, val, min, max, step = 1, onChange, T }: any) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
        <span style={{ color: T.muted }}>{label}</span>
        <span style={{ color: T.accent, fontFamily: "monospace" }}>{Number(val).toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", height: 3, cursor: "pointer", accentColor: "#4f46e5" }} />
    </div>
  );
}

export function Sec({ title, children, T }: any) {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "none", border: "none", cursor: "pointer", padding: "0 0 4px",
          fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700,
          borderBottom: `1px solid ${T.border}`, marginBottom: open ? 8 : 0
        }}>
        {title}
        <span style={{ fontSize: 10 }}>{open ? "▾" : "▸"}</span>
      </button>
      {open && children}
    </div>
  );
}

export function Lbl({ children, T }: any) {
  return <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700, marginBottom: 7 }}>{children}</div>;
}

export function Row({ children, T }: any) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: T.btnBg, borderRadius: 7, padding: "6px 9px", marginBottom: 6
    }}>
      {children}
    </div>
  );
}

export function Toggle({ label, val, onChange, T }: any) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
      <span style={{ fontSize: 11, color: T.muted }}>{label}</span>
      <button onClick={() => onChange(!val)}
        style={{
          width: 38, height: 20, borderRadius: 10, border: "none", cursor: "pointer", position: "relative",
          background: val ? "#4f46e5" : "#374151", transition: "background 0.2s"
        }}>
        <div style={{
          position: "absolute", top: 2, left: val ? 18 : 2, width: 16, height: 16,
          borderRadius: "50%", background: "#fff", transition: "left 0.2s"
        }} />
      </button>
    </div>
  );
}

export function IconBtn({ onClick, title, children, T }: any) {
  return (
    <button onClick={onClick} title={title}
      style={{
        background: T.btnBg, border: `1px solid ${T.border}`, color: T.muted,
        borderRadius: 7, padding: "5px 7px", cursor: "pointer", display: "flex", alignItems: "center"
      }}>
      {children}
    </button>
  );
}

export function TBtn({ onClick, children, T, title, style }: any) {
  return (
    <button onClick={onClick} title={title}
      style={{
        background: T.btnBg, border: `1px solid ${T.border}`, color: T.muted,
        borderRadius: 6, padding: "4px 9px", fontSize: 11, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 4, flexShrink: 0, ...style
      }}>
      {children}
    </button>
  );
}

export function SkinSwatches({ val, onChange, T, SKIN_TONES }: any) {
  return (
    <div style={{ marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: T.muted, display: "block", marginBottom: 5 }}>Skin Tone</span>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {SKIN_TONES.map((c: string) => (
          <button key={c} onClick={() => onChange(c)}
            style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: val === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer" }} />
        ))}
        <input type="color" value={val} onChange={e => onChange(e.target.value)} style={{ ...colorPickStyle, width: 24, height: 24, borderRadius: "50%" } as any} />
      </div>
    </div>
  );
}

export function SwatchRow({ label, colors, val, onChange, T }: any) {
  return (
    <div style={{ marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: T.muted, display: "block", marginBottom: 5 }}>{label}</span>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {colors.map((c: string) => (
          <button key={c} onClick={() => onChange(c)}
            style={{
              width: 20, height: 20, borderRadius: 4, background: c,
              border: val === c ? "2px solid #fff" : "1px solid #ffffff33", cursor: "pointer"
            }} />
        ))}
      </div>
    </div>
  );
}

export function TexSelect({ label, val, onChange, T }: any) {
  return (
    <div style={{ marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: T.muted, display: "block", marginBottom: 4 }}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {TEXTURES.map(t => (
          <button key={t} onClick={() => onChange(t)}
            style={{
              fontSize: 9, padding: "2px 6px", borderRadius: 5, cursor: "pointer", fontWeight: 600,
              background: val === t ? "#4f46e5" : T.btnBg,
              border: `1px solid ${val === t ? "#4f46e5" : T.border}`,
              color: val === t ? "#fff" : T.muted
            }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
