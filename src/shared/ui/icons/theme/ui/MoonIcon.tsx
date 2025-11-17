import type { IconProps } from "../../types";

const DropIcon = ({ className }: IconProps) => {
  return (
    <svg className={className} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.4256 24.7803C6.09469 34.352 14.2167 42.1394 23.9371 42.5669C30.7953 42.8643 36.9286 39.6675 40.6086 34.6308C42.1327 32.5677 41.3149 31.1924 38.7686 31.657C37.5234 31.8801 36.241 31.973 34.9028 31.9172C25.8143 31.5455 18.3799 23.9439 18.3428 14.9669C18.3242 12.5508 18.826 10.2647 19.7367 8.18308C20.7404 5.87843 19.5323 4.78187 17.209 5.76692C9.84904 8.87076 4.81227 16.2865 5.4256 24.7803Z" stroke="#94A3B8" strokeWidth="2.78788" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default DropIcon;
