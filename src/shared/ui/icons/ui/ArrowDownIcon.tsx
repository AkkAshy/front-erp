import type { IconProps } from "../types";

const ArrowDownIcon = ({
  className,
  selected,
  width = 24,
  height = 24,
  rotate
}: IconProps) => {
  const style: React.CSSProperties = {
    rotate: selected ? "180deg" : "0deg",
    transition: "rotate 0.3s",
    width,
    height,
    transform: `rotate(${rotate}deg)`,
  };
  return (
    <svg
      style={style}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.92 8.94995L13.4 15.47C12.63 16.24 11.37 16.24 10.6 15.47L4.07996 8.94995"
        stroke="#8E51FF"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowDownIcon;
