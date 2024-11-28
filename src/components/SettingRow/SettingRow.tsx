import { FC, ReactNode, useState } from "react";
import classNames from "classnames";
import { ExpandIcon } from "../Icons";

type Props = {
  title: string;
  isHeading?: boolean;
  isExpandable?: boolean;
  rightContent: JSX.Element;
  children?: ReactNode;
  alignToExpandable?: boolean;
};

const SettingRow: FC<Props> = ({
  isExpandable,
  rightContent,
  isHeading,
  title,
  children,
  alignToExpandable,
}) => {
  const [expanded, setExpanded] = useState(false);

  const iconExpandClass = classNames({
    "map-info__setting-row-expander": true,
    "map-info__setting-row-expander--active": expanded,
  });

  const renderTitle = () => {
    if (isHeading) {
      return <div className="map-info__setting-row--heading">{title}</div>;
    }
    if (isExpandable) {
      return (
        <div
          className={iconExpandClass}
          onClick={() => {
            setExpanded((v) => !v);
          }}
        >
          <ExpandIcon />
          <span
            className="map-info__setting-row--none-heading"
            style={{ fontSize: "13px" }}
          >
            {title}
          </span>
        </div>
      );
    }
    return (
      <span
        className="map-info__setting-row--none-heading"
        style={{ marginLeft: alignToExpandable ? "30px" : "0" }}
      >
        {title}
      </span>
    );
  };
  return (
    <div className="map-info__setting-row-wrapper">
      <div className="map-info__setting-row">
        {renderTitle()}
        <div className="map-info__setting-row-content">{rightContent}</div>
      </div>
      {expanded && (
        <div className="map-info__setting-row-expanded-content">{children}</div>
      )}
    </div>
  );
};
export default SettingRow;
