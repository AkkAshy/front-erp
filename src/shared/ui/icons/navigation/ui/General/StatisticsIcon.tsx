import type { IconProps } from "../../../types";

const StatisticsIcon = ({ className, selected }: IconProps) => {
  return (
    <>
      {
        selected ? (
          <svg className={className} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 23.3286C28.2394 28.934 23.0027 33 16.8163 33C9.18575 33 3 26.8143 3 19.1837C3 12.9973 7.06598 7.76056 12.6714 6" stroke="#8E51FF" strokeWidth="2.25" strokeLinecap="round" />
            <path d="M32.8696 14.9209C31.2773 9.21657 26.7834 4.72268 21.0791 3.13035C18.6137 2.44215 16.5 4.58128 16.5 7.14093V17.1827C16.5 18.4625 17.5375 19.5 18.8173 19.5H28.8591C31.4187 19.5 33.5578 17.3863 32.8696 14.9209Z" fill="#8E51FF" stroke="#8E51FF" strokeWidth="2.25" />
          </svg>

        ) : (
          <svg className={className} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 23.3287C28.2394 28.9341 23.0027 33 16.8163 33C9.18575 33 3 26.8143 3 19.1838C3 12.9974 7.06598 7.7606 12.6714 6.00005" stroke="#94A3B8" strokeWidth="2.25" strokeLinecap="round" />
            <path d="M32.8696 14.9209C31.2773 9.21652 26.7834 4.72264 21.0791 3.13031C18.6137 2.44211 16.5 4.58124 16.5 7.14088V17.1826C16.5 18.4625 17.5375 19.5 18.8173 19.5H28.8591C31.4187 19.5 33.5578 17.3862 32.8696 14.9209Z" stroke="#94A3B8" strokeWidth="2.25" />
          </svg>


        )
      }
    </>
  );
};
export default StatisticsIcon;
