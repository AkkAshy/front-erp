import { type FC, useState, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const unitData = useUnits();
  const selectedUnit = unitData?.data?.data?.results?.find(
    (item: { id: number | string }) => item.id === unitId
  );

  // Filter units based on search query
  const filteredUnits = useMemo(() => {
    if (!unitData?.data?.data?.results) return [];
    if (!searchQuery.trim()) return unitData.data.data.results;

    return unitData.data.data.results.filter((item: { display_name: string }) =>
      item.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [unitData?.data?.data?.results, searchQuery]);

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
          {isUnitDropdown && (
            <li className={styles.search__wrapper}>
              <input
                type="text"
                className={styles.search__input}
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </li>
          )}
          {filteredUnits.length > 0 ? (
            filteredUnits.map((item: { id: number; display_name: string }) => (
              <li
                key={item.id}
                className={clsx(
                  styles.unit,
                  item.id === unitId && styles.selected
                )}
                onClick={() => {
                  setIsUnitDropdown(false);
                  setUnitId((prev) => (prev === item.id ? "" : item.id));
                  setSearchQuery("");
                }}
              >
                <p>{item.display_name}</p>
              </li>
            ))
          ) : (
            <li className={styles.no__results}>
              <p>Hech narsa topilmadi</p>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default SelectUnit;
