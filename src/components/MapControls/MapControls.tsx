// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FC, useState, useCallback, ReactNode, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import * as topojson from "topojson";
import { THUA_DAT } from "../../nongho";
import hoangSaTruongSa from "../../geo-data/hoang-sa-truong-sa.json";
import { convertViToEn } from "../../utils";
import {
  CloseIcon,
  LayersIcon,
  SettingIcon,
  FullscreenIcon,
  PointerIcon,
  ZoomIn,
  ZoomOut,
} from "../Icons";

import "./MapControls.scss";
import SettingRow from "../SettingRow";
import ControlBtn from "../ControlBtn";
import RangeInput from "../RangeInput";
import ControlActions from "../ControlActions";

import classNames from "classnames";
// import diaphanhuyentopo from "../../geo-data/diaphanhuyen-topo.json";

import diaPhanTinhTopo from "../../geo-data/dia-phan-tinh.json";

import {
  // COLORS,
  LAYER_TYPES,
  MAP_TYPES,
  SETTING_PANELS,
  VIEW_ALL_CENTER,
} from "../../constants";

// const COLORS = [
//   "#F7FCF0",
//   "#E0F3DB",
//   "#CCEBC5",
//   "#A8DDB5",
//   "#BBF3FF",
//   "#A1D9FF",
//   "#87BFFF",
//   "#6EA6E7",
//   "#558DCE",
// ];

// const LAYER_TYPES = {
//   AREA: "Area",
//   CITY: "City",
//   DISTRICT: "District",
//   WARD: "Ward",
//   FARMER: "Farmer",
//   FIELD: "Field",
// } as const;

// const MAP_TYPES = {
//   SATELLITE: "satellite",
//   HYBRID: "hybrid",
//   TERRAIN: "terrain",
//   ROADMAP: "roadmap",
// } as const;

// const SETTING_PANELS = {
//   LAYERS: "layersSetting",
//   MAP: "mapSetting",
// } as const;

type Props = {
  toggleFarmerLayer: () => void;
  showProvinceDetail: (v: string) => void;
};

const INITIAL_ZOOM = 6;
const INITIAL_CENTER = {
  lat: 16.041173,
  lng: 106.644023,
};
const CAPITAL_CENTER = {
  lat: 21.460527,
  lng: 105.3493901,
};

