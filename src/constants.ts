export const LAYER_TYPES = {
  AREA: "Area",
  CITY: "City",
  DISTRICT: "District",
  WARD: "Ward",
  FARMER: "Farmer",
  FIELD: "Field",
} as const;

export const MAP_TYPES = {
  SATELLITE: "satellite",
  HYBRID: "hybrid",
  TERRAIN: "terrain",
  ROADMAP: "roadmap",
} as const;

export const SETTING_PANELS = {
  LAYERS: "layersSetting",
  MAP: "mapSetting",
} as const;

export const COLORS = [
  "#F7FCF0",
  "#E0F3DB",
  "#CCEBC5",
  "#A8DDB5",
  "#BBF3FF",
  "#A1D9FF",
  "#87BFFF",
  "#6EA6E7",
  "#558DCE",
];

export const VIEW_ALL_CENTER = { lat: 0.6254335, lng: 112.3365166 };
