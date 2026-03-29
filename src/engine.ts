import { clamp, defaultPartState } from "./utils";
import { BODY_PARTS, DEG } from "./constants";

export function buildChar(id: string, isFemale: boolean, bodyProps: any, dressProps: any, eng: any, addError: any) {
  try {
    const THREE = (window as any).THREE;
    if (!eng) throw new Error("Engine not ready");

    const bp = bodyProps;
    const dp = dressProps;
    const skin  = bp.skinTone || (isFemale?"#f4a261":"#e0ac69");
    const cloth = dp.shirtColor || (isFemale?"#c2185b":"#1565c0");
    const pants = dp.pantsColor || (isFemale?"#880e4f":"#37474f");
    const hair  = bp.hairColor  || (isFemale?"#2b2b2b":"#3a2e24");
    const lip   = bp.lipColor   || (isFemale?"#e57373":"#bf8070");

    const roughFromTex = (tex: string) => ({
      flat:0.4, rough:0.95, metallic:0.1, glossy:0.05,
      fabric:0.85, leather:0.6, denim:0.88, wool:0.95, silk:0.2, velvet:0.9
    }[tex]||0.6);
    const metFromTex  = (tex: string) => ({metallic:0.8,glossy:0.3}[tex]||0.0);

    const M=(c: string,r=0.6,m=0.0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
    const sph=(r: number,m: any)=>{const x=new THREE.Mesh(new THREE.SphereGeometry(r,24,24),m);x.castShadow=true;return x;};
    const bx=(w: number,h: number,d: number,m: any)=>{const x=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);x.castShadow=true;return x;};
    const cy=(rt: number,rb: number,h: number,m: any)=>{const x=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,18),m);x.castShadow=true;return x;};
    const sphScale=(r: number,sx: number,sy: number,sz: number,m: any)=>{const x=sph(r,m);x.scale.set(sx,sy,sz);return x;};

    const jntM = M("#303045",0.95);
    const skinM = M(skin, clamp(bp.skinRoughness,0.1,1.0), bp.skinMetalness||0);
    const clothM = M(cloth, roughFromTex(dp.shirtTexture), metFromTex(dp.shirtTexture));
    const pantsM = M(pants, roughFromTex(dp.pantsTexture), metFromTex(dp.pantsTexture));

    const root = new THREE.Group();
    eng.scene.add(root);
    const meshes: any = {};

    /* scale from body props */
    const H_SCALE = bp.height || 1.0;
    const SH_W    = (bp.shoulderWidth||1.0)*0.85;
    const HIP_W   = (bp.hipWidth||1.0)*0.38;
    const LEG_L   = (bp.legLength||1.0)*1.5;
    const ARM_L   = (bp.armLength||1.0)*1.2;
    const TORSO_L = (bp.torsoLength||1.0)*2.1;
    const HEAD_S  = (bp.headSize||1.0)*0.65;
    const BELLY   = (bp.bellySize||0.0)*0.4;
    const NECK_L  = (bp.neckLength||1.0)*0.35;
    const NECK_T  = (bp.neckThickness||1.0);

    const CHEST_W = bp.chestWidth || 1.0;
    const WAIST_W = bp.waistWidth || 1.0;
    const THIGH_T = bp.thighThickness || 1.0;
    const CALF_T  = bp.calfThickness || 1.0;
    const BICEP_T = bp.bicepThickness || 1.0;
    const FOREARM_T = bp.forearmThickness || 1.0;
    const SH_H    = bp.shoulderHeight || 1.0;
    const HIP_H   = bp.hipHeight || 1.0;
    const HEAD_W  = bp.headWidth || 1.0;
    const HEAD_D  = bp.headDepth || 1.0;

    /* ── TORSO ── */
    const torso = new THREE.Group();
    const tY = LEG_L*H_SCALE*1.2*HIP_H + TORSO_L*H_SCALE*0.5;
    torso.position.set(0, tY, 0);
    root.add(torso); meshes.torso = torso;

    const torsoW = (bp.shoulderWidth||1.0)*1.3;
    const tMesh = bx(torsoW * CHEST_W, TORSO_L, 0.9, clothM.clone());
    // belly bulge
    if(BELLY>0.05) {
      const bellyM = bx(torsoW*0.9 * WAIST_W, TORSO_L*0.5, 0.9+BELLY, clothM.clone());
      bellyM.position.set(0,-TORSO_L*0.15,BELLY*0.3);
      torso.add(bellyM); meshes.belly = bellyM;
    }
    torso.add(tMesh);

    /* ── NECK ── */
    const neckPiv = new THREE.Group(); neckPiv.position.set(0,TORSO_L*0.5*SH_H,0); torso.add(neckPiv);
    const neckM = cy(0.18*NECK_T,0.2*NECK_T,NECK_L,skinM.clone()); neckM.position.set(0,NECK_L*0.5,0); neckPiv.add(neckM);
    meshes.neck = neckPiv;

    /* ── HEAD ── */
    const headPiv = new THREE.Group(); headPiv.position.set(0,NECK_L,0); neckPiv.add(headPiv); meshes.head = headPiv;

    const headW = ((bp.faceShape||0.5)>0.5 ? HEAD_S : HEAD_S*0.85) * HEAD_W;
    const headH = HEAD_S*(1+(bp.chinLength||0.5)*0.2);
    const headD = HEAD_S * HEAD_D;
    const headMesh = sphScale(HEAD_S,headW/HEAD_S,headH/HEAD_S,headD/HEAD_S,skinM.clone());
    headMesh.position.set(0,HEAD_S,0); headPiv.add(headMesh);

    /* hair */
    const hStyle = bp.hairStyle||0;
    const hairMat = M(hair,0.9);
    const hairGeo = new THREE.SphereGeometry(HEAD_S*1.04,28,28,0,Math.PI*2,0,Math.PI/(hStyle>0?1.8:2.0));
    const hairMesh = new THREE.Mesh(hairGeo, hairMat.clone());
    hairMesh.position.set(0,HEAD_S,0); headPiv.add(hairMesh); meshes.hair = hairMesh;
    if(isFemale || (bp.hairLength||0.5)>0.6) {
      const lhGeo = new THREE.CylinderGeometry(HEAD_S*0.8,HEAD_S*0.5,HEAD_S*(bp.hairLength||0.5)*2,16,1,true);
      const lh = new THREE.Mesh(lhGeo,hairMat.clone()); lh.position.set(0,HEAD_S*0.4,0); headPiv.add(lh);
    }

    /* eyes */
    const eyeS = HEAD_S*(bp.eyeSize||1.0)*0.1;
    const eyeSpX = (bp.eyeSpacing||1.0)*0.22;
    const eyeM  = M("#ffffff",0.05);
    const irisM = M(bp.eyeColor||"#2e7d32",0.1);
    const pupM  = M("#0a0a0a",0.0);
    [[-eyeSpX],[eyeSpX]].forEach(([ex],i)=>{
      const ey=sph(eyeS,eyeM.clone()); ey.position.set(ex,HEAD_S*1.1,HEAD_S*0.85); headPiv.add(ey);
      const ir=sph(eyeS*0.6,irisM.clone()); ir.position.set(ex,HEAD_S*1.1,HEAD_S*0.94); headPiv.add(ir);
      const pu=sph(eyeS*0.35,pupM.clone()); pu.position.set(ex,HEAD_S*1.1,HEAD_S*0.96); headPiv.add(pu);
      if(i===0){meshes.eyeL=ey;}else{meshes.eyeR=ey;}
    });

    /* eyebrows */
    const browH = (bp.eyebrowThickness||1.0)*0.045;
    const browM = M(hair,0.9);
    const ebLG = new THREE.BoxGeometry(HEAD_S*0.3,browH,HEAD_S*0.05);
    const ebL  = new THREE.Mesh(ebLG,browM.clone()); ebL.position.set(-eyeSpX,HEAD_S*1.25,HEAD_S*0.88);
    ebL.rotation.z = (bp.eyebrowAngle||0)*DEG*0.5; headPiv.add(ebL); meshes.eyebrowL=ebL;
    const ebR  = new THREE.Mesh(ebLG.clone(),browM.clone()); ebR.position.set(eyeSpX,HEAD_S*1.25,HEAD_S*0.88);
    ebR.rotation.z = -(bp.eyebrowAngle||0)*DEG*0.5; headPiv.add(ebR); meshes.eyebrowR=ebR;

    /* nose */
    const noseS = bp.noseSize||1.0;
    const nPiv = new THREE.Group(); nPiv.position.set(0,HEAD_S*0.85,HEAD_S*0.92); headPiv.add(nPiv); meshes.nose=nPiv;
    const nBr = cy(0.025*noseS,0.045*noseS,HEAD_S*0.25*noseS,M(skin,0.65)); nBr.position.set(0,0,0); nPiv.add(nBr);
    const nL=sph(0.05*noseS,M(skin,0.65)); nL.position.set(-0.065*noseS,-HEAD_S*0.12,0.01); nPiv.add(nL);
    const nR=sph(0.05*noseS,M(skin,0.65)); nR.position.set( 0.065*noseS,-HEAD_S*0.12,0.01); nPiv.add(nR);

    /* cheeks */
    const ckC = isFemale?"#f7a0a0":"#c8a07a";
    const ckL=sph(HEAD_S*0.15,M(ckC,0.5));ckL.position.set(-HEAD_S*0.52,HEAD_S*0.8,HEAD_S*0.73);ckL.scale.z=0.28;headPiv.add(ckL);meshes.cheekL=ckL;
    const ckR=sph(HEAD_S*0.15,M(ckC,0.5));ckR.position.set( HEAD_S*0.52,HEAD_S*0.8,HEAD_S*0.73);ckR.scale.z=0.28;headPiv.add(ckR);meshes.cheekR=ckR;

    /* realistic mouth */
    const lipS = bp.lipSize||1.0;
    const mPiv = new THREE.Group(); mPiv.position.set(0,HEAD_S*0.58,HEAD_S*0.91); headPiv.add(mPiv); meshes.mouth=mPiv;
    const ulGeo=new THREE.TorusGeometry(HEAD_S*0.19*lipS,HEAD_S*0.04*lipS,10,24,Math.PI);
    const ul=new THREE.Mesh(ulGeo,M(lip||"#e57373",0.3));ul.rotation.z=Math.PI;ul.position.set(0,HEAD_S*0.04*lipS,0);mPiv.add(ul);
    const llGeo=new THREE.TorusGeometry(HEAD_S*0.21*lipS,HEAD_S*0.045*lipS,10,24,Math.PI);
    const ll=new THREE.Mesh(llGeo,M(lip||"#e57373",0.3));ll.position.set(0,-HEAD_S*0.04*lipS,0);mPiv.add(ll);
    const inner=new THREE.Mesh(new THREE.SphereGeometry(HEAD_S*0.15*lipS,14,8),M("#160606",0.99));
    inner.scale.set(1,0.01,0.45);inner.position.set(0,0,-HEAD_S*0.02);mPiv.add(inner);
    mPiv.userData={ul,ll,inner};

    /* ears */
    if(bp.earSize && bp.earSize>0.1) {
      const earS=HEAD_S*(bp.earSize||1.0)*0.18;
      const earM=M(skin,0.65);
      const earL=sph(earS,earM.clone());earL.scale.set(0.5,1.2,0.4);earL.position.set(-HEAD_S*1.02,HEAD_S,0);headPiv.add(earL);meshes.ear=earL;
      const earR=sph(earS,earM.clone());earR.scale.set(0.5,1.2,0.4);earR.position.set(HEAD_S*1.02,HEAD_S,0);headPiv.add(earR);
    }

    /* beard */
    if(bp.hasBeard) {
      const bdL = bp.beardLength||0.3;
      const bdM = M(bp.beardColor||hair,0.9);
      const beard=cy(HEAD_S*0.45,HEAD_S*0.3,HEAD_S*bdL*1.5,bdM);
      beard.position.set(0,HEAD_S*0.25,HEAD_S*0.7);beard.rotation.x=-Math.PI/8;headPiv.add(beard);meshes.beard=beard;
    }

    /* mustache */
    if(bp.hasMustache) {
      const musM = M(bp.beardColor||hair,0.9);
      const mus=bx(HEAD_S*0.3,HEAD_S*0.06,HEAD_S*0.06,musM);
      mus.position.set(0,HEAD_S*0.62,HEAD_S*0.94);headPiv.add(mus);meshes.mustache=mus;
    }

    /* glasses */
    if(bp.hasGlasses || dp.hasGlasses) {
      const glassM=M("#222",0.3,0.8);
      const lensM=M("#aaddff",0.1,0.0);
      const fr=new THREE.Group(); fr.position.set(0,HEAD_S*1.1,HEAD_S*0.93); headPiv.add(fr); meshes.glasses=fr;
      const frGeo=new THREE.TorusGeometry(HEAD_S*0.14,HEAD_S*0.015,8,20);
      const fL=new THREE.Mesh(frGeo,glassM.clone()); fL.position.set(-HEAD_S*0.22,0,0); fr.add(fL);
      const fR=new THREE.Mesh(frGeo.clone(),glassM.clone()); fR.position.set(HEAD_S*0.22,0,0); fr.add(fR);
      const bridge=bx(HEAD_S*0.1,HEAD_S*0.015,HEAD_S*0.015,glassM.clone()); bridge.position.set(0,0,0); fr.add(bridge);
      const lensGeo=new THREE.CircleGeometry(HEAD_S*0.13,16);
      const lL=new THREE.Mesh(lensGeo,lensM.clone()); lL.position.set(-HEAD_S*0.22,0,0.01); fr.add(lL);
      const lR=new THREE.Mesh(lensGeo.clone(),lensM.clone()); lR.position.set(HEAD_S*0.22,0,0.01); fr.add(lR);
    }

    /* wrinkles (simple lines overlay) */
    meshes.wrinkles = headMesh; // reuse for coloring

    /* ── SHOULDER PADS ── */
    const shoulPiv = new THREE.Group(); shoulPiv.position.set(0,TORSO_L*0.45,0); torso.add(shoulPiv);
    const shoulL=sph(SH_W*0.28,jntM.clone()); shoulL.position.set(-SH_W*0.88,0,0); shoulPiv.add(shoulL);
    const shoulR=sph(SH_W*0.28,jntM.clone()); shoulR.position.set( SH_W*0.88,0,0); shoulPiv.add(shoulR);
    meshes.shoulder = shoulPiv;

    /* ── HIP ── */
    const hipPiv = new THREE.Group(); hipPiv.position.set(0,-TORSO_L*0.5,0); torso.add(hipPiv);
    const hipMesh=bx(HIP_W*2.2 * WAIST_W,0.25,0.8,pantsM.clone()); hipPiv.add(hipMesh); meshes.hip=hipPiv;

    /* ── ARMS ── */
    const makeArm=(side: number)=>{
      const sx=side<0?-1:1;
      const sleeveLen=(dp.shirtSleeveLength||1.0);
      const shPiv=new THREE.Group(); shPiv.position.set(sx*SH_W*0.88,TORSO_L*0.38*SH_H,0); torso.add(shPiv);
      shPiv.add(sph(SH_W*0.26,jntM.clone()));
      const ua=cy(0.17 * BICEP_T,0.14 * BICEP_T,ARM_L,clothM.clone()); ua.position.set(0,-ARM_L*0.5*sleeveLen,0); shPiv.add(ua);
      const elPiv=new THREE.Group(); elPiv.position.set(0,-ARM_L*sleeveLen,0); shPiv.add(elPiv);
      elPiv.add(sph(0.15,jntM.clone()));
      const la=cy(0.14 * FOREARM_T,0.11 * FOREARM_T,ARM_L,skinM.clone()); la.position.set(0,-ARM_L*0.5,0); elPiv.add(la);
      const wrPiv=new THREE.Group(); wrPiv.position.set(0,-ARM_L,0); elPiv.add(wrPiv);
      const handS=bp.handSize||1.0;
      const hnd=bx(0.26*handS,0.38*handS,0.13*handS,skinM.clone()); hnd.position.set(0,-0.19*handS,0); wrPiv.add(hnd);
      const th=bx(0.11*handS,0.2*handS,0.09*handS,skinM.clone()); th.position.set(sx*0.17*handS,-0.13*handS,0.04*handS); wrPiv.add(th);
      if(dp.hasGloves){
        const glvM=M(dp.gloveColor||"#1a1a1a",0.7);
        const glv=bx(0.27*handS,0.4*handS,0.14*handS,glvM); glv.position.set(0,-0.19*handS,0); wrPiv.add(glv);
      }
      if(side<0){meshes.upperArmL=shPiv;meshes.lowerArmL=elPiv;meshes.handL=wrPiv;}
      else      {meshes.upperArmR=shPiv;meshes.lowerArmR=elPiv;meshes.handR=wrPiv;}
    };
    makeArm(-1); makeArm(1);

    /* jacket */
    if(dp.hasJacket) {
      const jkM=M(dp.jacketColor||"#212121",roughFromTex(dp.jacketTexture||"leather"),0.1);
      const jacketBody=bx(torsoW*1.08,TORSO_L*1.05,0.98,jkM); torso.add(jacketBody);
      if(!dp.jacketOpen) {
        const jkFront=bx(torsoW*0.5,TORSO_L*1.05,0.05,jkM.clone()); jkFront.position.set(0,0,0.52); torso.add(jkFront);
      }
    }

    /* scarf */
    if(dp.hasScarf) {
      const scfM=M(dp.scarfColor||"#c2185b",0.85);
      const scf=cy(HEAD_S*1.05,HEAD_S*1.1,NECK_L*1.4*(dp.scarfLength||0.5)+0.3,scfM);
      scf.position.set(0,TORSO_L*0.5+NECK_L*0.3,0); torso.add(scf);
    }

    /* tie */
    if(dp.hasTie) {
      const tieM=M(dp.tieColor||"#880e4f",roughFromTex("silk"),0.15);
      const tieW=dp.tieWidth||0.5;
      const tieBody=bx(0.12*tieW,TORSO_L*0.7,0.04,tieM); tieBody.position.set(0,-TORSO_L*0.05,0.47); torso.add(tieBody);
    }

    /* ── LEGS ── */
    const makeLeg=(side: number)=>{
      const sx=side<0?-1:1;
      const legW=bp.legLength||1.0;
      const hPiv=new THREE.Group(); hPiv.position.set(sx*HIP_W*0.95,-TORSO_L*0.5*HIP_H,0); torso.add(hPiv);
      hPiv.add(sph(0.24,jntM.clone()));
      const pW=(dp.pantsWidth||1.0)*0.24;
      const ul=cy(pW * THIGH_T,pW*0.85 * THIGH_T,LEG_L,pantsM.clone()); ul.position.set(0,-LEG_L*0.5,0); hPiv.add(ul);
      const kPiv=new THREE.Group(); kPiv.position.set(0,-LEG_L,0); hPiv.add(kPiv);
      kPiv.add(sph(0.21,jntM.clone()));
      const ll=cy(0.18 * CALF_T,0.15 * CALF_T,LEG_L*0.95,skinM.clone()); ll.position.set(0,-LEG_L*0.475,0); kPiv.add(ll);
      const aPiv=new THREE.Group(); aPiv.position.set(0,-LEG_L*0.95,0); kPiv.add(aPiv);
      const shoeH=dp.shoeHeight||0.3;
      const shoeM=M(dp.shoeColor||"#1a1a1a",roughFromTex(dp.shoeTexture||"leather"),0.05);
      const shoeS=bp.footSize||1.0;
      const ft=bx(0.42*shoeS,0.22*(1+shoeH*0.5),0.72*shoeS,shoeM); ft.position.set(0,-0.11-shoeH*0.08,0.14); aPiv.add(ft);
      if(shoeH>0.4) {
        const heel=cy(0.06,0.04,shoeH*0.5,shoeM.clone()); heel.position.set(0,-shoeH*0.1,-0.28*shoeS); aPiv.add(heel);
      }
      if(side<0){meshes.upperLegL=hPiv;meshes.lowerLegL=kPiv;meshes.footL=aPiv;}
      else      {meshes.upperLegR=hPiv;meshes.lowerLegR=kPiv;meshes.footR=aPiv;}
    };
    makeLeg(-1); makeLeg(1);

    /* hat */
    if(dp.hasHat) {
      const hatM=M(dp.hatColor||"#37474f",0.8);
      const hatS=dp.hatSize||1.0;
      const hatGroup=new THREE.Group();
      hatGroup.position.set(0,HEAD_S*1.5,0); headPiv.add(hatGroup); meshes.hat=hatGroup;
      const brim=cy(HEAD_S*0.95*hatS,HEAD_S*0.95*hatS,0.05,hatM.clone());
      const top=cy(HEAD_S*0.65*hatS,HEAD_S*0.55*hatS,HEAD_S*0.8*hatS,hatM.clone()); top.position.set(0,HEAD_S*0.4,0);
      hatGroup.add(brim); hatGroup.add(top);
    }

    /* belt */
    if(dp.hasBelt) {
      const beltM=M(dp.beltColor||"#4a2912",roughFromTex("leather"),0.05);
      const belt=cy(HIP_W*1.1,HIP_W*1.1,(dp.beltWidth||0.5)*0.18,beltM);
      belt.position.set(0,-TORSO_L*0.48,0); torso.add(belt); meshes.belt=belt;
    }

    eng.chars[id]={root,meshes,isFemale};
  } catch(e: any) {
    addError("Failed to build character: "+e.message);
  }
}

