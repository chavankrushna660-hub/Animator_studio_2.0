import React from "react";
import { SKIN_TONES, EYE_COLORS, HAIR_COLORS, DRESS_STYLES, DRESS_COLORS, BODY_PARTS } from "../constants";
import { SL, Sec, SkinSwatches, SwatchRow, Toggle, Row, colorPickStyle, TexSelect, Lbl } from "./ui";
import { defaultPartState } from "../utils";

export function BodyPanel({ char, updateBody, T }: any) {
  const b = char.body;
  return (
    <div>
      <Sec title="Body Shape" T={T}>
        <SkinSwatches val={b.skinTone} onChange={(v: string) => updateBody("skinTone", v)} T={T} SKIN_TONES={SKIN_TONES} />
        <SL label="Age" val={b.age} min={5} max={90} step={1} onChange={(v: number) => updateBody("age", v)} T={T} />
        <SL label="Height" val={b.height} min={0.5} max={2.0} step={0.01} onChange={(v: number) => updateBody("height", v)} T={T} />
        <SL label="Body Fat" val={b.bodyFat} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("bodyFat", v)} T={T} />
        <SL label="Muscle" val={b.muscle} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("muscle", v)} T={T} />
        <SL label="Shoulder Width" val={b.shoulderWidth} min={0.4} max={2.0} step={0.01} onChange={(v: number) => updateBody("shoulderWidth", v)} T={T} />
        <SL label="Shoulder Height" val={b.shoulderHeight} min={0.5} max={1.5} step={0.01} onChange={(v: number) => updateBody("shoulderHeight", v)} T={T} />
        <SL label="Chest Width" val={b.chestWidth} min={0.4} max={2.0} step={0.01} onChange={(v: number) => updateBody("chestWidth", v)} T={T} />
        <SL label="Waist Width" val={b.waistWidth} min={0.4} max={2.0} step={0.01} onChange={(v: number) => updateBody("waistWidth", v)} T={T} />
        <SL label="Hip Width" val={b.hipWidth} min={0.4} max={2.0} step={0.01} onChange={(v: number) => updateBody("hipWidth", v)} T={T} />
        <SL label="Hip Height" val={b.hipHeight} min={0.5} max={1.5} step={0.01} onChange={(v: number) => updateBody("hipHeight", v)} T={T} />
        <SL label="Belly Size" val={b.bellySize} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("bellySize", v)} T={T} />
        <SL label="Torso Length" val={b.torsoLength} min={0.5} max={2.0} step={0.01} onChange={(v: number) => updateBody("torsoLength", v)} T={T} />
        <SL label="Neck Length" val={b.neckLength} min={0.3} max={2.5} step={0.01} onChange={(v: number) => updateBody("neckLength", v)} T={T} />
        <SL label="Neck Thickness" val={b.neckThickness} min={0.3} max={2.5} step={0.01} onChange={(v: number) => updateBody("neckThickness", v)} T={T} />
      </Sec>
      <Sec title="Head & Face" T={T}>
        <SL label="Head Size" val={b.headSize} min={0.5} max={2.0} step={0.01} onChange={(v: number) => updateBody("headSize", v)} T={T} />
        <SL label="Head Width" val={b.headWidth} min={0.5} max={2.0} step={0.01} onChange={(v: number) => updateBody("headWidth", v)} T={T} />
        <SL label="Head Depth" val={b.headDepth} min={0.5} max={2.0} step={0.01} onChange={(v: number) => updateBody("headDepth", v)} T={T} />
        <SL label="Face Shape" val={b.faceShape} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("faceShape", v)} T={T} />
        <SL label="Arm Length" val={b.armLength} min={0.4} max={2.0} step={0.01} onChange={(v: number) => updateBody("armLength", v)} T={T} />
        <SL label="Bicep Thickness" val={b.bicepThickness} min={0.4} max={2.5} step={0.01} onChange={(v: number) => updateBody("bicepThickness", v)} T={T} />
        <SL label="Forearm Thickness" val={b.forearmThickness} min={0.4} max={2.5} step={0.01} onChange={(v: number) => updateBody("forearmThickness", v)} T={T} />
        <SL label="Leg Length" val={b.legLength} min={0.4} max={2.0} step={0.01} onChange={(v: number) => updateBody("legLength", v)} T={T} />
        <SL label="Thigh Thickness" val={b.thighThickness} min={0.4} max={2.5} step={0.01} onChange={(v: number) => updateBody("thighThickness", v)} T={T} />
        <SL label="Calf Thickness" val={b.calfThickness} min={0.4} max={2.5} step={0.01} onChange={(v: number) => updateBody("calfThickness", v)} T={T} />
        <SL label="Hand Size" val={b.handSize} min={0.3} max={2.0} step={0.01} onChange={(v: number) => updateBody("handSize", v)} T={T} />
        <SL label="Foot Size" val={b.footSize} min={0.3} max={2.0} step={0.01} onChange={(v: number) => updateBody("footSize", v)} T={T} />
      </Sec>
      <Sec title="Skin" T={T}>
        <SL label="Roughness" val={b.skinRoughness} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("skinRoughness", v)} T={T} />
        <SL label="Metalness" val={b.skinMetalness} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("skinMetalness", v)} T={T} />
        <SL label="Wetness" val={b.skinWetness} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("skinWetness", v)} T={T} />
        <Row T={T}>
          <span style={{ fontSize: 11, color: T.muted }}>Skin Color</span>
          <input type="color" value={b.skinTone} onChange={e => updateBody("skinTone", e.target.value)} style={colorPickStyle} />
        </Row>
      </Sec>
    </div>
  );
}

