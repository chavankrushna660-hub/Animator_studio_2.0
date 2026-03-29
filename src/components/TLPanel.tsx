import React, { useRef, useCallback } from "react";
import { Play, Pause, Plus, Copy } from "lucide-react";
import { TOTAL_FRAMES } from "../constants";
import { TBtn } from "./ui";

export function TLPanel({ frame, setFrame, playing, setPlaying, kfs, setKfs, chars, selId, saveKF, deleteKF, copied, setCopied, T, showToast }: any) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  const scrub = useCallback((e: any) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const cx = (e.clientX ?? e.touches?.[0]?.clientX ?? 0);
    const x = Math.max(0, cx - rect.left);
    setFrame(Math.round(Math.min(TOTAL_FRAMES, (x / rect.width) * TOTAL_FRAMES)));
  }, [setFrame]);

  const ticks = [];
  for (let i = 0; i <= TOTAL_FRAMES; i += 25) ticks.push(i);

  return (
    <div style={{
      height: 185, background: T.panelBg, borderTop: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column", flexShrink: 0, zIndex: 20
    }}>
      {/* controls */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
        borderBottom: `1px solid ${T.border}`, background: T.bg, flexWrap: "wrap", flexShrink: 0
      }}>
        <button onClick={() => setPlaying((p: boolean) => !p)}
          style={{
            width: 34, height: 34, borderRadius: "50%", background: "#1e40af", border: "none",
            color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
          {playing ? <Pause size={15} /> : <Play size={15} style={{ marginLeft: 2 }} />}
        </button>
        <span style={{
          fontSize: 12, fontFamily: "monospace", background: T.inputBg,
          border: `1px solid ${T.border}`, borderRadius: 6, padding: "3px 9px",
          color: "#4ade80", minWidth: 75, textAlign: "center", flexShrink: 0
        }}>
          {frame}/{TOTAL_FRAMES}
        </span>
        <TBtn onClick={() => setFrame(0)} T={T} title="Go to start">⏮</TBtn>
        <TBtn onClick={() => setFrame(TOTAL_FRAMES)} T={T} title="Go to end">⏭</TBtn>
        <div style={{ width: 1, height: 18, background: T.border }} />
        <TBtn onClick={saveKF} T={T} style={{ color: T.accent }}><Plus size={12} />KF</TBtn>
        <TBtn onClick={() => {
          if (kfs[frame]) { setCopied(JSON.parse(JSON.stringify(kfs[frame]))); showToast("Frame copied!"); }
          else showToast("No keyframe at this frame", "info");
        }} T={T}><Copy size={12} />Copy</TBtn>
        <TBtn onClick={() => {
          if (!copied) { showToast("Copy a frame first!", "info"); return; }
          setKfs((p: any) => ({ ...p, [frame]: JSON.parse(JSON.stringify(copied)) }));
          showToast("Pasted at frame " + frame);
        }} T={T}><Copy size={12} />Paste</TBtn>
        <span style={{ fontSize: 10, color: T.muted, marginLeft: "auto", flexShrink: 0 }}>
          Click/drag track · Right-click ◆ to delete KF
        </span>
      </div>

      {/* ruler + tracks */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{
          height: 18, background: T.bg, borderBottom: `1px solid ${T.border}`,
          display: "flex", flexShrink: 0, paddingLeft: 95
        }}>
          <div style={{ flex: 1, position: "relative" }}>
            {ticks.map(t => (
              <div key={t} style={{
                position: "absolute", top: 0, bottom: 0, left: `${(t / TOTAL_FRAMES) * 100}%`,
                display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none"
              }}>
                <div style={{ width: 1, height: 5, background: T.border }} />
                <span style={{ fontSize: 8, color: T.muted, transform: "translateX(-50%)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {chars.length === 0 && (
            <div style={{ padding: "12px 16px", color: T.muted, fontSize: 12, fontStyle: "italic" }}>
              Add a character to see timeline tracks
            </div>
          )}
          {chars.map((c: any) => (
            <div key={c.id} style={{
              display: "flex", alignItems: "stretch", height: 28,
              borderBottom: `1px solid ${T.border}`, flexShrink: 0
            }}>
              <div style={{
                width: 90, flexShrink: 0, fontSize: 11, fontWeight: 600,
                color: selId === c.id ? T.accent : T.muted, display: "flex", alignItems: "center",
                padding: "0 6px", background: T.panelBg, borderRight: `1px solid ${T.border}`,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
              }}>
                {c.name}
              </div>
              <div ref={trackRef}
                style={{ flex: 1, position: "relative", background: T.inputBg, cursor: "crosshair", userSelect: "none" }}
                onMouseDown={e => { drag.current = true; scrub(e); }}
                onMouseMove={e => { if (drag.current) scrub(e); }}
                onMouseUp={() => { drag.current = false; }}
                onMouseLeave={() => { drag.current = false; }}
                onTouchStart={e => { drag.current = true; scrub(e); }}
                onTouchMove={e => { if (drag.current) scrub(e); }}
                onTouchEnd={() => { drag.current = false; }}
              >
                {ticks.map(t => (
                  <div key={t} style={{
                    position: "absolute", top: 0, bottom: 0,
                    left: `${(t / TOTAL_FRAMES) * 100}%`, width: 1, background: T.border, pointerEvents: "none"
                  }} />
                ))}
                {/* playhead */}
                <div style={{
                  position: "absolute", top: 0, bottom: 0,
                  left: `${(frame / TOTAL_FRAMES) * 100}%`, width: 2, background: "#ef4444",
                  zIndex: 10, pointerEvents: "none", boxShadow: "0 0 5px #ef444477"
                }}>
                  <div style={{
                    position: "absolute", top: -2, left: -4, width: 10, height: 10,
                    background: "#ef4444", transform: "rotate(45deg)", borderRadius: 2
                  }} />
                </div>
                {/* KF diamonds */}
                {Object.keys(kfs).map(f => {
                  if (!kfs[f as any][c.id]) return null;
                  return (
                    <div key={f}
                      title={`KF @ ${f} — right-click to delete`}
                      onContextMenu={e => { e.preventDefault(); deleteKF(Number(f), c.id); }}
                      onClick={e => { e.stopPropagation(); setFrame(Number(f)); }}
                      style={{
                        position: "absolute", top: "50%", left: `${(Number(f) / TOTAL_FRAMES) * 100}%`,
                        width: 11, height: 11, background: T.accent,
                        transform: "translate(-50%,-50%) rotate(45deg)",
                        borderRadius: 2, cursor: "pointer", zIndex: 5,
                        boxShadow: `0 0 6px ${T.accent}99`
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
