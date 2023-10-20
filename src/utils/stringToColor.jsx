export function stringToColor(s, saturation = 100, lightness = 75) {
  const hash = getHashCode(s);
  const hue = (hash % 120) * 3;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getHashCode(s) {
  let hash = 0;
  for (let i = 0; i < s.length; i += 1) {
      hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}