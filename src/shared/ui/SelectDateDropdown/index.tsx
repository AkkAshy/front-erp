import type { FC } from "react";
// import styles from "./SelectDateDropdown.module.scss";

type DropdownProps = {
    value: number
    onChange?: (value: number) => void
    options?: { value: number; label: string }[]
  }

const SelectDateDropdown: FC<DropdownProps> = ({
  value,
  onChange,
  options,
}) => {
  if (!options) return null;
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
      className="myCustomSelect"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
export default SelectDateDropdown;
