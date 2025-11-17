import type { IconProps } from "../types";

const LineDashedIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      width="248"
      height="2"
      viewBox="0 0 248 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        y1="1"
        x2="248"
        y2="1"
        stroke="#C4B4FF"
        strokeWidth="2"
        strokeDasharray="12 12"
      />
    </svg>
  );
};

export default LineDashedIcon;
