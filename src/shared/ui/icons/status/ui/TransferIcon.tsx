import type { IconProps } from "../../types";

const TransferIcon = ({ className, selected }: IconProps) => {
  return (
    <>
      {selected ? (
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.515 3.16669H31.3183C34.1367 3.16669 34.8333 3.86335 34.8333 6.65002V13.1575C34.8333 15.9442 34.1367 16.6409 31.3183 16.6409H22.515C19.6967 16.6409 19 15.9442 19 13.1575V6.65002C19 3.86335 19.6967 3.16669 22.515 3.16669Z"
            fill="#8E51FF"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.68169 21.375H15.485C18.3034 21.375 19 22.0717 19 24.8583V31.3658C19 34.1525 18.3034 34.8492 15.485 34.8492H6.68169C3.86336 34.8492 3.16669 34.1525 3.16669 31.3658V24.8583C3.16669 22.0717 3.86336 21.375 6.68169 21.375Z"
            fill="#8E51FF"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M34.8334 23.7499C34.8334 29.8774 29.8776 34.8333 23.7501 34.8333L25.4125 32.0624"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.16669 14.25C3.16669 8.12252 8.12252 3.16669 14.25 3.16669L12.5875 5.93752"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 9H36"
            stroke="white"
            strokeWidth="2.25"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 27H21"
            stroke="white"
            strokeWidth="2.25"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          className={className}
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 8.80341H34.8333"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22.515 3.16669H31.3183C34.1367 3.16669 34.8333 3.86335 34.8333 6.65002V13.1575C34.8333 15.9442 34.1367 16.6409 31.3183 16.6409H22.515C19.6967 16.6409 19 15.9442 19 13.1575V6.65002C19 3.86335 19.6967 3.16669 22.515 3.16669Z"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.16675 27.0118H19.0001"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.68175 21.375H15.4851C18.3034 21.375 19.0001 22.0717 19.0001 24.8583V31.3658C19.0001 34.1525 18.3034 34.8492 15.4851 34.8492H6.68175C3.86342 34.8492 3.16675 34.1525 3.16675 31.3658V24.8583C3.16675 22.0717 3.86342 21.375 6.68175 21.375Z"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M34.8333 23.7499C34.8333 29.8774 29.8775 34.8333 23.75 34.8333L25.4125 32.0624"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.16675 14.25C3.16675 8.12252 8.12258 3.16669 14.2501 3.16669L12.5876 5.93752"
            stroke="#8E51FF"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );
};

export default TransferIcon;
