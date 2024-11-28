import { FC, useCallback, useState } from "react";

import "./ControlActions.scss";
import ControlBtn from "../ControlBtn";

import {
  LayersIcon,
  SettingIcon,
  FullscreenIcon,
  PointerIcon,
  ZoomIn,
  ZoomOut,
  InfoIcon,
  CloseXIcon,
} from "../Icons";

import { SETTING_PANELS, VIEW_ALL_CENTER } from "../../constants";
import { useMap } from "@vis.gl/react-google-maps";

type Props = {
  toggleSettingPanel: (type: string) => void;
};

const ControlActions: FC<Props> = ({ toggleSettingPanel }) => {
  const map = useMap();
  const [showNoti, setShowNoti] = useState(false);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setShowNoti(true);
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map?.setCenter({ lat: latitude, lng: longitude });
        map?.setZoom(10);
      },
      () => setShowNoti(true)
    );
  }, []);

  const handleZoomChange = useCallback(
    (to: number) => () => {
      const currZoom = map?.getZoom() as number;
      const zoomTo = currZoom + to;
      if (zoomTo < 2.6 || zoomTo > 22) {
        return;
      }
      map?.setZoom(zoomTo);
    },
    []
  );

  return (
    <>
      {showNoti && (
        <div
          className="page-container__notification"
          onClick={() => setShowNoti(false)}
        >
          <InfoIcon />
          <div className="page-container__notification-text">
            We do not have permission to use your location.
          </div>
          <CloseXIcon />
        </div>
      )}
      <div className="map-info__controls">
        <ControlBtn
          icon={LayersIcon}
          tooltip="Toggle data layers"
          onClick={toggleSettingPanel(SETTING_PANELS.LAYERS)}
        />
        <ControlBtn
          icon={SettingIcon}
          tooltip="Map settings"
          onClick={toggleSettingPanel(SETTING_PANELS.MAP)}
        />
        <ControlBtn
          icon={FullscreenIcon}
          tooltip="View All"
          onClick={() => {
            map?.setZoom(3);
            map?.setCenter(VIEW_ALL_CENTER);
          }}
        />
        <ControlBtn
          icon={PointerIcon}
          tooltip="Around me"
          onClick={getUserLocation}
        />
        <div className="btn__zoom-group">
          <ControlBtn
            icon={ZoomIn}
            tooltip="Zoom In"
            onClick={handleZoomChange(0.5)}
          />
          <ControlBtn
            icon={ZoomOut}
            tooltip="Zoom Out"
            onClick={handleZoomChange(-0.5)}
          />
        </div>
      </div>
    </>
  );
};
export default ControlActions;
