import { BODY_PARTS } from "./constants";
import { defaultBodyProps, defaultDressProps, defaultPartState } from "./utils";

export function makeCharState(isFemale = false) {
  const skinTone = isFemale ? "#f4a261" : "#e0ac69";
  const clothCol = isFemale ? "#c2185b" : "#1565c0";
  const hairCol  = isFemale ? "#2b2b2b" : "#3a2e24";
  const parts: any = {};
  BODY_PARTS.forEach(p => {
    let c = skinTone;
    if (["hair","eyebrowL","eyebrowR"].includes(p)) c = hairCol;
    else if (["eyeL","eyeR"].includes(p)) c = "#ffffff";
    else if (p === "mouth") c = isFemale ? "#e57373" : "#bf8070";
    else if (["nose","cheekL","cheekR"].includes(p)) c = isFemale ? "#d97754" : "#c28553";
    else if (["beard","mustache"].includes(p)) c = hairCol;
    else if (p === "wrinkles") c = "#c8a070";
    else if (p === "glasses") c = "#222";
    parts[p] = defaultPartState(c);
  });
  return {
    parts,
    body: { ...defaultBodyProps(), skinTone, hairColor: hairCol,
      lipColor: isFemale ? "#e57373" : "#bf8070",
      eyeColor: isFemale ? "#6a1b9a" : "#2e7d32" },
    dress: { ...defaultDressProps(), shirtColor: clothCol,
      pantsColor: isFemale ? "#880e4f" : "#37474f" },
  };
}
