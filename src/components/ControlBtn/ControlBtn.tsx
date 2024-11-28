import { FC, memo } from "react";

import "./ControlBtn.scss";

type Props = {
  icon: () => JSX.Element;
  tooltip: string;
  onClick: () => void;
};

const ControlBtn: FC<Props> = ({ icon: Icon, onClick, tooltip }) => {
  return (
    <button onClick={onClick}>
      <Icon />
      <div className="btn__tooltip-text">{tooltip}</div>
    </button>
  );
};
export default memo(ControlBtn);
