import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play, Pause, Plus, Copy, Sparkles, Video, ZoomIn, ZoomOut,
  ChevronLeft, ChevronRight, Upload, Menu, RotateCcw, Sun, Moon,
  Shirt, User, Layers, Sliders, Trash2, Camera, Download
} from "lucide-react";
import { FPS, TOTAL_FRAMES, DARK, LIGHT, BODY_PARTS, DEG } from "../constants";
import { lerp, uid, defaultBodyProps, defaultDressProps, defaultPartState } from "../utils";
import { makeCharState } from "../charState";
import { buildChar, applyState } from "../engine";
import { IconBtn, Lbl } from "./ui";
import { BodyPanel, FacePanel, DressPanel, PartsPanel } from "./Panels";
import { TLPanel } from "./TLPanel";

export default function Studio() {
  const [chars,     setChars]    = useState<any[]>([]);
  const [selId,     setSelId]    = useState<string | null>(null);
  const [selPart,   setSelPart]  = useState("torso");
  const [activeTab, setActiveTab]= useState("body"); // body | dress | parts | face
  const [kfs,       setKfs]      = useState<any>({});
  const [frame,     setFrame]    = useState(0);
  const [playing,   setPlaying]  = useState(false);
  const [recording, setRecording]= useState(false);
  const [aiText,    setAiText]   = useState("");
  const [leftOpen,  setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen]= useState(true);
  const [copied,    setCopied]   = useState<any>(null);
  const [theme,     setTheme]    = useState("dark"); // dark | light
  const [toast,     setToast]    = useState<any>(null);
  const [errors,    setErrors]   = useState<any[]>([]);

  const mountRef  = useRef<HTMLDivElement>(null);
  const engRef    = useRef<any>(null);
  const fileRef   = useRef<HTMLInputElement>(null);
  const frameRef  = useRef(0);
  const kfsRef    = useRef<any>({});
  const charsRef  = useRef<any[]>([]);
  const ivRef     = useRef<any>(null);
  const recRef    = useRef<any>(null);

  useEffect(() => { kfsRef.current  = kfs;   }, [kfs]);
  useEffect(() => { charsRef.current = chars; }, [chars]);

  // Handle canvas resize when panels are toggled
  useEffect(() => {
    const handleResize = () => {
      if (!engRef.current || !mountRef.current) return;
      const { renderer, camera } = engRef.current;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    // Use a small timeout to ensure DOM has updated
    const timer = setTimeout(handleResize, 50);
    return () => clearTimeout(timer);
  }, [leftOpen, rightOpen]);

  const isDark = theme === "dark";
  const T = isDark ? DARK : LIGHT;

  /* ── Toast helper ── */
  const showToast = useCallback((msg: string, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  },[]);

  const addError = useCallback((msg: string) => {
    const id = uid();
    setErrors(e => [...e, {id, msg}]);
    setTimeout(()=>setErrors(e=>e.filter(x=>x.id!==id)), 5000);
  },[]);

  /* ── ENGINE INIT ── */
  useEffect(() => {
    if (!mountRef.current || engRef.current) return;
    const THREE = (window as any).THREE;
    const el = mountRef.current;
    let W = el.clientWidth, H = el.clientHeight;
    if (!W || !H) { W = 600; H = 400; }

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#0a0a1e");
      scene.fog = new THREE.FogExp2("#0a0a1e", 0.01);

      const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 1000);
      camera.position.set(0, 7, 22);

      const renderer = new THREE.WebGLRenderer({antialias:true, preserveDrawingBuffer:true});
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      el.appendChild(renderer.domElement);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const sun = new THREE.DirectionalLight(0xfff5e0, 1.1);
      sun.position.set(8,18,12); sun.castShadow=true;
      sun.shadow.mapSize.width = 2048; sun.shadow.mapSize.height = 2048;
      scene.add(sun);
      const rim = new THREE.DirectionalLight(0x4488ff, 0.4);
      rim.position.set(-10,5,-8); scene.add(rim);
      const fill = new THREE.DirectionalLight(0xffa0a0, 0.2);
      fill.position.set(5,-2,10); scene.add(fill);

      // Ground
      scene.add(new THREE.GridHelper(60,60,"#1a1a3a","#0f0f28"));
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(60,60),
        new THREE.MeshStandardMaterial({color:"#0d0d22",roughness:1}));
      ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);

      // Orbit controls
      let drag=false, prev={x:0,y:0}, pinch: any=null;
      const orbit=(dx: number,dy: number)=>{
        const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(dy*DEG*0.4,dx*DEG*0.4,0,"XYZ"));
        camera.position.applyQuaternion(q);
        camera.lookAt(0,4,0);
      };
      const doZoom=(f: number)=>{
        camera.position.multiplyScalar(f);
        const d=camera.position.length();
        if(d<3) camera.position.setLength(3);
        if(d>100) camera.position.setLength(100);
      };
      const resetView=()=>{ camera.position.set(0,7,22); camera.lookAt(0,4,0); };

      const md=(e: any)=>{drag=true;prev={x:e.clientX,y:e.clientY};};
      const mu=()=>{drag=false;pinch=null;};
      const mm=(e: any)=>{if(!drag)return;orbit(e.clientX-prev.x,e.clientY-prev.y);prev={x:e.clientX,y:e.clientY};};
      const wh=(e: any)=>{e.preventDefault();doZoom(e.deltaY>0?1.08:0.93);};
      const ts=(e: any)=>{
        if(e.touches.length===2)pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
        else{drag=true;prev={x:e.touches[0].clientX,y:e.touches[0].clientY};}
      };
      const tm=(e: any)=>{
        if(e.touches.length===2&&pinch){
          const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
          doZoom(pinch>d?1.04:0.96);pinch=d;
        } else if(drag&&e.touches.length===1){
          orbit(e.touches[0].clientX-prev.x,e.touches[0].clientY-prev.y);
          prev={x:e.touches[0].clientX,y:e.touches[0].clientY};
        }
      };

      renderer.domElement.addEventListener("mousedown",md);
      renderer.domElement.addEventListener("wheel",wh,{passive:false});
      renderer.domElement.addEventListener("touchstart",ts,{passive:true});
      window.addEventListener("mouseup",mu);
      window.addEventListener("mousemove",mm);
      window.addEventListener("touchend",mu);
      window.addEventListener("touchmove",tm,{passive:true});

      camera.lookAt(0,4,0);
      engRef.current = {scene,camera,renderer,chars:{},doZoom,resetView};

      let aid: any;
      const animate=()=>{aid=requestAnimationFrame(animate);renderer.render(scene,camera);};
      animate();

      const onResize=()=>{
        if(!mountRef.current)return;
        const nw=mountRef.current.clientWidth,nh=mountRef.current.clientHeight;
        if(!nw||!nh)return;
        camera.aspect=nw/nh;camera.updateProjectionMatrix();
        renderer.setSize(nw,nh);
      };
      window.addEventListener("resize",onResize);

      return ()=>{
        cancelAnimationFrame(aid);
        window.removeEventListener("resize",onResize);
        window.removeEventListener("mouseup",mu);
        window.removeEventListener("mousemove",mm);
        window.removeEventListener("touchend",mu);
        window.removeEventListener("touchmove",tm);
        try{ if(el.contains(renderer.domElement))el.removeChild(renderer.domElement); }catch(e){}
        engRef.current=null;
      };
    } catch(e: any) {
      addError("Failed to initialize 3D renderer: "+e.message);
    }
  }, [addError]);

  const rebuildChar=useCallback((charId: string)=>{
    try{
      const ch=engRef.current?.chars[charId];
      if(ch) engRef.current.scene.remove(ch.root);
      delete engRef.current.chars[charId];
    }catch(e){}
    const c=charsRef.current.find(x=>x.id===charId); if(!c)return;
    const pos=engRef.current?.chars[charId]?.root?.position||{x:0,y:0,z:0};
    buildChar(charId,c.isFemale,c.body,c.dress, engRef.current, addError);
    if(engRef.current?.chars[charId]){
      engRef.current.chars[charId].root.position.x=pos.x||0;
    }
    applyState(charId,c, engRef.current);
  },[addError, applyState]);

  /* ── ACTIONS ── */
  const addChar=(isFemale: boolean)=>{
    const id=uid();
    const charData=makeCharState(isFemale);
    const name=`${isFemale?"Female":"Male"} ${chars.length+1}`;
    buildChar(id,isFemale,charData.body,charData.dress, engRef.current, addError);
    if(engRef.current?.chars[id]) engRef.current.chars[id].root.position.x=chars.length*4;
    const c={id,name,...charData,isFemale};
    setChars(p=>[...p,c]); setSelId(id); setSelPart("torso"); setActiveTab("body");
    setKfs((p: any)=>({...p,0:{...(p[0]||{}),[id]:JSON.parse(JSON.stringify(charData))}}));
    showToast(`Added ${name}`);
  };

  const cloneChar=()=>{
    const src=chars.find(c=>c.id===selId); if(!src){addError("No character selected");return;}
    const id=uid();
    const charData={parts:JSON.parse(JSON.stringify(src.parts)),body:JSON.parse(JSON.stringify(src.body)),dress:JSON.parse(JSON.stringify(src.dress))};
    buildChar(id,src.isFemale,charData.body,charData.dress, engRef.current, addError);
    if(engRef.current?.chars[id]) engRef.current.chars[id].root.position.x=chars.length*4;
    const c={id,name:`${src.name} Copy`,...charData,isFemale:src.isFemale};
    setChars(p=>[...p,c]); setSelId(id);
    setKfs((p: any)=>({...p,0:{...(p[0]||{}),[id]:JSON.parse(JSON.stringify(charData))}}));
    showToast("Cloned character");
  };

  const deleteChar=()=>{
    if(!selId){addError("No character selected");return;}
    try{
      const ch=engRef.current?.chars[selId];
      if(ch) engRef.current.scene.remove(ch.root);
      delete engRef.current.chars[selId];
    }catch(e){}
    setChars(p=>p.filter(c=>c.id!==selId));
    setKfs((p: any)=>{const u=JSON.parse(JSON.stringify(p));Object.keys(u).forEach(f=>{delete u[f][selId as any];});return u;});
    setSelId(null); showToast("Character deleted","info");
  };

  /* update body prop */
  const updateBody=(prop: string,val: any)=>{
    if(!selId)return;
    setChars(p=>p.map(c=>{
      if(c.id!==selId)return c;
      const nb={...c.body,[prop]:val};
      const nc={...c,body:nb};
      // debounced rebuild
      clearTimeout(nc._rebuildTimer);
      nc._rebuildTimer=setTimeout(()=>rebuildChar(selId),300);
      return nc;
    }));
  };

  const updateDress=(prop: string,val: any)=>{
    if(!selId)return;
    setChars(p=>p.map(c=>{
      if(c.id!==selId)return c;
      const nd={...c.dress,[prop]:val};
      const nc={...c,dress:nd};
      clearTimeout(nc._rebuildTimer);
      nc._rebuildTimer=setTimeout(()=>rebuildChar(selId),300);
      return nc;
    }));
  };

  const updatePart=(part: string,prop: string,val: any)=>{
    if(!selId)return;
    setChars(p=>p.map(c=>{
      if(c.id!==selId)return c;
      const np=JSON.parse(JSON.stringify(c.parts));
      if(!np[part])np[part]=defaultPartState("#cccccc");
      np[part][prop]=val;
      const nc={...c,parts:np};
      applyState(selId,nc, engRef.current);
      return nc;
    }));
    setKfs((p: any)=>{
      if(p[frame]&&p[frame][selId]){
        const u=JSON.parse(JSON.stringify(p));
        if(!u[frame][selId].parts[part])u[frame][selId].parts[part]=defaultPartState();
        u[frame][selId].parts[part][prop]=val;
        return u;
      }
      return p;
    });
  };

  const saveKF=()=>{
    if(!selId){addError("Select a character first!");return;}
    const ch=chars.find(c=>c.id===selId); if(!ch)return;
    setKfs((p: any)=>({...p,[frame]:{...(p[frame]||{}),[selId]:{parts:JSON.parse(JSON.stringify(ch.parts)),body:JSON.parse(JSON.stringify(ch.body)),dress:JSON.parse(JSON.stringify(ch.dress))}}}));
    showToast(`Keyframe saved @ frame ${frame}`);
  };

  const deleteKF=(f: number,cid: string)=>{
    setKfs((p: any)=>{const u=JSON.parse(JSON.stringify(p));if(u[f]){delete u[f][cid];if(!Object.keys(u[f]).length)delete u[f];}return u;});
    showToast("Keyframe deleted","info");
  };

  /* AI */
  const doAI=()=>{
    if(!selId){addError("Select a character first!");return;}
    const ch=chars.find(c=>c.id===selId);if(!ch)return;
    const p=aiText.toLowerCase();
    const nkf=JSON.parse(JSON.stringify(kfs));
    const pose=(f: number,cfg: any)=>{
      const snap={parts:JSON.parse(JSON.stringify(ch.parts)),body:JSON.parse(JSON.stringify(ch.body)),dress:JSON.parse(JSON.stringify(ch.dress))};
      Object.keys(cfg).forEach(pt=>{
        if(!snap.parts[pt])snap.parts[pt]=defaultPartState();
        Object.assign(snap.parts[pt],cfg[pt]);
      });
      if(!nkf[f])nkf[f]={};
      nkf[f][selId]=snap;
    };
    if(p.includes("walk")){
      pose(0, {upperLegL:{rx:35},upperLegR:{rx:-35},upperArmL:{rx:-28},upperArmR:{rx:28},lowerLegL:{rx:-10},lowerLegR:{rx:10}});
      pose(15,{upperLegL:{rx:0},upperLegR:{rx:0},upperArmL:{rx:0},upperArmR:{rx:0}});
      pose(30,{upperLegL:{rx:-35},upperLegR:{rx:35},upperArmL:{rx:28},upperArmR:{rx:-28},lowerLegL:{rx:10},lowerLegR:{rx:-10}});
      pose(45,{upperLegL:{rx:0},upperLegR:{rx:0},upperArmL:{rx:0},upperArmR:{rx:0}});
      pose(60,{upperLegL:{rx:35},upperLegR:{rx:-35},upperArmL:{rx:-28},upperArmR:{rx:28}});
      showToast("Walk cycle: frames 0–60");
    } else if(p.includes("run")){
      pose(0, {upperLegL:{rx:55},upperLegR:{rx:-55},upperArmL:{rx:-50},upperArmR:{rx:50},lowerLegL:{rx:-40},lowerLegR:{rx:40},torso:{rx:10}});
      pose(10,{upperLegL:{rx:0},upperLegR:{rx:0}});
      pose(20,{upperLegL:{rx:-55},upperLegR:{rx:55},upperArmL:{rx:50},upperArmR:{rx:-50},lowerLegL:{rx:40},lowerLegR:{rx:-40}});
      pose(30,{upperLegL:{rx:55},upperLegR:{rx:-55},upperArmL:{rx:-50},upperArmR:{rx:50}});
      showToast("Run cycle: frames 0–30");
    } else if(p.includes("jump")){
      pose(0,  {});
      pose(10, {upperLegL:{rx:-42},upperLegR:{rx:-42},upperArmL:{rx:-40},upperArmR:{rx:-40}});
      pose(25, {upperLegL:{rx:22},upperLegR:{rx:22},upperArmL:{rz:145},upperArmR:{rz:-145},torso:{py:2}});
      pose(45, {upperLegL:{rx:-42},upperLegR:{rx:-42},torso:{py:0}});
      pose(62, {upperLegL:{rx:0},upperLegR:{rx:0},upperArmL:{rz:0},upperArmR:{rz:0}});
      showToast("Jump: frames 0–62");
    } else if(p.includes("wave")){
      pose(0, {upperArmR:{rz:-15},lowerArmR:{rx:0}});
      pose(12,{upperArmR:{rz:-105},lowerArmR:{rx:-55}});
      pose(24,{upperArmR:{rz:-105},lowerArmR:{rx:22}});
      pose(36,{upperArmR:{rz:-105},lowerArmR:{rx:-55}});
      pose(48,{upperArmR:{rz:-15},lowerArmR:{rx:0}});
      showToast("Wave: frames 0–48");
    } else if(p.includes("dance")){
      pose(0, {torso:{ry:0},upperArmL:{rz:55},upperArmR:{rz:-55}});
      pose(15,{torso:{ry:25},upperLegL:{rx:20},upperLegR:{rx:-20},upperArmL:{rx:35},upperArmR:{rx:-35}});
      pose(30,{torso:{ry:-25},upperLegL:{rx:-20},upperLegR:{rx:20},upperArmL:{rz:55},upperArmR:{rz:-55}});
      pose(45,{torso:{ry:0},upperArmL:{rx:0},upperArmR:{rx:0},head:{ry:20}});
      pose(60,{torso:{ry:0},head:{ry:-20}});
      showToast("Dance: frames 0–60");
    } else if(p.includes("sit")){
      pose(frame,{upperLegL:{rx:-90},upperLegR:{rx:-90},lowerLegL:{rx:88},lowerLegR:{rx:88},torso:{rx:-5}});
      showToast("Sit pose at frame "+frame);
    } else if(p.includes("bow")){
      pose(0,{torso:{rx:0},head:{rx:0}});
      pose(20,{torso:{rx:40},head:{rx:-30}});
      pose(40,{torso:{rx:0},head:{rx:0}});
      showToast("Bow: frames 0–40");
    } else { addError("Try: walk · run · jump · wave · dance · sit · bow"); return; }
    setKfs(nkf); setAiText("");
  };

  /* Screenshot */
  const takeScreenshot=()=>{
    try{
      const canvas=mountRef.current?.querySelector("canvas"); if(!canvas)return;
      const a=document.createElement("a"); a.href=canvas.toDataURL("image/png");
      a.download="screenshot.png"; a.click(); showToast("Screenshot saved!");
    }catch(e: any){addError("Screenshot failed: "+e.message);}
  };

  /* Video export */
  const exportVideo=()=>{
    try{
      if(!mountRef.current)throw new Error("Canvas not ready");
      const canvas=mountRef.current.querySelector("canvas"); if(!canvas)throw new Error("No canvas");
      const mimeType=(MediaRecorder as any).isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm";
      setRecording(true); frameRef.current=0; setFrame(0);
      const stream=(canvas as any).captureStream(FPS);
      const rec=new MediaRecorder(stream,{mimeType,videoBitsPerSecond:4000000});
      recRef.current=rec;
      const chunks: any[]=[]; rec.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
      rec.onstop=()=>{
        const blob=new Blob(chunks,{type:"video/webm"});
        const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
        a.download="3D_Animation.webm"; a.click();
        setRecording(false); showToast("Video exported!");
      };
      rec.onerror=(e: any)=>{addError("Recording error: "+e.error);setRecording(false);};
      rec.start(100); setPlaying(true);
      setTimeout(()=>{try{rec.stop();setPlaying(false);}catch(e){}},((TOTAL_FRAMES/FPS)*1000)+800);
    }catch(e: any){addError("Export failed: "+e.message);setRecording(false);}
  };

  const stopRecording=()=>{
    try{recRef.current?.stop();setPlaying(false);setRecording(false);}catch(e){}
  };

  const getStateAt=useCallback((charId: string,f: number)=>{
    const kf=kfsRef.current;
    const nums=Object.keys(kf).map(Number).sort((a,b)=>a-b);
    let pf: number | null=null,nf: number | null=null;
    for(const k of nums){if(kf[k][charId]){if(k<=f)pf=k;if(k>f&&nf===null)nf=k;}}
    if(pf===null)return null;
    const ps=kf[pf][charId];
    if(nf===null)return JSON.parse(JSON.stringify(ps));
    const ns=kf[nf][charId];
    const t=(f-pf)/(nf-pf);
    const r=JSON.parse(JSON.stringify(ps));
    BODY_PARTS.forEach(p=>{
      if(!ns.parts?.[p]||!r.parts?.[p])return;
      ["rx","ry","rz","px","py","pz","sx","sy","sz","mouthOpen"].forEach(k=>{
        r.parts[p][k]=lerp(ps.parts[p][k]||0,ns.parts[p][k]||0,t);
      });
    });
    return r;
  },[]);

  const applyFrame=useCallback((f: number)=>{
    charsRef.current.forEach(c=>{
      const s=getStateAt(c.id,f);
      if(s)applyState(c.id,s, engRef.current);
    });
  },[getStateAt]);

  useEffect(()=>{if(!playing)applyFrame(frame);},[frame,playing,applyFrame]);
  useEffect(()=>{
    if(playing){
      ivRef.current=setInterval(()=>{
        frameRef.current=frameRef.current>=TOTAL_FRAMES?0:frameRef.current+1;
        setFrame(frameRef.current);
        applyFrame(frameRef.current);
      },1000/FPS);
    } else clearInterval(ivRef.current);
    return()=>clearInterval(ivRef.current);
  },[playing,applyFrame]);

  const selChar=chars.find(c=>c.id===selId);
  const partState=selChar?.parts[selPart] ?? defaultPartState();

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100dvh",
      background:T.bg,color:T.text,fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden",position:"relative"}}>

      {/* TOAST */}
      {toast&&(
        <div style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",
          background:toast.type==="success"?"#166534":toast.type==="info"?"#1e3a5f":"#7f1d1d",
          color:"#fff",borderRadius:8,padding:"8px 18px",fontSize:13,zIndex:1000,
          boxShadow:"0 4px 20px #0008",pointerEvents:"none"}}>
          {toast.msg}
        </div>
      )}

      {/* ERROR STACK */}
      <div style={{position:"fixed",bottom:220,right:12,zIndex:999,display:"flex",flexDirection:"column",gap:5,maxWidth:300}}>
        {errors.map(e=>(
          <div key={e.id} style={{background:"#7f1d1d",color:"#fca5a5",borderRadius:7,padding:"7px 12px",fontSize:12,
            boxShadow:"0 2px 10px #0006",display:"flex",justifyContent:"space-between",gap:8}}>
            <span>⚠ {e.msg}</span>
            <button onClick={()=>setErrors(x=>x.filter(y=>y.id!==e.id))}
              style={{background:"none",border:"none",color:"#fca5a5",cursor:"pointer",fontWeight:700}}>✕</button>
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        background:T.panelBg,padding:"7px 12px",borderBottom:`1px solid ${T.border}`,
        flexShrink:0,gap:8,flexWrap:"wrap",zIndex:30}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <IconBtn onClick={()=>setLeftOpen(o=>!o)} title="Toggle Library" T={T}>
            {leftOpen?<ChevronLeft size={15}/>:<Menu size={15}/>}
          </IconBtn>
          <Sparkles size={17} style={{color:"#60a5fa"}}/>
          <span style={{fontSize:17,fontWeight:800,
            background:"linear-gradient(90deg,#60a5fa,#a78bfa)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            3D Animator Pro
          </span>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:6,background:T.inputBg,
          borderRadius:20,padding:"5px 12px",border:`1px solid ${T.border}`,
          flex:1,maxWidth:380,minWidth:100}}>
          <Sparkles size={12} style={{color:"#a78bfa",flexShrink:0}}/>
          <input value={aiText} onChange={e=>setAiText(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&doAI()}
            placeholder="AI: walk · run · jump · wave · dance · sit · bow"
            style={{background:"transparent",border:"none",outline:"none",
              color:T.text,fontSize:12,width:"100%",minWidth:0}}/>
          <button onClick={doAI} style={{background:"#6d28d9",color:"#fff",border:"none",
            borderRadius:10,padding:"3px 10px",fontSize:11,cursor:"pointer",fontWeight:700,flexShrink:0}}>GO</button>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <IconBtn onClick={takeScreenshot} title="Screenshot" T={T}><Camera size={15}/></IconBtn>
          <button onClick={recording?stopRecording:exportVideo}
            style={{display:"flex",alignItems:"center",gap:5,
              background:recording?"#7f1d1d":"#1e40af",color:"#fff",border:"none",
              borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontWeight:700}}>
            {recording?<><span style={{width:8,height:8,borderRadius:"50%",background:"#ef4444",display:"inline-block",animation:"pulse 1s infinite"}}/>Stop</>:<><Video size={14}/>Export</>}
          </button>
          <IconBtn onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} title="Toggle Theme" T={T}>
            {isDark?<Sun size={15}/>:<Moon size={15}/>}
          </IconBtn>
          <IconBtn onClick={()=>setRightOpen(o=>!o)} title="Toggle Properties" T={T}>
            {rightOpen?<ChevronRight size={15}/>:<Menu size={15}/>}
          </IconBtn>
        </div>
      </div>

      {/* BODY */}
      <div style={{display:"flex",flex:1,overflow:"hidden",minHeight:0}}>

        {/* LEFT PANEL */}
        {leftOpen&&(
          <div style={{width:180,background:T.panelBg,borderRight:`1px solid ${T.border}`,
            display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
            <div style={{padding:"10px",borderBottom:`1px solid ${T.border}`}}>
              <Lbl T={T}>Library</Lbl>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {[
                  {l:"+ Male",   c:"#3b82f6",fn:()=>addChar(false)},
                  {l:"+ Female", c:"#ec4899",fn:()=>addChar(true)},
                  {l:"Clone",    c:"#10b981",fn:cloneChar},
                  {l:"Delete",   c:"#ef4444",fn:deleteChar},
                ].map(b=>(
                  <button key={b.l} onClick={b.fn}
                    style={{background:T.btnBg,border:`1px solid ${b.c}55`,color:b.c,
                      borderRadius:7,padding:"6px 9px",fontSize:12,cursor:"pointer",
                      textAlign:"left",fontWeight:700}}>
                    {b.l}
                  </button>
                ))}
                <button onClick={()=>fileRef.current?.click()}
                  style={{background:T.btnBg,border:`1px solid #818cf855`,color:"#818cf8",
                    borderRadius:7,padding:"6px 9px",fontSize:12,cursor:"pointer",
                    textAlign:"left",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
                  <Upload size={12}/>GLB Import
                </button>
                <input type="file" accept=".glb,.gltf" ref={fileRef}
                  onChange={e=>{
                    const file=e.target.files?.[0];if(!file)return;
                    const url=URL.createObjectURL(file);
                    new (window as any).THREE.GLTFLoader().load(url,(gltf: any)=>{
                      try{
                        const T3=(window as any).THREE,id=uid(),charData=makeCharState(false);
                        const root=new T3.Group(); root.position.x=chars.length*4;
                        const model=gltf.scene;
                        const box=new T3.Box3().setFromObject(model);
                        const sz=box.getSize(new T3.Vector3()).length();
                        const ctr=box.getCenter(new T3.Vector3());
                        model.position.sub(ctr);model.scale.setScalar(7/sz);
                        const wrap=new T3.Group();wrap.add(model);root.add(wrap);
                        engRef.current.scene.add(root);
                        engRef.current.chars[id]={root,meshes:{torso:wrap},isFemale:false};
                        const c={id,name:file.name.slice(0,14),...charData,isFemale:false};
                        setChars(p=>[...p,c]);setSelId(id);
                        setKfs((p: any)=>({...p,0:{...(p[0]||{}),[id]:JSON.parse(JSON.stringify(charData))}}));
                        showToast("GLB loaded!");
                      }catch(err: any){addError("GLB load failed: "+err.message);}
                    },null,(err: any)=>addError("Invalid GLB file"));
                    e.target.value="";
                  }}
                  style={{display:"none"}}/>
              </div>
            </div>
            <div style={{flex:1,overflow:"auto",padding:"8px"}}>
              <Lbl T={T}>Scene</Lbl>
              {chars.length===0&&<span style={{fontSize:11,color:T.muted,fontStyle:"italic"}}>No characters yet</span>}
              {chars.map(c=>(
                <div key={c.id}>
                  <button onClick={()=>setSelId(c.id)}
                    style={{width:"100%",textAlign:"left",
                      background:selId===c.id?T.selBg:"transparent",
                      border:`1px solid ${selId===c.id?T.accent:T.border}`,
                      borderRadius:6,padding:"5px 7px",color:selId===c.id?T.accent:T.muted,
                      fontSize:12,cursor:"pointer",marginBottom:2,fontWeight:600}}>
                    {c.name}
                  </button>
                  {selId===c.id&&(
                    <div style={{marginLeft:8,borderLeft:`2px solid ${T.border}`,paddingLeft:5,marginBottom:4,maxHeight:200,overflow:"auto"}}>
                      {BODY_PARTS.map(p=>(
                        <button key={p} onClick={()=>{setSelPart(p);setActiveTab("parts");}}
                          style={{display:"block",width:"100%",textAlign:"left",border:"none",
                            borderRadius:4,padding:"2px 5px",fontSize:10,cursor:"pointer",
                            color:selPart===p?T.accent:T.muted,
                            background:selPart===p?T.selBg:"transparent",fontWeight:500}}>
                          › {p.replace(/([A-Z])/g," $1").trim()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANVAS */}
        <div style={{flex:1,position:"relative",background:"#000",minWidth:0,display:"flex",flexDirection:"column"}}>
          <div ref={mountRef} style={{flex:1,cursor:"grab",touchAction:"none"}}/>
          <div style={{position:"absolute",top:10,right:10,display:"flex",flexDirection:"column",gap:5,zIndex:10}}>
            {[
              {icon:<ZoomIn size={15}/>,  fn:()=>engRef.current?.doZoom(0.88),  tip:"Zoom In"},
              {icon:<ZoomOut size={15}/>, fn:()=>engRef.current?.doZoom(1.14),  tip:"Zoom Out"},
              {icon:<RotateCcw size={14}/>,fn:()=>engRef.current?.resetView(),  tip:"Reset View"},
            ].map((z,i)=>(
              <button key={i} title={z.tip} onClick={z.fn}
                style={{background:"#0d0d20cc",border:"1px solid #252550",color:"#9ca3af",
                  borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",
                  justifyContent:"center",cursor:"pointer",backdropFilter:"blur(4px)"}}>
                {z.icon}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        {rightOpen&&(
          <div style={{width:260,background:T.panelBg,borderLeft:`1px solid ${T.border}`,
            display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>

            {/* Tabs */}
            <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
              {[
                {id:"body",  icon:<User size={13}/>,    label:"Body"},
                {id:"face",  icon:<Sparkles size={13}/>,label:"Face"},
                {id:"dress", icon:<Shirt size={13}/>,   label:"Dress"},
                {id:"parts", icon:<Sliders size={13}/>, label:"Parts"},
              ].map(tab=>(
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                  style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                    justifyContent:"center",gap:2,padding:"7px 2px",fontSize:10,cursor:"pointer",border:"none",
                    background:activeTab===tab.id?T.selBg:T.panelBg,
                    color:activeTab===tab.id?T.accent:T.muted,
                    borderBottom:activeTab===tab.id?`2px solid ${T.accent}`:"2px solid transparent",
                    fontWeight:activeTab===tab.id?700:500}}>
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>

            <div style={{flex:1,overflowY:"auto",padding:"10px 11px"}}>
              {!selId
                ?<span style={{fontSize:12,color:T.muted,fontStyle:"italic"}}>Select a character</span>
                :<>
                  {activeTab==="body"  &&<BodyPanel    char={selChar} updateBody={updateBody} T={T}/>}
                  {activeTab==="face"  &&<FacePanel    char={selChar} updateBody={updateBody} T={T}/>}
                  {activeTab==="dress" &&<DressPanel   char={selChar} updateDress={updateDress} T={T}/>}
                  {activeTab==="parts" &&<PartsPanel   char={selChar} selPart={selPart} setSelPart={setSelPart} partState={partState} updatePart={updatePart} frame={frame} T={T}/>}
                  <button onClick={saveKF}
                    style={{width:"100%",marginTop:10,
                      background:"linear-gradient(90deg,#3730a3,#6d28d9)",
                      color:"#fff",border:"none",borderRadius:10,padding:"10px 0",
                      fontSize:13,fontWeight:700,cursor:"pointer",
                      display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    <Plus size={14}/> Set KF @ {frame}
                  </button>
                </>
              }
            </div>
          </div>
        )}
      </div>

      {/* TIMELINE */}
      <TLPanel
        frame={frame} setFrame={(f: number)=>{frameRef.current=f;setFrame(f);}}
        playing={playing} setPlaying={setPlaying}
        kfs={kfs} setKfs={setKfs}
        chars={chars} selId={selId}
        saveKF={saveKF} deleteKF={deleteKF}
        copied={copied} setCopied={setCopied}
        T={T} showToast={showToast}
      />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
