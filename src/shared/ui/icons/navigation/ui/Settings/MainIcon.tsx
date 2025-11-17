import type { IconProps } from "../../../types";

const MainIcon = ({ className, selected }: IconProps) => {
  return (
    <>
      {selected ? (
        <svg
          className={className}
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.765 7.515L21.825 4.575C19.725 2.475 16.275 2.475 14.175 4.575L11.235 7.515C10.65 8.1 10.65 9.06 11.235 9.645L16.95 15.36C17.535 15.945 18.48 15.945 19.065 15.36L24.78 9.645C25.35 9.06 25.35 8.1 24.765 7.515Z"
            fill="#8E51FF"
          />
          <path
            d="M7.515 11.2346L4.575 14.1746C2.475 16.2746 2.475 19.7246 4.575 21.8246L7.515 24.7646C8.1 25.3496 9.045 25.3496 9.63 24.7646L15.345 19.0496C15.93 18.4646 15.93 17.5196 15.345 16.9346L9.645 11.2346C9.06 10.6496 8.1 10.6496 7.515 11.2346Z"
            fill="#8E51FF"
          />
          <path
            d="M31.425 14.1746L28.485 11.2346C27.9 10.6496 26.955 10.6496 26.37 11.2346L20.655 16.9496C20.07 17.5346 20.07 18.4796 20.655 19.0646L26.37 24.7796C26.955 25.3646 27.9 25.3646 28.485 24.7796L31.425 21.8396C33.525 19.7246 33.525 16.2746 31.425 14.1746Z"
            fill="#8E51FF"
          />
          <path
            d="M11.235 28.4851L14.175 31.4251C16.275 33.5251 19.725 33.5251 21.825 31.4251L24.765 28.4851C25.35 27.9001 25.35 26.9551 24.765 26.3701L19.05 20.6551C18.465 20.0701 17.52 20.0701 16.935 20.6551L11.22 26.3701C10.65 26.9401 10.65 27.9001 11.235 28.4851Z"
            fill="#8E51FF"
          />
        </svg>
      ) : (
        <svg
          className={className}
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M31.4252 21.825L21.8401 31.41C19.7401 33.51 16.2902 33.51 14.1752 31.41L4.59014 21.825C2.49014 19.725 2.49014 16.275 4.59014 14.16L14.1752 4.575C16.2752 2.475 19.7251 2.475 21.8401 4.575L31.4252 14.16C33.5252 16.275 33.5252 19.725 31.4252 21.825Z"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M31.4252 21.825L21.8401 31.41C19.7401 33.51 16.2902 33.51 14.1752 31.41L4.59014 21.825C2.49014 19.725 2.49014 16.275 4.59014 14.16L14.1752 4.575C16.2752 2.475 19.7251 2.475 21.8401 4.575L31.4252 14.16C33.5252 16.275 33.5252 19.725 31.4252 21.825Z"
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.375 9.375L26.625 26.625"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.375 9.375L26.625 26.625"
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M26.625 9.375L9.375 26.625"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M26.625 9.375L9.375 26.625"
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );
};

export default MainIcon;
