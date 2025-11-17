import type { IconProps } from "../../types";

const CashIcon = ({ className, selected }: IconProps) => {
  return (
    <>
      {selected ? (
        <svg
          className={className}
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28.3333 5.83334H11.6666C6.66665 5.83334 3.33331 8.33334 3.33331 14.1667V25.8333C3.33331 31.6667 6.66665 34.1667 11.6666 34.1667H28.3333C33.3333 34.1667 36.6666 31.6667 36.6666 25.8333V14.1667C36.6666 8.33334 33.3333 5.83334 28.3333 5.83334ZM10.4166 24.1667C10.4166 24.85 9.84998 25.4167 9.16665 25.4167C8.48331 25.4167 7.91665 24.85 7.91665 24.1667V15.8333C7.91665 15.15 8.48331 14.5833 9.16665 14.5833C9.84998 14.5833 10.4166 15.15 10.4166 15.8333V24.1667ZM20 25C17.2333 25 15 22.7667 15 20C15 17.2333 17.2333 15 20 15C22.7666 15 25 17.2333 25 20C25 22.7667 22.7666 25 20 25ZM32.0833 24.1667C32.0833 24.85 31.5166 25.4167 30.8333 25.4167C30.15 25.4167 29.5833 24.85 29.5833 24.1667V15.8333C29.5833 15.15 30.15 14.5833 30.8333 14.5833C31.5166 14.5833 32.0833 15.15 32.0833 15.8333V24.1667Z"
            fill="#8E51FF"
          />
        </svg>
      ) : (
        <svg
          className={className}
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28.3334 34.1666H11.6667C6.66671 34.1666 3.33337 31.6666 3.33337 25.8333V14.1666C3.33337 8.33331 6.66671 5.83331 11.6667 5.83331H28.3334C33.3334 5.83331 36.6667 8.33331 36.6667 14.1666V25.8333C36.6667 31.6666 33.3334 34.1666 28.3334 34.1666Z"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 25C22.7614 25 25 22.7614 25 20C25 17.2386 22.7614 15 20 15C17.2386 15 15 17.2386 15 20C15 22.7614 17.2386 25 20 25Z"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.16663 15.8333V24.1666"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30.8334 15.8333V24.1666"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );
};

export default CashIcon;