export function FacePanel({ char, updateBody, T }: any) {
  const b = char.body;
  return (
    <div>
      <Sec title="Head & Face Shape" T={T}>
        <SL label="Head Size" val={b.headSize} min={0.4} max={2.0} step={0.01} onChange={(v: number) => updateBody("headSize", v)} T={T} />
        <SL label="Head Width" val={b.headWidth} min={0.5} max={2.0} step={0.01} onChange={(v: number) => updateBody("headWidth", v)} T={T} />
        <SL label="Head Depth" val={b.headDepth} min={0.5} max={2.0} step={0.01} onChange={(v: number) => updateBody("headDepth", v)} T={T} />
        <SL label="Face Shape" val={b.faceShape} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("faceShape", v)} T={T} />
        <SL label="Jaw Width" val={b.jawWidth} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("jawWidth", v)} T={T} />
        <SL label="Chin Length" val={b.chinLength} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("chinLength", v)} T={T} />
      </Sec>
      <Sec title="Eyes" T={T}>
        <SL label="Eye Size" val={b.eyeSize} min={0.3} max={2.5} step={0.01} onChange={(v: number) => updateBody("eyeSize", v)} T={T} />
        <SL label="Eye Spacing" val={b.eyeSpacing} min={0.3} max={2.0} step={0.01} onChange={(v: number) => updateBody("eyeSpacing", v)} T={T} />
        <SwatchRow label="Eye Color" colors={EYE_COLORS} val={b.eyeColor} onChange={(v: string) => updateBody("eyeColor", v)} T={T} />
      </Sec>
      <Sec title="Eyebrows" T={T}>
        <SL label="Brow Thickness" val={b.eyebrowThickness} min={0} max={3} step={0.01} onChange={(v: number) => updateBody("eyebrowThickness", v)} T={T} />
        <SL label="Brow Angle" val={b.eyebrowAngle} min={-60} max={60} step={1} onChange={(v: number) => updateBody("eyebrowAngle", v)} T={T} />
      </Sec>
      <Sec title="Nose" T={T}>
        <SL label="Nose Size" val={b.noseSize} min={0.2} max={3.0} step={0.01} onChange={(v: number) => updateBody("noseSize", v)} T={T} />
        <SL label="Nose Height" val={b.noseHeight} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("noseHeight", v)} T={T} />
      </Sec>
      <Sec title="Mouth & Lips" T={T}>
        <SL label="Lip Size" val={b.lipSize} min={0.2} max={3.0} step={0.01} onChange={(v: number) => updateBody("lipSize", v)} T={T} />
        <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Lip Color</span>
          <input type="color" value={b.lipColor} onChange={e => updateBody("lipColor", e.target.value)} style={colorPickStyle} />
        </Row>
        <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Blush Color</span>
          <input type="color" value={b.blushColor} onChange={e => updateBody("blushColor", e.target.value)} style={colorPickStyle} />
        </Row>
        <SL label="Makeup Intensity" val={b.makeupIntensity} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("makeupIntensity", v)} T={T} />
      </Sec>
      <Sec title="Hair" T={T}>
        <SwatchRow label="Hair Color" colors={HAIR_COLORS} val={b.hairColor} onChange={(v: string) => updateBody("hairColor", v)} T={T} />
        <SL label="Hair Length" val={b.hairLength} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("hairLength", v)} T={T} />
        <SL label="Hair Style (0–4)" val={b.hairStyle} min={0} max={4} step={1} onChange={(v: number) => updateBody("hairStyle", v)} T={T} />
      </Sec>
      <Sec title="Facial Hair" T={T}>
        <Toggle label="Beard" val={b.hasBeard} onChange={(v: boolean) => updateBody("hasBeard", v)} T={T} />
        {b.hasBeard && <>
          <SL label="Beard Length" val={b.beardLength} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("beardLength", v)} T={T} />
          <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Beard Color</span>
            <input type="color" value={b.beardColor} onChange={e => updateBody("beardColor", e.target.value)} style={colorPickStyle} />
          </Row>
        </>}
        <Toggle label="Mustache" val={b.hasMustache} onChange={(v: boolean) => updateBody("hasMustache", v)} T={T} />
      </Sec>
      <Sec title="Extras & Details" T={T}>
        <Toggle label="Glasses" val={b.hasGlasses} onChange={(v: boolean) => updateBody("hasGlasses", v)} T={T} />
        <Toggle label="Wrinkles" val={b.hasWrinkles} onChange={(v: boolean) => updateBody("hasWrinkles", v)} T={T} />
        {b.hasWrinkles && <SL label="Wrinkle Intensity" val={b.wrinkleIntensity} min={0} max={1} step={0.01} onChange={(v: number) => updateBody("wrinkleIntensity", v)} T={T} />}
        <Toggle label="Earring" val={b.hasEarring} onChange={(v: boolean) => updateBody("hasEarring", v)} T={T} />
        <SL label="Ear Size" val={b.earSize} min={0} max={3} step={0.01} onChange={(v: number) => updateBody("earSize", v)} T={T} />
      </Sec>
    </div>
  );
}

