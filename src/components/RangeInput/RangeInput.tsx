import { FC } from "react";

import "./RangeInput.scss";
import classNames from "classnames";

type Props = {
  label: string;
  minValue: number;
  maxValue: number;
  minLabel: string;
  maxLabel: string;
  isDisabled: boolean;
  defaultValue?: number;
  onChange?: (v: number) => void;
};

const RangeInput: FC<Props> = ({
  onChange,
  isDisabled,
  label,
  minLabel,
  maxLabel,
  maxValue,
  defaultValue,
}) => {
  const disableProps = isDisabled ? { disabled: true } : {};

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValueByPercent = e.target.valueAsNumber;
    const newValue = (newValueByPercent / 100) * maxValue;

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="range-input-container">
      <label className="hide-label" htmlFor="range-input">
        {" "}
        {label}{" "}
      </label>
      <input
        {...disableProps}
        type="range"
        defaultValue={defaultValue}
        className={classNames({
          "range-input": true,
          "range-input--disabled": isDisabled,
        })}
        onChange={onValueChange}
      />
      <div className="type-unit-range">
        <label className="left" htmlFor="range-input">
          {" "}
          {minLabel}{" "}
        </label>
        <label className="right" htmlFor="range-input">
          {" "}
          {maxLabel}{" "}
        </label>
      </div>
    </div>
  );
};
export default RangeInput;