const MapControls: FC<Props> = ({ toggleFarmerLayer, showProvinceDetail }) => {
  const map = useMap();
  const [mapTypeId, setMapTypeId] = useState(map?.getMapTypeId());
  const [showSettingContent, showSettingForType] = useState("");
  const [isShowLabels, setIsShowLabel] = useState(false);
  const tinhLayerData = useRef<google.maps.Data>();
  const huyenLayerData = useRef<google.maps.Data>();
  const fieldData = useRef<google.maps.Polygon>();

  const [activeLayers, setActiveLayers] = useState<string[]>([]);

  const toggleSettingPanel = useCallback(
    (type: string) => () => {
      showSettingForType(type);
    },
    []
  );

  const getSettingTitle = (type: string) => {
    if (type === SETTING_PANELS.MAP) return "Map settings";
    if (type === SETTING_PANELS.LAYERS) return "Data layers";
  };

  const addActiveLayer = (id) => setActiveLayers((v) => [...v, id]);
  const removeActiveLayer = (id) => {
    const filteredItems = activeLayers.filter((item) => item !== id);
    setActiveLayers(filteredItems);
  };

  console.log("====Render MapControls");

  const activeLayer = (layerType: string) => () => {
    if (!map) return;
    if (layerType === LAYER_TYPES.FIELD) {
      const isActivated = activeLayers.includes("Field");
      if (isActivated) {
        removeActiveLayer("Field");
        fieldData.current.setMap(null);
        fieldData.current = null;
      } else {
        addActiveLayer("Field");
        if (!fieldData.current) {
          fieldData.current = new google.maps.Polygon();
          fieldData.current.setPaths(THUA_DAT);
          fieldData.current.setMap(map);
        }
      }
      return;
    }
    if (layerType === LAYER_TYPES.FARMER) {
      const isActivated = activeLayers.includes("Farmer");
      if (isActivated) {
        removeActiveLayer("Farmer");
      } else {
        addActiveLayer("Farmer");
      }
      toggleFarmerLayer();
      return;
    }
    if (layerType === LAYER_TYPES.AREA) {
      map?.setZoom(6);
      map?.setCenter({
        lat: 16.041173,
        lng: 106.644023,
      });
      tinhLayerData.current?.setMap(null);
      huyenLayerData.current?.setMap(null);
      return;
    }
    if (layerType === LAYER_TYPES.CITY) {
      const isActivated = activeLayers.includes("City");
      console.log("==== isActivated ", isActivated);
      if (!map || isActivated) {
        console.log("==== isActivated remove");
        removeActiveLayer("City");
        tinhLayerData.current?.setMap(null);
        huyenLayerData.current?.setMap(null);
        huyenLayerData.current = null;
        return;
      }
      console.log("==== isActivated add");
      addActiveLayer("City");
      const tinhVietNam = topojson.feature(
        diaPhanTinhTopo,
        diaPhanTinhTopo.objects.states
      );
      window.dulitutinh = tinhVietNam;
      tinhLayerData.current = new google.maps.Data({
        map,
      });
      if (map?.getZoom() === INITIAL_ZOOM) {
        map.setZoom(8);
      }
      if (map.getCenter()?.lat() === INITIAL_CENTER.lat) {
        map.setCenter(CAPITAL_CENTER);
      }
      tinhLayerData.current.addGeoJson(tinhVietNam);
      tinhLayerData.current.addGeoJson(hoangSaTruongSa);
      tinhLayerData.current.setMap(map);

      tinhLayerData.current.setStyle(() => {
        return /** @type {!google.maps.Data.StyleOptions} */ {
          // fillColor: COLORS[(COLORS.length * Math.random()) | 0],"#F7FCF0"
          fillColor: "#F7FCF0",
          fillOpacity: 0.4,
          strokeColor: "black",
          strokeWeight: 1,
        };
      });

      tinhLayerData.current.addListener(
        "mouseover",
        (a: google.maps.Data.MouseEvent) => {
          console.log("===========on Tinh mouseover ", a);
          // tinhLayerData.current?.overrideStyle(a.feature, {
          //   fillColor: "red",
          // });
        }
      );

      tinhLayerData.current.addListener(
        "mouseout",
        (a: google.maps.Data.MouseEvent) => {
          tinhLayerData.current?.revertStyle(a.feature);
        }
      );

      tinhLayerData.current.addListener(
        "click",
        (a: google.maps.Data.MouseEvent) => {
          console.log("===========on Tinh click ", a.feature);

          // tinhLayerData.current?.overrideStyle(a.feature, { fillColor: "red" });

          if (!huyenLayerData.current) {
            huyenLayerData.current = new google.maps.Data({
              map,
            });
          }

          huyenLayerData.current.loadGeoJson(
            `https://raw.githubusercontent.com/trunghieu410/geo-data/refs/heads/main/du-lieu-huyen/${convertViToEn(
              a.feature.Fg.name
            )}.json`
          );
          showProvinceDetail(a.feature.Fg.name);
          huyenLayerData.current.setStyle(() => {
            return /** @type {!google.maps.Data.StyleOptions} */ {
              strokeWeight: 1,
              fillOpacity: 0.5,
              zIndex: 10000000000000,
            };
          });
          huyenLayerData.current.setMap(map);
          huyenLayerData.current.addListener(
            "click",
            (huyen: google.maps.Data.MouseEvent) => {
              console.log(
                "===========on Huyen click ",
                huyen.feature.Fg.Ten_Huyen
              );
              showProvinceDetail(
                `${a.feature.Fg.name}-${huyen.feature.Fg.Ten_Huyen}`
              );
            }
          );
        }
      );
      return;
    }
    if (layerType === LAYER_TYPES.DISTRICT) {
      const isActivated = activeLayers.includes(LAYER_TYPES.DISTRICT);
      console.log(
        "======onClick DISTRICT",
        isActivated,
        huyenLayerData.current
      );
      if (huyenLayerData.current || isActivated) {
        huyenLayerData.current.setMap(null);
        huyenLayerData.current = null;
        removeActiveLayer(LAYER_TYPES.DISTRICT);
        return;
      }
    }
  };

  const showLayerButton = (type) => {
    return (
      <div className="map-info__setting-row-btns">
        <button
          onClick={activeLayer(type)}
          className={classNames({
            "btn__control-setting": true,
          })}
        >
          {activeLayers.includes(type) ? "Hide" : "Show"}
        </button>
      </div>
    );
  };

  const renderLayersSetting = (): ReactNode => {
    if (showSettingContent !== SETTING_PANELS.LAYERS) {
      return null;
    }
    return (
      <>
        <SettingRow
          alignToExpandable
          title={LAYER_TYPES.AREA}
          rightContent={showLayerButton(LAYER_TYPES.AREA)}
        ></SettingRow>
        <SettingRow
          isExpandable
          title={LAYER_TYPES.CITY}
          rightContent={showLayerButton(LAYER_TYPES.CITY)}
        >
          <RangeInput
            label="Opacity"
            minValue={0}
            maxValue={1}
            minLabel={"0%"}
            maxLabel="100%"
            defaultValue={40}
            isDisabled={!activeLayers.includes(LAYER_TYPES.CITY)}
            onChange={(v) => {
              tinhLayerData.current.setStyle(() => {
                return /** @type {!google.maps.Data.StyleOptions} */ {
                  // fillColor: COLORS[(COLORS.length * Math.random()) | 0],"#F7FCF0"
                  fillColor: "#F7FCF0",
                  fillOpacity: v,
                  strokeColor: "black",
                  strokeWeight: 1,
                };
              });
            }}
          />
        </SettingRow>
        <SettingRow
          isExpandable
          title={LAYER_TYPES.DISTRICT}
          rightContent={
            <div className="map-info__setting-row-btns">
              <button
                onClick={activeLayer(LAYER_TYPES.DISTRICT)}
                className={classNames({
                  "btn__control-setting": true,
                })}
              >
                {activeLayers.includes(LAYER_TYPES.DISTRICT) ||
                !!huyenLayerData.current
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          }
        >
          <RangeInput
            label="Opacity"
            minValue={0}
            maxValue={1}
            minLabel={"0%"}
            maxLabel="100%"
            defaultValue={50}
            isDisabled={
              !activeLayers.includes(LAYER_TYPES.DISTRICT) &&
              !huyenLayerData.current
            }
            onChange={(v) => {
              huyenLayerData.current.setStyle(() => {
                return /** @type {!google.maps.Data.StyleOptions} */ {
                  strokeWeight: 1,
                  fillOpacity: v,
                  zIndex: 10000000000000,
                };
              });
            }}
          />
        </SettingRow>
        <SettingRow
          isExpandable
          title={LAYER_TYPES.WARD}
          rightContent={showLayerButton(LAYER_TYPES.WARD)}
        >
          {LAYER_TYPES.WARD}
        </SettingRow>
        <SettingRow
          isExpandable
          title={LAYER_TYPES.FARMER}
          rightContent={showLayerButton(LAYER_TYPES.FARMER)}
        >
          {LAYER_TYPES.FARMER}
        </SettingRow>
        <SettingRow
          isExpandable
          title={LAYER_TYPES.FIELD}
          rightContent={showLayerButton(LAYER_TYPES.FIELD)}
        >
          {LAYER_TYPES.FIELD}
        </SettingRow>
      </>
    );
  };

  const renderMapTypeSetting = (): ReactNode => {
    if (showSettingContent !== SETTING_PANELS.MAP) {
      return null;
    }
    return (
      <>
        <SettingRow
          title="Map style"
          rightContent={
            <div className="map-info__setting-row-btns">
              <button
                onClick={() => {
                  if (mapTypeId === MAP_TYPES.SATELLITE) {
                    return;
                  }
                  if (isShowLabels) {
                    map?.setMapTypeId(MAP_TYPES.HYBRID);
                    setMapTypeId(MAP_TYPES.HYBRID);
                    return;
                  }
                  map?.setMapTypeId(MAP_TYPES.SATELLITE);
                  setMapTypeId(MAP_TYPES.SATELLITE);
                }}
                className={classNames({
                  "btn__control-setting": true,
                  "btn__control-setting--active":
                    mapTypeId === MAP_TYPES.SATELLITE ||
                    mapTypeId === MAP_TYPES.HYBRID,
                })}
              >
                Satellite
              </button>
              <button
                onClick={() => {
                  if (mapTypeId === MAP_TYPES.TERRAIN) {
                    return;
                  }
                  map?.setMapTypeId(MAP_TYPES.TERRAIN);
                  setMapTypeId(MAP_TYPES.TERRAIN);
                }}
                className={classNames({
                  "btn__control-setting": true,
                  "btn__control-setting--active":
                    mapTypeId === MAP_TYPES.TERRAIN,
                })}
              >
                Terrain
              </button>
              <button
                onClick={() => {
                  if (mapTypeId === MAP_TYPES.ROADMAP) {
                    return;
                  }
                  map?.setMapTypeId(MAP_TYPES.ROADMAP);
                  setMapTypeId(MAP_TYPES.ROADMAP);
                }}
                className={classNames({
                  "btn__control-setting": true,
                  "btn__control-setting--active":
                    mapTypeId === MAP_TYPES.ROADMAP,
                })}
              >
                Roads
              </button>
            </div>
          }
        />
        <SettingRow
          title="Show map labels"
          rightContent={
            <label
              className={classNames({
                "map-info__switch": true,
                "map-info__switch--disabled":
                  mapTypeId !== MAP_TYPES.SATELLITE &&
                  mapTypeId !== MAP_TYPES.HYBRID,
              })}
            >
              <input
                type="checkbox"
                checked={mapTypeId === MAP_TYPES.HYBRID}
                disabled={
                  mapTypeId !== MAP_TYPES.SATELLITE &&
                  mapTypeId !== MAP_TYPES.HYBRID
                }
                onChange={(v) => {
                  if (v.target.checked) {
                    map?.setMapTypeId(MAP_TYPES.HYBRID);
                    setMapTypeId(MAP_TYPES.HYBRID);
                  } else {
                    map?.setMapTypeId(MAP_TYPES.SATELLITE);
                    setMapTypeId(MAP_TYPES.SATELLITE);
                  }
                  setIsShowLabel(v.target.checked);
                }}
              />
              <span className="map-info__slider map-info__round"></span>
            </label>
          }
        />
      </>
    );
  };

  return (
    <>
      <ControlActions toggleSettingPanel={toggleSettingPanel} />
      <div
        className="map-info__controls-content"
        style={{
          width: showSettingContent ? "336px" : "0",
          visibility: showSettingContent ? "inherit" : "hidden",
        }}
      >
        <SettingRow
          isHeading
          title={getSettingTitle(showSettingContent)}
          rightContent={
            <button
              className="btn__control-setting"
              onClick={toggleSettingPanel("")}
            >
              <CloseIcon /> Close
            </button>
          }
        />
        {renderMapTypeSetting()}
        {renderLayersSetting()}
      </div>
    </>
  );
};

export default MapControls;
