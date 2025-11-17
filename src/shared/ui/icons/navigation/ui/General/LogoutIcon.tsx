import type { IconProps } from "../../../types";

const LogoutIcon = ({ className }:IconProps) => {
  return (
    <svg
      className={className}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 24C12 28.2426 12 30.364 13.318 31.682C14.636 33 16.7574 33 21 33H22.5C26.7426 33 28.864 33 30.182 31.682C31.5 30.364 31.5 28.2426 31.5 24V12C31.5 7.75736 31.5 5.63604 30.182 4.31802C28.864 3 26.7426 3 22.5 3H21C16.7574 3 14.636 3 13.318 4.31802C12 5.63604 12 7.75736 12 12"
        stroke="#94A3B8"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="M12 29.25C8.46447 29.25 6.6967 29.25 5.59835 28.1517C4.5 27.0533 4.5 25.2855 4.5 21.75V14.25C4.5 10.7145 4.5 8.9467 5.59835 7.84835C6.6967 6.75 8.46447 6.75 12 6.75"
        stroke="#94A3B8"
        strokeWidth="2.25"
      />
      <path
        d="M9 18L22.5 18M22.5 18L18.75 21.75M22.5 18L18.75 14.25"
        stroke="#94A3B8"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LogoutIcon;
