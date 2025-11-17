import type { IconProps } from "../../types";

const MessageIcon = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.91659 22.1666H9.33325C4.66659 22.1666 2.33325 20.9999 2.33325 15.1666V9.33325C2.33325 4.66659 4.66659 2.33325 9.33325 2.33325H18.6666C23.3333 2.33325 25.6666 4.66659 25.6666 9.33325V15.1666C25.6666 19.8333 23.3333 22.1666 18.6666 22.1666H18.0833C17.7216 22.1666 17.3716 22.3416 17.1499 22.6333L15.3999 24.9666C14.6299 25.9933 13.3699 25.9933 12.5999 24.9666L10.8499 22.6333C10.6633 22.3766 10.2316 22.1666 9.91659 22.1666Z"
        stroke="#8E51FF"
        strokeWidth="1.75"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.6626 12.8333H18.6731"
        stroke="#8E51FF"
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.9946 12.8333H14.0051"
        stroke="#8E51FF"
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.32693 12.8333H9.3374"
        stroke="#8E51FF"
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MessageIcon;
