import type { IconProps } from "../../types";

const TrashIcon = ({ className }: IconProps) => {
  return (
    <>
      <svg
        className={className}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M28 7.97331C23.56 7.53331 19.0933 7.30664 14.64 7.30664C12 7.30664 9.36 7.43997 6.72 7.70664L4 7.97331"
          stroke="#8E51FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.3335 6.6265L11.6268 4.87984C11.8402 3.61317 12.0002 2.6665 14.2535 2.6665H17.7468C20.0002 2.6665 20.1735 3.6665 20.3735 4.89317L20.6668 6.6265"
          stroke="#8E51FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.1334 12.187L24.2667 25.6137C24.12 27.707 24 29.3337 20.28 29.3337H11.72C8.00003 29.3337 7.88003 27.707 7.73337 25.6137L6.8667 12.187"
          stroke="#8E51FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.7734 22H18.2134"
          stroke="#8E51FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6665 16.6665H19.3332"
          stroke="#8E51FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

export default TrashIcon;
