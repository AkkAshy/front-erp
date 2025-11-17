import type { IconProps } from "../types";

const CategoryIcon = ({ className, selected }: IconProps) => {
  return (
    <>
      {selected ? (
        <svg
          className={className}
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.25 12.5H23.75C26.25 12.5 27.5 11.25 27.5 8.75V6.25C27.5 3.75 26.25 2.5 23.75 2.5H21.25C18.75 2.5 17.5 3.75 17.5 6.25V8.75C17.5 11.25 18.75 12.5 21.25 12.5Z"
            stroke="#8E51FF"
            strokeWidth="1.875"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.25 27.5H8.75C11.25 27.5 12.5 26.25 12.5 23.75V21.25C12.5 18.75 11.25 17.5 8.75 17.5H6.25C3.75 17.5 2.5 18.75 2.5 21.25V23.75C2.5 26.25 3.75 27.5 6.25 27.5Z"
            stroke="#8E51FF"
            strokeWidth="1.875"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 12.5C10.2614 12.5 12.5 10.2614 12.5 7.5C12.5 4.73858 10.2614 2.5 7.5 2.5C4.73858 2.5 2.5 4.73858 2.5 7.5C2.5 10.2614 4.73858 12.5 7.5 12.5Z"
            stroke="#8E51FF"
            strokeWidth="1.875"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22.5 27.5C25.2614 27.5 27.5 25.2614 27.5 22.5C27.5 19.7386 25.2614 17.5 22.5 17.5C19.7386 17.5 17.5 19.7386 17.5 22.5C17.5 25.2614 19.7386 27.5 22.5 27.5Z"
            stroke="#8E51FF"
            strokeWidth="1.875"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.6667 13.3332H25.3333C28 13.3332 29.3333 11.9998 29.3333 9.33317V6.6665C29.3333 3.99984 28 2.6665 25.3333 2.6665H22.6667C20 2.6665 18.6667 3.99984 18.6667 6.6665V9.33317C18.6667 11.9998 20 13.3332 22.6667 13.3332Z"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22.6667 13.3332H25.3333C28 13.3332 29.3333 11.9998 29.3333 9.33317V6.6665C29.3333 3.99984 28 2.6665 25.3333 2.6665H22.6667C20 2.6665 18.6667 3.99984 18.6667 6.6665V9.33317C18.6667 11.9998 20 13.3332 22.6667 13.3332Z"
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.66666 29.3332H9.33332C12 29.3332 13.3333 27.9998 13.3333 25.3332V22.6665C13.3333 19.9998 12 18.6665 9.33332 18.6665H6.66666C3.99999 18.6665 2.66666 19.9998 2.66666 22.6665V25.3332C2.66666 27.9998 3.99999 29.3332 6.66666 29.3332Z"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.66666 29.3332H9.33332C12 29.3332 13.3333 27.9998 13.3333 25.3332V22.6665C13.3333 19.9998 12 18.6665 9.33332 18.6665H6.66666C3.99999 18.6665 2.66666 19.9998 2.66666 22.6665V25.3332C2.66666 27.9998 3.99999 29.3332 6.66666 29.3332Z"
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.99999 13.3332C10.9455 13.3332 13.3333 10.9454 13.3333 7.99984C13.3333 5.05432 10.9455 2.6665 7.99999 2.6665C5.05447 2.6665 2.66666 5.05432 2.66666 7.99984C2.66666 10.9454 5.05447 13.3332 7.99999 13.3332Z"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.99999 13.3332C10.9455 13.3332 13.3333 10.9454 13.3333 7.99984C13.3333 5.05432 10.9455 2.6665 7.99999 2.6665C5.05447 2.6665 2.66666 5.05432 2.66666 7.99984C2.66666 10.9454 5.05447 13.3332 7.99999 13.3332Z"
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 29.3332C26.9455 29.3332 29.3333 26.9454 29.3333 23.9998C29.3333 21.0543 26.9455 18.6665 24 18.6665C21.0545 18.6665 18.6667 21.0543 18.6667 23.9998C18.6667 26.9454 21.0545 29.3332 24 29.3332Z"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 29.3332C26.9455 29.3332 29.3333 26.9454 29.3333 23.9998C29.3333 21.0543 26.9455 18.6665 24 18.6665C21.0545 18.6665 18.6667 21.0543 18.6667 23.9998C18.6667 26.9454 21.0545 29.3332 24 29.3332Z"
            stroke="black"
            strokeOpacity="0.2"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );
};

export default CategoryIcon;
