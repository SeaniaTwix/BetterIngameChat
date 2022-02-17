function makeOneByte(char: string): number {
  return char.charCodeAt(0) ^ 0xFF00;
}

declare const TextDecoder;

const decoder = new TextDecoder();

export function translate(text: string): string {
  const arr = Array.from(text).map(makeOneByte);
  return decoder.decode(Uint8Array.from(arr));
}