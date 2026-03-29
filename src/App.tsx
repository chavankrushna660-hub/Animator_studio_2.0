import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import Studio from "./components/Studio";

function useThree() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        if (!(window as any).THREE) {
          await new Promise((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
            s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
          });
        }
        if (!(window as any).THREE.GLTFLoader) {
          await new Promise((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js";
            s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
          });
        }
        setReady(true);
      } catch (e) {
        setError("Failed to load 3D engine. Check your internet connection.");
      }
    })();
  }, []);
  return { ready, error };
}

export default function App() {
  const { ready, error } = useThree();
  if (error) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      height:"100dvh",background:"#07071a",color:"#ef4444",fontFamily:"monospace",fontSize:15,gap:12,padding:20,textAlign:"center"}}>
      <span style={{fontSize:36}}>⚠️</span>
      <strong>3D Engine Load Error</strong>
      <span style={{color:"#9ca3af",maxWidth:400}}>{error}</span>
      <button onClick={()=>window.location.reload()}
        style={{marginTop:10,background:"#1e40af",color:"#fff",border:"none",borderRadius:8,padding:"8px 20px",cursor:"pointer"}}>
        Retry
      </button>
    </div>
  );
  if (!ready) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100dvh",
      background:"#07071a",color:"#7dd3fc",fontFamily:"monospace",fontSize:16,gap:10}}>
      <Sparkles size={22}/> Loading 3D Engine…
    </div>
  );
  return <Studio />;
}
