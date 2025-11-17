import type { FC } from "react";
import styles from "./DashedButton.module.scss";

type Props = {
  children?: React.ReactNode;
  gap?: number;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
};

const DashedButton: FC<Props> = ({ children, gap, onClick }) => {
  return (
    <>
      <span style={{ gap }} className={styles.dashed__button} onClick={onClick}>
        {children}
      </span>
    </>
  );
};

export default DashedButton;
