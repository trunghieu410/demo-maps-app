import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { GoogleMapsContext } from "@vis.gl/react-google-maps";

import type { Ref } from "react";
// import { THUA_DAT } from "../nongho";

// import * as topojson from "topojson";

// import diaPhanTinhTopo from "../geo-data/dia-phan-tinh.json";
// import huyenVietNamTopo from "../geo-data/diaphanhuyen-topo.json";
// import hoangSaTruongSa from "../geo-data/hoang-sa-truong-sa.json";

// import huyenVietNam from "../geo-data/diaphanhuyen.json";
// import caMau from "../geo-data/du-lieu-huyen/ca-mau.json";
// import bacLieu from "../geo-data/du-lieu-huyen/bac-lieu.json";
// import dataXa from "../geo-data/dataxa.json";

type PolygonEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
};

type PolygonCustomProps = {
  /**
   * this is an encoded string for the path, will be decoded and used as a path
   */
  encodedPaths?: string[];
};

export type PolygonProps = google.maps.PolygonOptions &
  PolygonEventProps &
  PolygonCustomProps;

export type PolygonRef = Ref<google.maps.Polygon | null>;
const COLORS = [
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
function usePolygon(props: PolygonProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    ...polygonOptions
  } = props;
  // This is here to avoid triggering the useEffect below when the callbacks change (which happen if the user didn't memoize them)
  const callbacks = useRef<Record<string, (e: unknown) => void>>({});
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
  });

  // const geometryLibrary = useMapsLibrary("geometry");

  const polygon = useRef(new google.maps.Polygon()).current;
  const polygonHuyen = useRef(new google.maps.Polygon()).current;
  // update PolygonOptions (note the dependencies aren't properly checked
  // here, we just assume that setOptions is smart enough to not waste a
  // lot of time updating values that didn't change)
  useMemo(() => {
    polygon.setOptions(polygonOptions);
    polygonHuyen.setOptions(polygonOptions);
  }, [polygon, polygonHuyen, polygonOptions]);

  const map = useContext(GoogleMapsContext)?.map;
  console.log("=====polygon map ", map);
  // update the path with the encodedPath

  useMemo(() => {
    // const tinhVietNam = topojson.feature(
    //   diaPhanTinhTopo,
    //   diaPhanTinhTopo.objects.states
    // );
    // map?.data.addGeoJson(tinhVietNam);
    // map?.data.addGeoJson(hoangSaTruongSa);

    // const huyenVietNamTopoToGeo = topojson.feature(
    //   huyenVietNamTopo,
    //   huyenVietNamTopo.objects.collection
    // );
    // map?.data.addGeoJson(huyenVietNamTopoToGeo);

    // map?.data.addGeoJson(huyenVietNam);

    // const xaVietNam = topojson.feature(dataXa, dataXa.objects.adm4);
    // map?.data.addGeoJson(xaVietNam);

    // map?.data.addListener("mouseover", function (evt) {
    //   console.log("====== ", evt);
    // });
    // if (!encodedPaths || !geometryLibrary) return;
    // const paths = encodedPaths.map((path) =>
    //   geometryLibrary.encoding.decodePath(path)
    // );
    // polygon.setPaths(THUA_DAT);
    // polygon.setPaths(gepjson);
    map?.data.setStyle(() => {
      // console.log("==== setStyle", feature);
      return /** @type {!google.maps.Data.StyleOptions} */ {
        fillColor: COLORS[(COLORS.length * Math.random()) | 0],
        fillOpacity: 0.2,
        strokeColor: "black",
        strokeWeight: 1,
      };
    });
  }, [polygon]);

  useEffect(() => {
    // console.log("===========ADD addListener mouseover ");
    // map?.data.addListener("click", (a) => {
    //   console.log(
    //     "===========addListener mouseover ",
    //     a,
    //     { lat: a.latLng.lat(), lng: a.latLng.lng() }
    //     // map.getBounds()?.contains()
    //   );
    //   // setPolygonHuyen(a.feature.Fg.name);
    //   map.data.overrideStyle(a.feature, { fillColor: "red" });
    //   map.data.revertStyle(a.feature);
    //   const aa = map.data.addGeoJson(caMau);
    //   console.log('====="aaaaaa  ', aa);
    // });
  }, []);

  // create polygon instance and add to the map once the map is available
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error("<Polygon> has to be inside a Map component.");

      return;
    }

    polygon.setMap(map);

    return () => {
      polygon.setMap(null);
    };
  }, [map]);
  console.log("=====re-render Polygon");
  return polygon;
}

/**
 * Component to render a polygon on a map
 */
export const Polygon = forwardRef((props: PolygonProps, ref: PolygonRef) => {
  const polygon = usePolygon(props);

  useImperativeHandle(ref, () => polygon, []);

  return null;
});
