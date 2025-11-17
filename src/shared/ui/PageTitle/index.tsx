import type { FC } from "react";
import styles from "./PageTitle.module.scss";

type Props = {
  children?: React.ReactNode;
};

const PageTitle: FC<Props> = ({ children }) => {
  return (
    <>
      <h1 className={styles.page__title}>{children}</h1>
    </>
  );
};

export default PageTitle;
