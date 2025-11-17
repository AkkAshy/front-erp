import { type FC } from "react";
import { ArrowDownIcon } from "../icons";
import styles from "./SelectGender.module.scss";
import clsx from "clsx";

type Gender = "Erkak" | "Ayol" | null;

type Props = {
  gender: Gender | string;
  setGender: React.Dispatch<React.SetStateAction<Gender | string>>;
  isSelected: boolean;
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
};

const SelectGender: FC<Props> = ({
  gender,
  setGender,
  isSelected,
  setIsSelected,
}) => {
  const GENDERS = ["Erkak", "Ayol"] as const;

  return (
    <div
      className={styles.select__gender}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(true);
      }}
    >
      <p className={clsx(styles.gender__title, gender && styles.active)}>
        {gender ?? "Jinsingiz*"}
      </p>

      <ul className={clsx(styles.gender__list, isSelected && styles.active)}>
        {GENDERS.map((item) => (
          <li
            key={item}
            className={clsx(styles.item, gender === item && styles.active)}
            onClick={(e) => {
              e.stopPropagation();
              setIsSelected(false);
              setGender(item === gender ? null : item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
      <ArrowDownIcon selected={isSelected} />
    </div>
  );
};

export default SelectGender;