export function DressPanel({ char, updateDress, T }: any) {
  const d = char.dress;
  return (
    <div>
      <Sec title="Style Preset" T={T}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {DRESS_STYLES.map(s => (
            <button key={s} onClick={() => updateDress("style", s)}
              style={{
                padding: "4px 8px", fontSize: 10, borderRadius: 6, cursor: "pointer", fontWeight: 600,
                background: d.style === s ? "#6d28d9" : T.btnBg,
                border: `1px solid ${d.style === s ? "#6d28d9" : T.border}`,
                color: d.style === s ? "#fff" : T.muted
              }}>
              {s}
            </button>
          ))}
        </div>
      </Sec>

      <Sec title="Shirt / Top" T={T}>
        <SwatchRow label="Color" colors={DRESS_COLORS} val={d.shirtColor} onChange={(v: string) => updateDress("shirtColor", v)} T={T} />
        <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Custom Color</span>
          <input type="color" value={d.shirtColor} onChange={e => updateDress("shirtColor", e.target.value)} style={colorPickStyle} />
        </Row>
        <TexSelect label="Fabric" val={d.shirtTexture} onChange={(v: string) => updateDress("shirtTexture", v)} T={T} />
        <SL label="Shirt Length" val={d.shirtLength} min={0.3} max={2.0} step={0.01} onChange={(v: number) => updateDress("shirtLength", v)} T={T} />
        <SL label="Shirt Width" val={d.shirtWidth} min={0.5} max={2.5} step={0.01} onChange={(v: number) => updateDress("shirtWidth", v)} T={T} />
        <SL label="Sleeve Length" val={d.shirtSleeveLength} min={0} max={1} step={0.01} onChange={(v: number) => updateDress("shirtSleeveLength", v)} T={T} />
        <SL label="Roughness" val={d.shirtRoughness} min={0} max={1} step={0.01} onChange={(v: number) => updateDress("shirtRoughness", v)} T={T} />
        <SL label="Sheen" val={d.clothSheen} min={0} max={1} step={0.01} onChange={(v: number) => updateDress("clothSheen", v)} T={T} />
        <SL label="Cloth Physics" val={d.clothPhysics} min={0} max={1} step={0.01} onChange={(v: number) => updateDress("clothPhysics", v)} T={T} />
      </Sec>

      <Sec title="Pants / Bottom" T={T}>
        <SwatchRow label="Color" colors={DRESS_COLORS} val={d.pantsColor} onChange={(v: string) => updateDress("pantsColor", v)} T={T} />
        <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Custom Color</span>
          <input type="color" value={d.pantsColor} onChange={e => updateDress("pantsColor", e.target.value)} style={colorPickStyle} />
        </Row>
        <TexSelect label="Fabric" val={d.pantsTexture} onChange={(v: string) => updateDress("pantsTexture", v)} T={T} />
        <SL label="Pants Width" val={d.pantsWidth} min={0.4} max={2.5} step={0.01} onChange={(v: number) => updateDress("pantsWidth", v)} T={T} />
        <SL label="Pants Length" val={d.pantsLength} min={0.3} max={2.0} step={0.01} onChange={(v: number) => updateDress("pantsLength", v)} T={T} />
        <SL label="Roughness" val={d.pantsRoughness} min={0} max={1} step={0.01} onChange={(v: number) => updateDress("pantsRoughness", v)} T={T} />
      </Sec>

      <Sec title="Shoes" T={T}>
        <SwatchRow label="Color" colors={DRESS_COLORS} val={d.shoeColor} onChange={(v: string) => updateDress("shoeColor", v)} T={T} />
        <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Custom Color</span>
          <input type="color" value={d.shoeColor} onChange={e => updateDress("shoeColor", e.target.value)} style={colorPickStyle} />
        </Row>
        <TexSelect label="Material" val={d.shoeTexture} onChange={(v: string) => updateDress("shoeTexture", v)} T={T} />
        <SL label="Heel Height" val={d.shoeHeight} min={0} max={1} step={0.01} onChange={(v: number) => updateDress("shoeHeight", v)} T={T} />
        <SL label="Shoe Size" val={d.shoeSize} min={0.5} max={2.0} step={0.01} onChange={(v: number) => updateDress("shoeSize", v)} T={T} />
      </Sec>

      <Sec title="Jacket" T={T}>
        <Toggle label="Has Jacket" val={d.hasJacket} onChange={(v: boolean) => updateDress("hasJacket", v)} T={T} />
        {d.hasJacket && <>
          <SwatchRow label="Color" colors={DRESS_COLORS} val={d.jacketColor} onChange={(v: string) => updateDress("jacketColor", v)} T={T} />
          <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Custom Color</span>
            <input type="color" value={d.jacketColor} onChange={e => updateDress("jacketColor", e.target.value)} style={colorPickStyle} />
          </Row>
          <TexSelect label="Material" val={d.jacketTexture} onChange={(v: string) => updateDress("jacketTexture", v)} T={T} />
          <SL label="Jacket Length" val={d.jacketLength} min={0.3} max={2.0} step={0.01} onChange={(v: number) => updateDress("jacketLength", v)} T={T} />
          <Toggle label="Open Jacket" val={d.jacketOpen} onChange={(v: boolean) => updateDress("jacketOpen", v)} T={T} />
        </>}
      </Sec>

      <Sec title="Accessories" T={T}>
        <Toggle label="Hat" val={d.hasHat} onChange={(v: boolean) => updateDress("hasHat", v)} T={T} />
        {d.hasHat && <>
          <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Hat Color</span>
            <input type="color" value={d.hatColor} onChange={e => updateDress("hatColor", e.target.value)} style={colorPickStyle} />
          </Row>
          <SL label="Hat Size" val={d.hatSize} min={0.5} max={2.0} step={0.01} onChange={(v: number) => updateDress("hatSize", v)} T={T} />
        </>}

        <Toggle label="Belt" val={d.hasBelt} onChange={(v: boolean) => updateDress("hasBelt", v)} T={T} />
        {d.hasBelt && <>
          <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Belt Color</span>
            <input type="color" value={d.beltColor} onChange={e => updateDress("beltColor", e.target.value)} style={colorPickStyle} />
          </Row>
          <SL label="Belt Width" val={d.beltWidth} min={0.1} max={1} step={0.01} onChange={(v: number) => updateDress("beltWidth", v)} T={T} />
        </>}

        <Toggle label="Gloves" val={d.hasGloves} onChange={(v: boolean) => updateDress("hasGloves", v)} T={T} />
        {d.hasGloves && <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Glove Color</span>
          <input type="color" value={d.gloveColor} onChange={e => updateDress("gloveColor", e.target.value)} style={colorPickStyle} />
        </Row>}

        <Toggle label="Scarf" val={d.hasScarf} onChange={(v: boolean) => updateDress("hasScarf", v)} T={T} />
        {d.hasScarf && <>
          <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Scarf Color</span>
            <input type="color" value={d.scarfColor} onChange={e => updateDress("scarfColor", e.target.value)} style={colorPickStyle} />
          </Row>
          <SL label="Scarf Length" val={d.scarfLength} min={0.1} max={1} step={0.01} onChange={(v: number) => updateDress("scarfLength", v)} T={T} />
        </>}

        <Toggle label="Tie" val={d.hasTie} onChange={(v: boolean) => updateDress("hasTie", v)} T={T} />
        {d.hasTie && <>
          <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Tie Color</span>
            <input type="color" value={d.tieColor} onChange={e => updateDress("tieColor", e.target.value)} style={colorPickStyle} />
          </Row>
          <SL label="Tie Width" val={d.tieWidth} min={0.2} max={1} step={0.01} onChange={(v: number) => updateDress("tieWidth", v)} T={T} />
        </>}

        <Toggle label="Glasses" val={d.hasGlasses} onChange={(v: boolean) => updateDress("hasGlasses", v)} T={T} />
      </Sec>

      <Sec title="Pattern & Effects" T={T}>
        <SL label="Pattern Scale" val={d.patternScale} min={0.1} max={3} step={0.1} onChange={(v: number) => updateDress("patternScale", v)} T={T} />
        <Toggle label="Glow Effect" val={d.accessoryGlow} onChange={(v: boolean) => updateDress("accessoryGlow", v)} T={T} />
        {d.accessoryGlow && <Row T={T}><span style={{ fontSize: 11, color: T.muted }}>Glow Color</span>
          <input type="color" value={d.accessoryGlowColor} onChange={e => updateDress("accessoryGlowColor", e.target.value)} style={colorPickStyle} />
        </Row>}
      </Sec>
    </div>
  );
}

