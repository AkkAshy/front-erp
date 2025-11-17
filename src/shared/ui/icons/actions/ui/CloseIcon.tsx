import type { IconProps } from "../../types";

const CloseIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.12 26.5599L17.4266 17.8666C16.3999 16.8399 16.3999 15.1599 17.4266 14.1333L26.12 5.43994"
        stroke="#8E51FF"
        strokeWidth="2.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 26.5599L14.6933 17.8666C15.72 16.8399 15.72 15.1599 14.6933 14.1333L6 5.43994"
        stroke="#8E51FF"
        strokeWidth="2.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CloseIcon;