export function applyState(charId: string, charData: any, eng: any) {
  try {
    if(!eng||!eng.chars[charId])return;
    const {meshes}=eng.chars[charId];
    const {parts,body}=charData;

    const ts=parts.torso;
    if(ts&&meshes.torso){
      meshes.torso.position.set(ts.px, (4.5+ts.py)*(body?.height||1.0), ts.pz);
      meshes.torso.rotation.set(ts.rx*DEG,ts.ry*DEG,ts.rz*DEG);
      meshes.torso.scale.set(Math.max(0.01,ts.sx),Math.max(0.01,ts.sy),Math.max(0.01,ts.sz));
    }

    const limbParts=["head","neck","upperArmL","lowerArmL","handL","upperArmR","lowerArmR","handR",
      "upperLegL","lowerLegL","footL","upperLegR","lowerLegR","footR","shoulder","hip"];
    limbParts.forEach(p=>{
      const s=parts[p],obj=meshes[p];
      if(!s||!obj)return;
      obj.rotation.set(s.rx*DEG,s.ry*DEG,s.rz*DEG);
    });

    const mOpen=parts.head?.mouthOpen||0;
    const mp=meshes.mouth;
    if(mp&&mp.userData){
      const{ul,ll,inner}=mp.userData;
      if(ul)ul.position.y=0.032+mOpen*0.18;
      if(ll)ll.position.y=-0.032-mOpen*0.18;
      if(inner)inner.scale.set(1,Math.max(0.01,mOpen*5),0.45);
    }
  } catch(e){ /* silent */ }
}
