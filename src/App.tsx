import "./App.scss";
import { useState, useCallback } from "react";
import MapControls from "./components/MapControls";
import { LessthanIcon } from "./components/Icons";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MarkerDataType, getData } from "./data";
import ClusteredMarkers from "./components/ClusteredMarkers";

const API_KEY = "";

const data = getData();

const INITIAL_ZOOM = 6;
const INITIAL_CENTER = {
  lat: 16.041173,
  lng: 106.644023,
};

const restriction = {
  latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
  strictBounds: true,
};
// const VIEW_ALL_CENTER = { lat: 16.0530144, lng: 105.7314507 };

function App() {
  const [mapZoom, setMapZoom] = useState(INITIAL_ZOOM);
  const [isLeftExpanded, setLeftExpanded] = useState("");
  const [isShowLayerFarmer, setShowLayerFarmer] = useState(false);
  const [markers] = useState<MarkerDataType[]>(data);

  const onMapClick = useCallback(() => {}, []);

  const toggleFarmerLayer = useCallback(() => {
    setShowLayerFarmer((v) => !v);
  }, []);

  console.log("====isLeftExpanded RENDER", isLeftExpanded);

  return (
    <div className="page-container">
      <div
        className="page-container__side-info"
        style={{
          width: isLeftExpanded ? "400px" : "0",
          paddingRight: isLeftExpanded ? "20px" : 0,
        }}
      >
        <div className="page-container__side-info-content">
          {isLeftExpanded}
        </div>
      </div>

      <div
        className="page-container__map-info map-info"
        style={{
          width: isLeftExpanded ? "calc(100% - 400px)" : "100%",
        }}
      >
        <APIProvider apiKey={API_KEY}>
          <Map
            mapId={"bf51a910020fa25a"}
            onZoomChanged={({ detail }) => {
              setMapZoom(Math.max(2.6, detail.zoom));
            }}
            zoom={mapZoom}
            defaultCenter={INITIAL_CENTER}
            gestureHandling={"greedy"}
            onClick={onMapClick}
            clickableIcons={false}
            disableDefaultUI
            restriction={restriction}
          >
            <MapControls
              toggleFarmerLayer={toggleFarmerLayer}
              showProvinceDetail={(v) => setLeftExpanded(v)}
            />

            {isLeftExpanded && (
              <div className="map-info__side-info-close-btn">
                <button onClick={() => setLeftExpanded("")}>
                  <LessthanIcon />
                </button>
              </div>
            )}

            <ClusteredMarkers
              isShow={isShowLayerFarmer}
              markersData={markers}
            />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}

export default App;
