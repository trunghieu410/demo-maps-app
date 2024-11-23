import "./App.scss";
import { useState, useCallback, Fragment } from "react";
import SettingIcon from "./components/Icons/SettingIcon";
import LayersIcon from "./components/Icons/LayersIcon";
import FullscreenIcon from "./components/Icons/FullscreenIcon";
import LessthanIcon from "./components/Icons/LessthanIcon";
import PointerIcon from "./components/Icons/PointerIcon";

import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  AdvancedMarkerProps,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
  CollisionBehavior,
} from "@vis.gl/react-google-maps";
import { getData } from "./data";

const API_KEY = "";

// const INITIAL_CENTER = { lat: 10.0910830343111, lng: 106.469711617486 };
export type AnchorPointName = keyof typeof AdvancedMarkerAnchorPoint;

const data = getData()
  .sort((a, b) => b.position.lat - a.position.lat)
  .map((dataItem, index) => ({ ...dataItem, zIndex: index }));

const Z_INDEX_SELECTED = data.length;
const Z_INDEX_HOVER = data.length + 1;
const INITIAL_CENTER = { lat: 10.0910830343111, lng: 106.469711617486 };

function App() {
  const [userLocation, setUserLocation] = useState(INITIAL_CENTER);

  const [isLeftExpanded, setLeftExpanded] = useState(true);

  const [markers] = useState(data);

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const anchorPoint = "BOTTOM" as AnchorPointName;
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          console.log("======{ latitude, longitude } ", {
            latitude,
            longitude,
          });
          setUserLocation({ lat: latitude, lng: longitude });
        },
        // if there was an error getting the users location
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const onMouseEnter = useCallback((id: string | null) => setHoverId(id), []);
  const onMouseLeave = useCallback(() => setHoverId(null), []);
  const onMarkerClick = useCallback(
    (id: string | null, marker?: google.maps.marker.AdvancedMarkerElement) => {
      setSelectedId(id);

      if (marker) {
        setSelectedMarker(marker);
      }

      if (id !== selectedId) {
        setInfoWindowShown(true);
      } else {
        setInfoWindowShown((isShown) => !isShown);
      }
      setLeftExpanded((v) => !v);
    },
    [selectedId]
  );

  const onMapClick = useCallback(() => {
    setSelectedId(null);
    setSelectedMarker(null);
    setInfoWindowShown(false);
  }, []);

  const handleInfowindowCloseClick = useCallback(
    () => setInfoWindowShown(false),
    []
  );

  return (
    <div className="page-container">
      <div
        className="page-container__side-info"
        style={{ width: isLeftExpanded ? "400px" : "0" }}
      ></div>
      <div
        className="page-container__map-info map-info"
        style={{
          width: isLeftExpanded ? "calc(100% - 415px)" : "calc(100% - 15px)",
        }}
      >
        <div className="map-info__controls">
          <button>
            <LayersIcon />
          </button>
          <button>
            <SettingIcon />
          </button>
          <button>
            <FullscreenIcon />
          </button>
          <button onClick={getUserLocation}>
            <PointerIcon />
          </button>
        </div>

        {isLeftExpanded && (
          <div className="map-info__side-info-control">
            <button onClick={() => setLeftExpanded((v) => !v)}>
              <LessthanIcon />
            </button>
          </div>
        )}

        {renderMapContent()}
      </div>
    </div>
  );

  function renderMapContent() {
    console.log("======");
    return (
      <APIProvider apiKey={API_KEY} libraries={["marker"]}>
        <Map
          mapId={"bf51a910020fa25a"}
          defaultZoom={12}
          defaultCenter={userLocation}
          center={userLocation}
          gestureHandling={"greedy"}
          onClick={onMapClick}
          clickableIcons={false}
          disableDefaultUI
        >
          {markers.map(({ id, zIndex: zIndexDefault, position, type }) => {
            let zIndex = zIndexDefault;

            if (hoverId === id) {
              zIndex = Z_INDEX_HOVER;
            }

            if (selectedId === id) {
              zIndex = Z_INDEX_SELECTED;
            }

            if (type === "pin") {
              return (
                <AdvancedMarkerWithRef
                  onMarkerClick={(
                    marker: google.maps.marker.AdvancedMarkerElement
                  ) => onMarkerClick(id, marker)}
                  onMouseEnter={() => onMouseEnter(id)}
                  onMouseLeave={onMouseLeave}
                  key={id}
                  zIndex={zIndex}
                  className="custom-marker"
                  style={{
                    transform: `scale(${
                      [hoverId, selectedId].includes(id) ? 1.3 : 1
                    })`,
                    transformOrigin:
                      AdvancedMarkerAnchorPoint["BOTTOM"].join(" "),
                  }}
                  position={position}
                >
                  <Pin
                    background={selectedId === id ? "#22ccff" : null}
                    borderColor={selectedId === id ? "#1e89a1" : null}
                    glyphColor={selectedId === id ? "#0f677a" : null}
                  />
                </AdvancedMarkerWithRef>
              );
            }

            if (type === "html") {
              return (
                <Fragment key={id}>
                  <AdvancedMarkerWithRef
                    position={position}
                    zIndex={zIndex}
                    anchorPoint={AdvancedMarkerAnchorPoint[anchorPoint]}
                    className="custom-marker"
                    style={{
                      transform: `scale(${
                        [hoverId, selectedId].includes(id) ? 1.3 : 1
                      })`,
                      transformOrigin:
                        AdvancedMarkerAnchorPoint[anchorPoint].join(" "),
                    }}
                    onMarkerClick={(
                      marker: google.maps.marker.AdvancedMarkerElement
                    ) => onMarkerClick(id, marker)}
                    onMouseEnter={() => onMouseEnter(id)}
                    collisionBehavior={
                      CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
                    }
                    onMouseLeave={onMouseLeave}
                  >
                    <div
                      className={`custom-html-content ${
                        selectedId === id ? "selected" : ""
                      }`}
                    ></div>
                  </AdvancedMarkerWithRef>

                  {/* anchor point visualization marker */}
                  <AdvancedMarkerWithRef
                    onMarkerClick={(
                      marker: google.maps.marker.AdvancedMarkerElement
                    ) => onMarkerClick(id, marker)}
                    zIndex={zIndex + 1}
                    onMouseEnter={() => onMouseEnter(id)}
                    onMouseLeave={onMouseLeave}
                    anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                    position={position}
                  >
                    <div className="visualization-marker"></div>
                  </AdvancedMarkerWithRef>
                </Fragment>
              );
            }
          })}

          {infoWindowShown && selectedMarker && (
            <InfoWindow
              anchor={selectedMarker}
              pixelOffset={[0, -2]}
              onCloseClick={handleInfowindowCloseClick}
            >
              <h2>Marker {selectedId}</h2>
              <p>Some arbitrary html to be rendered into the InfoWindow.</p>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    );
  }
}

export const AdvancedMarkerWithRef = (
  props: AdvancedMarkerProps & {
    onMarkerClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  }
) => {
  const { children, onMarkerClick, ...advancedMarkerProps } = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      ref={markerRef}
      {...advancedMarkerProps}
    >
      {children}
    </AdvancedMarker>
  );
};

export default App;
