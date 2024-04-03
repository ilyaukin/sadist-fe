export function getRandomId(len: number = 12) {
  let str = '';
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(97 + Math.floor(26 * Math.random()));
  }
  return str;
}
