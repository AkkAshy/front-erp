import { Outlet } from "react-router-dom";
import PageTitle from "@/shared/ui/PageTitle";
//scss
import styles from "./SettingsLayout.module.scss";
const SettingsLayout = () => {
  return (
    <div className={styles.settings}>
      <PageTitle>Sozlamalar</PageTitle>
      <Outlet />
    </div>
  );
};

export default SettingsLayout;
