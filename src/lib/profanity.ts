const BAD_WORDS = [
  "idiota", "burro", "burra", "imbecil", "otario", "otária", "otaria",
  "merda", "porra", "caralho", "vagabundo", "vagabunda", "lixo",
  "retardado", "retardada", "viado", "bicha", "cuzao", "cuzão",
  "arrombado", "filho da puta", "fdp", "puta", "desgracado", "desgraçado",
];

const PATTERN = new RegExp(
  "\\b(" + BAD_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")\\b",
  "i",
);

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  return PATTERN.test(text.normalize("NFC"));
}