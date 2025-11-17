import { useEffect, useState, type FC } from "react";
import { ArrowDownIcon, UserSquareIcon } from "../icons";
import { useFilteredUsers } from "@/entities/cashier/model/useFilteredUsers";
import type { User } from "@/entities/cashier/api/types";
import Search from "../Search";

import clsx from "clsx";

//scss
import styles from "./SelectSeller.module.scss";

type Props = {
  userId?: number | string;
  setUserId: React.Dispatch<React.SetStateAction<number | string>>;
  isOpenSellers: boolean;
  setIsOpenSellers: React.Dispatch<React.SetStateAction<boolean>>;
};

const SelectSeller: FC<Props> = ({
  userId,
  setUserId,
  isOpenSellers,
  setIsOpenSellers,
}) => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const users = useFilteredUsers({
    id: "",
    name: search,
  });

  useEffect(() => {
    if (users.data?.data) {
      setUsersData(users.data.data.employees);
    }
  }, [users]);

  return (
    <div
      className={styles.seller__wrapper}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpenSellers((prev) => !prev);
      }}
    >
      <div className={styles.toggle__seller}>
        <div className={styles.title__wrapper}>
          <UserSquareIcon />
          <p className={styles.title}>
            {usersData?.find((user) => user.id === userId)?.first_name || (
              <span>Sotuvchi</span>
            )}
          </p>
        </div>
        <ArrowDownIcon selected={isOpenSellers} />
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(styles.dropdown, isOpenSellers && styles.open)}
      >
        <div className={styles.search__wrapper}>
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none" }}
            placeholder="Sotuvchi qidirish"
          />
        </div>
        <span className={styles.line}></span>
        <ul className={styles.list__sellers}>
          {usersData?.map((user) => (
            <li
              className={clsx(
                styles.seller,
                user.id === userId && styles.selected
              )}
              key={user.id}
              onClick={() => {
                setIsOpenSellers(false);
                setUserId((prev) => (prev === user.id ? "" : user.id));
              }}
            >
              <div className={styles.profile__wrapper}>
                <img
                  src={
                    user?.employee_info?.sex === "Ayol"
                      ? "/female.png"
                      : "/male.png"
                  }
                  alt="avatar"
                />
                <p className={styles.firstname}>{user.first_name}</p>
              </div>
              <span className={styles.role}>{user?.employee_info?.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectSeller;
