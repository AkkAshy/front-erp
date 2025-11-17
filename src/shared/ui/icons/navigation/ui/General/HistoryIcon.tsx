import type { IconProps } from "../../../types";

const HistoryIcon = ({ className, selected }: IconProps) => {
  return (
    <>
      {
        selected ? (
          <svg className={className} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.0001 3.16675C10.2759 3.16675 3.16675 10.2759 3.16675 19.0001C3.16675 27.7242 10.2759 34.8334 19.0001 34.8334C27.7242 34.8334 34.8334 27.7242 34.8334 19.0001C34.8334 10.2759 27.7242 3.16675 19.0001 3.16675ZM25.8876 24.6526C25.6659 25.0326 25.2701 25.2384 24.8584 25.2384C24.6526 25.2384 24.4467 25.1909 24.2567 25.0642L19.3484 22.1351C18.1292 21.4067 17.2267 19.8076 17.2267 18.3984V11.9067C17.2267 11.2576 17.7651 10.7192 18.4142 10.7192C19.0634 10.7192 19.6017 11.2576 19.6017 11.9067V18.3984C19.6017 18.9684 20.0767 19.8076 20.5676 20.0926L25.4759 23.0217C26.0459 23.3542 26.2359 24.0826 25.8876 24.6526Z" fill="#8E51FF" />
          </svg>
        ) : (
          <svg className={className} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19.0001" cy="19.0001" r="15.8333" stroke="#94A3B8" strokeWidth="2.375" />
            <path d="M19 12.6667V19.0001L22.9583 22.9584" stroke="#94A3B8" strokeWidth="2.375" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      }
    </>
  );
};

export default HistoryIcon;
