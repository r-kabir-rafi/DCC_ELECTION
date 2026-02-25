// A stable color generator based on string hash
export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777215)).toString(16);
  return '#' + '000000'.substring(0, 6 - color.length) + color;
};

// Predefined party colors for consistent styling
export const PARTY_COLORS: Record<string, string> = {
  'Party A': '#0ea5e9', // Blue
  'Party B': '#f43f5e', // Red
  'Party C': '#22c55e', // Green
  'Party D': '#eab308', // Yellow
  'Party E': '#d946ef', // Fuchsia
};

export const getPartyColor = (party: string) => {
  return PARTY_COLORS[party] || stringToColor(party);
};
