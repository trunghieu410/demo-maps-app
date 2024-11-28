import type { Marker } from "@googlemaps/markerclusterer";
import { useCallback } from "react";
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { MarkerDataType } from "../../data";

export type SingleMarkerProps = {
  markerData: MarkerDataType;
  isSelected: boolean;
  onClick: (t: MarkerDataType) => void;
  setMarkerRef: (m: Marker | null, k: string) => void;
};

export const SingleMarker = (props: SingleMarkerProps) => {
  const { isSelected, markerData, onClick, setMarkerRef } = props;

  const handleClick = useCallback(
    () => onClick(markerData),
    [onClick, markerData]
  );

  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) =>
      setMarkerRef(marker, markerData.key),
    [setMarkerRef, markerData.key]
  );

  const pinProps = isSelected
    ? {
        background: "#22ccff",
        borderColor: "#1e89a1",
        glyphColor: "#0f677a",
      }
    : {};

  return (
    <AdvancedMarker
      position={markerData.position}
      ref={ref}
      onClick={handleClick}
    >
      <Pin {...pinProps}></Pin>
    </AdvancedMarker>
  );
};
