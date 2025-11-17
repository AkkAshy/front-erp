import { type FC } from "react";
import { ArrowDownIcon } from "../icons";
import { useUnits } from "@/entities/unit/model/useUnits";
import clsx from "clsx";

//scss
import styles from "./SelectUnit.module.scss";

type Props = {
  unitId?: number | string;
  setUnitId: React.Dispatch<React.SetStateAction<number | string>>;
  isUnitDropdown: boolean;
  setIsUnitDropdown: React.Dispatch<React.SetStateAction<boolean>>;

  width: string | number;
  bgColor?: string;
  top?: number;
};

const SelectUnit: FC<Props> = ({
  unitId,
  setUnitId,
  isUnitDropdown,
  setIsUnitDropdown,
  width,
  bgColor,
  top,
}) => {
  const unitData = useUnits();
  const selectedUnit = unitData?.data?.data.results.find(
    (item) => item.id === unitId
  );

  return (
    <>
      <div
        className={styles.select__unit}
        style={{
          width,
          backgroundColor: bgColor,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsUnitDropdown((prev) => !prev);
        }}
      >
        <div className={styles.toggle__unit}>
          <div className={styles.title__wrapper}>
            <p className={styles.title}>
              {selectedUnit ? (
                selectedUnit.display_name
              ) : (
                <span>O'lchov birligi</span>
              )}
            </p>
          </div>
          <ArrowDownIcon selected={isUnitDropdown} />
        </div>

        <ul
          className={clsx(styles.dropdown, isUnitDropdown && styles.open)}
          style={{
            top,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {unitData &&
            unitData.data?.data.results.map((item) => (
              <li
                key={item.id}
                className={clsx(
                  styles.unit,
                  item.id === unitId && styles.selected
                )}
                onClick={() => {
                  setIsUnitDropdown(false);
                  setUnitId((prev) => (prev === item.id ? "" : item.id));
                }}
              >
                <p>{item.display_name}</p>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default SelectUnit;
