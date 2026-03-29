export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const uid = () => Math.random().toString(36).slice(2, 9);
export const clamp = (v: number, mn: number, mx: number) => Math.min(mx, Math.max(mn, v));

export function defaultBodyProps() {
  return {
    age: 25, height: 1.0, bodyFat: 0.5, muscle: 0.5, 
    shoulderWidth: 1.0, chestWidth: 1.0, waistWidth: 1.0, hipWidth: 1.0, neckLength: 1.0,
    shoulderHeight: 1.0, hipHeight: 1.0, neckThickness: 1.0,
    headSize: 1.0, headWidth: 1.0, headDepth: 1.0, faceShape: 0.5, jawWidth: 0.5,
    eyeSize: 1.0, eyeSpacing: 1.0, noseSize: 1.0, noseHeight: 0.5,
    lipSize: 1.0, earSize: 1.0, chinLength: 0.5,
    legLength: 1.0, armLength: 1.0, handSize: 1.0, footSize: 1.0,
    thighThickness: 1.0, calfThickness: 1.0, forearmThickness: 1.0, bicepThickness: 1.0,
    torsoLength: 1.0, bellySize: 0.0,
    skinTone: "#e0ac69", skinTexture: "flat", skinRoughness: 0.6,
    skinMetalness: 0.0, skinWetness: 0.0,
    hairColor: "#3a2e24", hairStyle: 0, hairLength: 0.5,
    eyeColor: "#2e7d32", eyebrowThickness: 1.0, eyebrowAngle: 0,
    hasBeard: false, beardLength: 0.3, beardColor: "#3a2e24",
    hasMustache: false, mustacheStyle: 0,
    hasWrinkles: false, wrinkleIntensity: 0.5,
    hasGlasses: false, glassesStyle: 0,
    hasEarring: false, makeupIntensity: 0.0,
    blushColor: "#f7a0a0", lipColor: "#e57373",
  };
}

export function defaultDressProps() {
  return {
    style: "casual",
    shirtColor: "#1565c0", shirtTexture: "fabric", shirtRoughness: 0.8,
    shirtLength: 1.0, shirtWidth: 1.0, shirtCollarType: 0, shirtSleeveLength: 1.0,
    pantsColor: "#37474f", pantsTexture: "denim", pantsRoughness: 0.7,
    pantsWidth: 1.0, pantsLength: 1.0, pantsCutStyle: 0,
    shoeColor: "#1a1a1a", shoeTexture: "leather", shoeHeight: 0.3,
    shoeSize: 1.0, shoeStyle: 0,
    hasJacket: false, jacketColor: "#212121", jacketTexture: "leather",
    jacketLength: 1.0, jacketOpen: true,
    hasBelt: false, beltColor: "#4a2912", beltWidth: 0.5,
    hasHat: false, hatColor: "#37474f", hatStyle: 0, hatSize: 1.0,
    hasGloves: false, gloveColor: "#1a1a1a",
    hasScarf: false, scarfColor: "#c2185b", scarfLength: 0.5,
    hasTie: false, tieColor: "#880e4f", tieWidth: 0.5,
    overallPattern: 0, patternScale: 1.0,
    clothPhysics: 0.5, clothSheen: 0.3,
    accessoryGlow: false, accessoryGlowColor: "#60a5fa",
  };
}

export function defaultPartState(color = "#cccccc") {
  return { rx:0,ry:0,rz:0, px:0,py:0,pz:0, sx:1,sy:1,sz:1, mouthOpen:0, color };
}
