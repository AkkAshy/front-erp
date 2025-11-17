import type { IconProps } from "../types";

const ClockIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 10V15L18.125 18.125"
        stroke="#8E51FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 15C2.5 9.10744 2.5 6.16117 4.33058 4.33058C6.16117 2.5 9.10744 2.5 15 2.5C20.8926 2.5 23.8388 2.5 25.6694 4.33058C27.5 6.16117 27.5 9.10744 27.5 15C27.5 20.8926 27.5 23.8388 25.6694 25.6694C23.8388 27.5 20.8926 27.5 15 27.5C9.10744 27.5 6.16117 27.5 4.33058 25.6694C2.5 23.8388 2.5 20.8926 2.5 15Z"
        stroke="#8E51FF"
        strokeWidth="2"
      />
    </svg>
  );
};

export default ClockIcon;
