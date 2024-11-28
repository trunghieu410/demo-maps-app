import { NONG_HO } from "./nongho";

type MarkerDataType = {
  key: string;
  position: google.maps.LatLngLiteral;
};

export function getData() {
  const data: MarkerDataType[] = [];

  // create 50 random markers
  for (let index = 0; index < NONG_HO.length; index++) {
    data.push({
      key: String(index),
      position: NONG_HO[index],
    });
  }

  return data;
}

export { type MarkerDataType };
