type MarkerData = Array<{
  id: string;
  position: google.maps.LatLngLiteral;
  type: "pin" | "html";
  zIndex: number;
}>;
import { NONG_HO } from "./nongho";

export function getData() {
  const data: MarkerData = [];

  // create 50 random markers
  for (let index = 0; index < NONG_HO.length; index++) {
    data.push({
      id: String(index),
      position: NONG_HO[index],
      zIndex: index,
      type: Math.random() < 0.5 ? "pin" : "html",
    });
  }

  return data;
}
