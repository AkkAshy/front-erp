import type { FC } from "react";
import { ArrowDownIcon } from "../icons";
import clsx from "clsx";

//scss
import styles from "./SelectRole.module.scss"; 

type RoleItem = {
  label: string;
  role: string;
};

const mapRole: RoleItem[] = [
  {
    label: "sohib",
    role: "owner",
  },
  {
    label: "menedjer",
    role: "manager",
  },
  {
    label: "kassir",
    role: "cashier",
  },
  {
    label: "omborchi",
    role: "stockkeeper",
  },
];

type Props = {
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  isRoleOpen: boolean;
  setIsRoleOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SelectRole: FC<Props> = ({
  role,
  setRole,
  isRoleOpen,
  setIsRoleOpen,
}) => {
  return (
    <div
      className={styles.select__role}
      onClick={(e) => {
        e.stopPropagation();
        setIsRoleOpen(true);
      }}
    >
      <p
        className={clsx(styles.role__title, role && styles.active)}
        onClick={() => {
          setIsRoleOpen(true);
        }}
      >
        {mapRole.find((item) => item.role === role)?.label ?? "role*"}
      </p>

      <ul className={clsx(styles.role__list, isRoleOpen && styles.active)}>
        {mapRole.map((item) => (
          <li
            key={item.label}
            className={clsx(styles.item, item.role === role && styles.active)}
            onClick={(e) => {
              e.stopPropagation();
              setIsRoleOpen(false);
              setRole(item.role === role ? null : item.role);
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <ArrowDownIcon selected={isRoleOpen} />
    </div>
  );
};

export default SelectRole;
