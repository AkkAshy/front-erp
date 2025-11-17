import type { IconProps } from "../../types";

const SearchIcon = ({ className }: IconProps) => {
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
        d="M14.375 26.25C20.9334 26.25 26.25 20.9334 26.25 14.375C26.25 7.81659 20.9334 2.49997 14.375 2.49997C7.81662 2.49997 2.5 7.81659 2.5 14.375C2.5 20.9334 7.81662 26.25 14.375 26.25Z"
        stroke="#8E51FF"
        strokeWidth="2.10938"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.5 27.5L25 25"
        stroke="#8E51FF"
        strokeWidth="2.10938"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SearchIcon;
