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
  'Awami League': '#22c55e', // Green (AL's traditional color)
  'BNP': '#f43f5e',          // Red (BNP's traditional color)
  'Independent': '#6366f1',  // Indigo
  'Jatiya Party': '#eab308', // Yellow
  'Jamaat': '#f97316',       // Orange
};

export const getPartyColor = (party: string) => {
  return PARTY_COLORS[party] || stringToColor(party);
};
