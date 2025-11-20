import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import type { IconProps } from "@/shared/ui/icons/types";
import CategoryIcon from "@/shared/ui/icons/ui/CategoryIcon";
import SellerIcon from "@/shared/ui/icons/ui/SellerIcon";
import UserSquareIcon from "@/shared/ui/icons/ui/UserSquareIcon";
import {
  BarcodeIcon,
  MainIcon,
  SizesIcon,
  WalletIcon,
} from "@/shared/ui/icons";

import clsx from "clsx";

//scss
import styles from "./SettingsSidebar.module.scss";

const sidebarItems = [
  { key: "main", title: "Asosiy" },
  // { key: "sizes", title: "Razmerlar" }, // Временно отключено
  { key: "category", title: "Kategoriya" },
  { key: "attributes", title: "Atributlar" },
  { key: "payment", title: "To'lov turi" },
  { key: "barcode", title: "Bar kod" },
  { key: "seller", title: "Ishchilar" },
  // { key: "staff-credentials", title: "Kirish ma'lumotlari" }, // Удалено - дублирует функционал
  { key: "store-management", title: "Do'konlar boshqaruvi" },
];

const iconsMap: Record<string, FC<IconProps>> = {
  main: MainIcon,
  sizes: SizesIcon,
  category: CategoryIcon,
  attributes: CategoryIcon,
  payment: WalletIcon,
  barcode: BarcodeIcon,
  seller: SellerIcon,
  "staff-credentials": UserSquareIcon,
  "store-management": MainIcon, // Using MainIcon for now, can be changed to a store-specific icon
};

type Props = {
  curretPage: string;
  setCurretPage: React.Dispatch<React.SetStateAction<string>>;
  isOpenSettingsSidebar: boolean;
  setIsOpenSettingsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const SettingsSidebar: FC<Props> = ({
  setIsOpenSettingsSidebar,
  isOpenSettingsSidebar,
  curretPage,
  setCurretPage,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={clsx(
        styles.settings__sidebar,
        isOpenSettingsSidebar && styles.open
      )}
    >
      <ul className={styles.nav_list}>
        {sidebarItems.map((item) => {
          const Icon = iconsMap[item.key];
          return (
            <li
              key={item.key}
              onClick={() => {
                navigate(`settings/${item.key}`);
                setIsOpenSettingsSidebar(false);
                setCurretPage(item.key);
              }}
              className={clsx(
                styles.item,
                curretPage === item.key && styles.active
              )}
            >
              <span className={styles.nav__icon}>
                {<Icon selected={curretPage === item.key} />}
              </span>
              <p className={styles.nav__title}>{item.title}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SettingsSidebar;
