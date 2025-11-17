import type { IconProps } from "../../../types";

const HomeIcon = ({ className, selected }: IconProps) => {
  return (
    <>
      {
        selected ? (
          <svg className={className} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M31.2449 12.015L21.4199 4.15503C19.4999 2.62503 16.4999 2.61003 14.5949 4.14003L4.76994 12.015C3.35994 13.14 2.50494 15.39 2.80494 17.16L4.69494 28.47C5.12994 31.005 7.48494 33 10.0499 33H25.9499C28.4849 33 30.8849 30.96 31.3199 28.455L33.2099 17.145C33.4799 15.39 32.6249 13.14 31.2449 12.015ZM19.1249 27C19.1249 27.615 18.6149 28.125 17.9999 28.125C17.3849 28.125 16.8749 27.615 16.8749 27V22.5C16.8749 21.885 17.3849 21.375 17.9999 21.375C18.6149 21.375 19.1249 21.885 19.1249 22.5V27Z" fill="#8E51FF" />
          </svg>
        ) : (
          <svg className={className} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 27V22.5" stroke="#94A3B8" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.105 4.23002L4.71003 12.555C3.54003 13.485 2.79003 15.45 3.04503 16.92L5.04003 28.86C5.40003 30.99 7.44003 32.715 9.60003 32.715H26.4C28.545 32.715 30.6 30.975 30.96 28.86L32.955 16.92C33.195 15.45 32.445 13.485 31.29 12.555L20.895 4.24502C19.29 2.95502 16.695 2.95502 15.105 4.23002Z" stroke="#94A3B8" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg >

        )
      }
    </>
  );
};

export default HomeIcon;