export function PartsPanel({ char, selPart, setSelPart, partState, updatePart, frame, T }: any) {
  const isTorso = selPart === "torso";
  const isHead = selPart === "head";
  const ps = partState;

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <Lbl T={T}>Selected Part: <span style={{ color: T.accent, textTransform: "capitalize" }}>{selPart.replace(/([A-Z])/g, " $1").trim()}</span></Lbl>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, maxHeight: 120, overflow: "auto" }}>
          {BODY_PARTS.map(p => (
            <button key={p} onClick={() => setSelPart(p)}
              style={{
                fontSize: 9, padding: "2px 5px", borderRadius: 4, border: `1px solid ${selPart === p ? T.accent : T.border}`,
                background: selPart === p ? T.selBg : T.btnBg, color: selPart === p ? T.accent : T.muted, cursor: "pointer", fontWeight: 600
              }}>
              {p.replace(/([A-Z])/g, " $1").trim()}
            </button>
          ))}
        </div>
      </div>

      {isTorso && (
        <Sec title="Move (Character)" T={T}>
          <SL label="Left / Right (X)" val={ps.px} min={-20} max={20} step={0.1} onChange={(v: number) => updatePart("torso", "px", v)} T={T} />
          <SL label="Up / Down (Y)" val={ps.py} min={-8} max={8} step={0.1} onChange={(v: number) => updatePart("torso", "py", v)} T={T} />
          <SL label="Forward / Back (Z)" val={ps.pz} min={-20} max={20} step={0.1} onChange={(v: number) => updatePart("torso", "pz", v)} T={T} />
        </Sec>
      )}
      <Sec title="Rotation" T={T}>
        <SL label="Rotate X (Fwd/Back)" val={ps.rx} min={-180} max={180} onChange={(v: number) => updatePart(selPart, "rx", v)} T={T} />
        <SL label="Rotate Y (Twist)" val={ps.ry} min={-180} max={180} onChange={(v: number) => updatePart(selPart, "ry", v)} T={T} />
        <SL label="Rotate Z (Side)" val={ps.rz} min={-180} max={180} onChange={(v: number) => updatePart(selPart, "rz", v)} T={T} />
      </Sec>
      {isTorso && (
        <Sec title="Scale" T={T}>
          <SL label="Width (X)" val={ps.sx} min={0.1} max={3} step={0.05} onChange={(v: number) => updatePart("torso", "sx", v)} T={T} />
          <SL label="Height (Y)" val={ps.sy} min={0.1} max={3} step={0.05} onChange={(v: number) => updatePart("torso", "sy", v)} T={T} />
          <SL label="Depth (Z)" val={ps.sz} min={0.1} max={3} step={0.05} onChange={(v: number) => updatePart("torso", "sz", v)} T={T} />
        </Sec>
      )}
      {isHead && (
        <Sec title="Facial Expression" T={T}>
          <SL label="Mouth Open" val={ps.mouthOpen || 0} min={0} max={1} step={0.01} onChange={(v: number) => updatePart("head", "mouthOpen", v)} T={T} />
        </Sec>
      )}
      <Sec title="Color" T={T}>
        <Row T={T}>
          <span style={{ fontSize: 11, color: T.muted }}>Part Color</span>
          <input type="color" value={ps.color || "#cccccc"}
            onChange={e => updatePart(selPart, "color", e.target.value)} style={colorPickStyle} />
        </Row>
      </Sec>
    </div>
  );
}
