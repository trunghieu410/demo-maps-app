import { useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import { SingleMarker } from "./SingleMarker";
import { MarkerDataType } from "../../data";

export type ClusteredMarkersProps = {
  markersData: MarkerDataType[];
  isShow: boolean;
};

const ClusteredMarkers = ({ isShow, markersData }: ClusteredMarkersProps) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const [selectedMarkerKey, setSelectedMarkerKey] = useState<string | null>(
    null
  );

  const selectedMarker = useMemo(
    () =>
      markersData && selectedMarkerKey
        ? markersData.find((t) => t.key === selectedMarkerKey)!
        : null,
    [markersData, selectedMarkerKey]
  );

  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({ map });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    if (!isShow) {
      clusterer.clearMarkers();
      return;
    }

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));

    if (!selectedMarker) {
      map?.setCenter(markersData[0].position);
    }
  }, [clusterer, markers, isShow]);

  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers((markers) => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      if (marker) {
        return { ...markers, [key]: marker };
      } else {
        const { [key]: _, ...newMarkers } = markers;

        return newMarkers;
      }
    });
  }, []);

  // const handleInfoWindowClose = useCallback(() => {
  //   setSelectedMarkerKey(null);
  // }, []);

  const handleMarkerClick = useCallback((aMarker: MarkerDataType) => {
    setSelectedMarkerKey(aMarker.key);
  }, []);

  if (!isShow) {
    return null;
  }

  return (
    <>
      {markersData.map((data) => (
        <SingleMarker
          key={data.key}
          markerData={data}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
          isSelected={selectedMarker?.key === data.key}
        />
      ))}

      {/* {selectedMarkerKey && (
        <InfoWindow
          anchor={markers[selectedMarkerKey]}
          onCloseClick={handleInfoWindowClose}
        >
          {selectedMarker?.key}
        </InfoWindow>
      )} */}
    </>
  );
};

export default ClusteredMarkers;
