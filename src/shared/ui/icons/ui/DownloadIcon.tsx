import type { IconProps } from "../types";

const DownloadIcon = ({ className }: IconProps) => {
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
          d="M4 20C4 23.7712 4 25.6569 5.17157 26.8284C6.34315 28 8.22876 28 12 28H20C23.7712 28 25.6569 28 26.8284 26.8284C28 25.6569 28 23.7712 28 20"
          stroke="#8E51FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 4.00004V21.3334M16 21.3334L21.3333 15.5M16 21.3334L10.6667 15.5"
          stroke="#8E51FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

export default DownloadIcon;
